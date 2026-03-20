import { Router } from "express";
import { body } from "express-validator";
import { register, login, getMe, logout } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("schoolName").optional().trim(),
    body("schoolLocation").optional().trim(),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.get("/me", requireAuth, getMe);
router.post("/logout", requireAuth, logout);

export default router;
