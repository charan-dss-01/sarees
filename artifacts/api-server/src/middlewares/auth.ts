import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

declare global {
  namespace Express {
    interface Request {
      admin?: { id: string; email: string };
    }
  }
}

export function protect(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Authentication required. Provide a Bearer token.", 401);
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    req.admin = { id: decoded.id, email: decoded.email };
    next();
  } catch (err: unknown) {
    if (err instanceof AppError) return next(err);
    next(new AppError("Invalid or expired token.", 401));
  }
}
