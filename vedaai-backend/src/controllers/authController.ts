import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { Teacher } from "../models/Teacher";
import { signToken } from "../utils/jwt";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { cacheSet, cacheDel } from "../config/redis";

// POST /api/auth/register
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, "Validation failed", 422, errors.array());
      return;
    }

    const { name, email, password, schoolName, schoolLocation } = req.body;

    const existing = await Teacher.findOne({ email });
    if (existing) {
      sendError(res, "An account with this email already exists", 409);
      return;
    }

    const teacher = await Teacher.create({ name, email, password, schoolName, schoolLocation });
    const token = signToken({ userId: teacher._id.toString(), email: teacher.email });

    sendSuccess(res, {
      token,
      teacher: { id: teacher._id, name: teacher.name, email: teacher.email, schoolName: teacher.schoolName },
    }, "Registration successful", 201);
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, "Validation failed", 422, errors.array());
      return;
    }

    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email }).select("+password");

    if (!teacher || !(await teacher.comparePassword(password))) {
      sendError(res, "Invalid email or password", 401);
      return;
    }

    const token = signToken({ userId: teacher._id.toString(), email: teacher.email });

    // Cache teacher profile for fast lookups
    await cacheSet(`teacher:${teacher._id}`, {
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      schoolName: teacher.schoolName,
      schoolLocation: teacher.schoolLocation,
    });

    sendSuccess(res, {
      token,
      teacher: { id: teacher._id, name: teacher.name, email: teacher.email, schoolName: teacher.schoolName },
    }, "Login successful");
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const teacher = await Teacher.findById(req.teacher!.userId);
    if (!teacher) {
      sendError(res, "Teacher not found", 404);
      return;
    }
    sendSuccess(res, { id: teacher._id, name: teacher.name, email: teacher.email, schoolName: teacher.schoolName, schoolLocation: teacher.schoolLocation });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/logout
export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await cacheDel(`teacher:${req.teacher!.userId}`);
    sendSuccess(res, null, "Logged out successfully");
  } catch (err) {
    next(err);
  }
}
