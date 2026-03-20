import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { Assignment } from "../models/Assignment";
import { GenerationResult } from "../models/GenerationResult";
import { enqueueGenerationJob, getJobStatus } from "../services/queueService";
import { emitJobEvent } from "../config/websocket";
import { cacheGet, cacheSet, cacheDel } from "../config/redis";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse";

const ASSIGNMENTS_CACHE_PREFIX = "assignments:teacher:";
const RESULT_CACHE_PREFIX = "result:";

// ── GET /api/assignments ──
export async function listAssignments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;
    const { search, status } = req.query;
    const teacherId = req.teacher!.userId;

    // Try cache (only first page, no filters)
    if (page === 1 && !search && !status) {
      const cached = await cacheGet<{ data: unknown[]; total: number }>(
        `${ASSIGNMENTS_CACHE_PREFIX}${teacherId}:p1`
      );
      if (cached) {
        sendPaginated(res, cached.data as never[], cached.total, page, limit);
        return;
      }
    }

    const query: mongoose.FilterQuery<typeof Assignment> = { teacherId };
    if (search) query.title = { $regex: search, $options: "i" };
    if (status) query.status = status;

    const [assignments, total] = await Promise.all([
      Assignment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Assignment.countDocuments(query),
    ]);

    // Cache first page
    if (page === 1 && !search && !status) {
      await cacheSet(`${ASSIGNMENTS_CACHE_PREFIX}${teacherId}:p1`, { data: assignments, total }, 60);
    }

    sendPaginated(res, assignments, total, page, limit);
  } catch (err) {
    next(err);
  }
}

// ── GET /api/assignments/:id ──
export async function getAssignment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid assignment ID", 400);
      return;
    }

    const assignment = await Assignment.findOne({ _id: id, teacherId: req.teacher!.userId }).lean();
    if (!assignment) {
      sendError(res, "Assignment not found", 404);
      return;
    }

    sendSuccess(res, assignment);
  } catch (err) {
    next(err);
  }
}

// ── POST /api/assignments ── (Step 1: create, Step 2: auto-enqueue generation)
export async function createAssignment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, "Validation failed", 422, errors.array());
      return;
    }

    const { title, subject, className, dueDate, questionTypes, additionalInstructions } = req.body;
    const teacherId = req.teacher!.userId;

    // 1. Persist the assignment record
    const assignment = await Assignment.create({
      title,
      subject,
      className,
      dueDate: new Date(dueDate),
      questionTypes,
      additionalInstructions,
      teacherId,
      status: "draft",
    });

    // 2. Enqueue the AI generation job
    const jobId = await enqueueGenerationJob({
      assignmentId: assignment._id.toString(),
      teacherId,
      subject,
      className,
      questionTypes,
      additionalInstructions,
    });

    // 3. Update assignment with jobId + status
    assignment.jobId = jobId;
    assignment.status = "generating";
    await assignment.save();

    // 4. Notify frontend: job queued
    emitJobEvent(jobId, {
      type: "JOB_QUEUED",
      jobId,
      message: "Question paper generation has been queued",
      data: { assignmentId: assignment._id.toString() },
    });

    // 5. Invalidate cache
    await cacheDel(`${ASSIGNMENTS_CACHE_PREFIX}${teacherId}:p1`);

    sendSuccess(res, {
      assignment: {
        id: assignment._id,
        title: assignment.title,
        status: assignment.status,
        jobId,
      },
      jobId,
      message: "Assignment created. Generation has started in the background.",
    }, "Assignment created successfully", 201);
  } catch (err) {
    next(err);
  }
}

// ── PATCH /api/assignments/:id ──
export async function updateAssignment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid assignment ID", 400);
      return;
    }

    const allowedFields = ["title", "dueDate", "additionalInstructions"];
    const updates: Record<string, unknown> = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const assignment = await Assignment.findOneAndUpdate(
      { _id: id, teacherId: req.teacher!.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!assignment) {
      sendError(res, "Assignment not found", 404);
      return;
    }

    await cacheDel(`${ASSIGNMENTS_CACHE_PREFIX}${req.teacher!.userId}:p1`);
    sendSuccess(res, assignment, "Assignment updated");
  } catch (err) {
    next(err);
  }
}

// ── DELETE /api/assignments/:id ──
export async function deleteAssignment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid assignment ID", 400);
      return;
    }

    const assignment = await Assignment.findOneAndDelete({ _id: id, teacherId: req.teacher!.userId });
    if (!assignment) {
      sendError(res, "Assignment not found", 404);
      return;
    }

    // Also delete related result and cache
    if (assignment.resultId) {
      await GenerationResult.findByIdAndDelete(assignment.resultId);
      await cacheDel(`${RESULT_CACHE_PREFIX}${assignment.resultId}`);
    }
    await cacheDel(`${ASSIGNMENTS_CACHE_PREFIX}${req.teacher!.userId}:p1`);

    sendSuccess(res, { id }, "Assignment deleted successfully");
  } catch (err) {
    next(err);
  }
}

// ── GET /api/assignments/:id/status ── (poll job state)
export async function getAssignmentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid assignment ID", 400);
      return;
    }

    const assignment = await Assignment.findOne({ _id: id, teacherId: req.teacher!.userId }).lean();
    if (!assignment) {
      sendError(res, "Assignment not found", 404);
      return;
    }

    let jobStatus = null;
    if (assignment.jobId) {
      jobStatus = await getJobStatus(assignment.jobId);
    }

    sendSuccess(res, {
      assignmentId: id,
      status: assignment.status,
      jobId: assignment.jobId,
      jobStatus,
      resultId: assignment.resultId,
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/assignments/:id/result ── (fetch generated paper)
export async function getAssignmentResult(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid assignment ID", 400);
      return;
    }

    const assignment = await Assignment.findOne({ _id: id, teacherId: req.teacher!.userId }).lean();
    if (!assignment) {
      sendError(res, "Assignment not found", 404);
      return;
    }

    if (assignment.status !== "ready" || !assignment.resultId) {
      sendError(res, "Paper generation is not complete yet", 202);
      return;
    }

    // Check cache first
    const cacheKey = `${RESULT_CACHE_PREFIX}${assignment.resultId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      sendSuccess(res, cached, "Fetched from cache");
      return;
    }

    const result = await GenerationResult.findById(assignment.resultId).lean();
    if (!result) {
      sendError(res, "Generation result not found", 404);
      return;
    }

    // Cache for 1 hour
    await cacheSet(cacheKey, result, 3600);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

// ── POST /api/assignments/:id/regenerate ──
export async function regenerateAssignment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid assignment ID", 400);
      return;
    }

    const assignment = await Assignment.findOne({ _id: id, teacherId: req.teacher!.userId });
    if (!assignment) {
      sendError(res, "Assignment not found", 404);
      return;
    }

    // Delete old result
    if (assignment.resultId) {
      await GenerationResult.findByIdAndDelete(assignment.resultId);
      await cacheDel(`${RESULT_CACHE_PREFIX}${assignment.resultId}`);
    }

    // Re-enqueue
    const jobId = await enqueueGenerationJob({
      assignmentId: assignment._id.toString(),
      teacherId: req.teacher!.userId,
      subject: assignment.subject,
      className: assignment.className,
      questionTypes: assignment.questionTypes,
      additionalInstructions: assignment.additionalInstructions,
    });

    assignment.jobId = jobId;
    assignment.status = "generating";
    assignment.resultId = undefined;
    await assignment.save();

    emitJobEvent(jobId, {
      type: "JOB_QUEUED",
      jobId,
      message: "Regeneration queued",
      data: { assignmentId: id },
    });

    sendSuccess(res, { jobId, assignmentId: id }, "Regeneration started");
  } catch (err) {
    next(err);
  }
}
