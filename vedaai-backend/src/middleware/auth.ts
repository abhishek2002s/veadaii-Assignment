import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt";
import { sendError } from "../utils/apiResponse";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      teacher?: TokenPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, "Authentication required. Provide a Bearer token.", 401);
    return;
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);

  if (!payload) {
    sendError(res, "Invalid or expired token.", 401);
    return;
  }

  req.teacher = payload;
  next();
}
