import { Router } from "express";
import { body, query } from "express-validator";
import {
  listAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentStatus,
  getAssignmentResult,
  regenerateAssignment,
} from "../controllers/assignmentController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// All assignment routes require authentication
router.use(requireAuth);

// GET /api/assignments?page=1&limit=10&search=quiz&status=ready
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("status").optional().isIn(["draft", "generating", "ready", "failed"]),
  ],
  listAssignments
);

// GET /api/assignments/:id
router.get("/:id", getAssignment);

// POST /api/assignments  — creates + auto-enqueues generation
router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 200 }),
    body("subject").trim().notEmpty().withMessage("Subject is required"),
    body("className").trim().notEmpty().withMessage("Class name is required"),
    body("dueDate").isISO8601().withMessage("Due date must be a valid date"),
    body("questionTypes")
      .isArray({ min: 1 })
      .withMessage("At least one question type is required"),
    body("questionTypes.*.type").notEmpty().withMessage("Question type name is required"),
    body("questionTypes.*.numberOfQuestions")
      .isInt({ min: 1 })
      .withMessage("Number of questions must be a positive integer"),
    body("questionTypes.*.marksPerQuestion")
      .isInt({ min: 1 })
      .withMessage("Marks per question must be a positive integer"),
    body("additionalInstructions").optional().trim().isLength({ max: 1000 }),
  ],
  createAssignment
);

// PATCH /api/assignments/:id
router.patch("/:id", updateAssignment);

// DELETE /api/assignments/:id
router.delete("/:id", deleteAssignment);

// GET /api/assignments/:id/status  — poll job state
router.get("/:id/status", getAssignmentStatus);

// GET /api/assignments/:id/result  — fetch generated paper
router.get("/:id/result", getAssignmentResult);

// POST /api/assignments/:id/regenerate
router.post("/:id/regenerate", regenerateAssignment);

export default router;
