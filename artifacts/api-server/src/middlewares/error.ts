import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { logger } from "../lib/logger.js";

interface MongooseValidationError extends Error {
  name: "ValidationError";
  errors: Record<string, { message: string }>;
}

interface MongoDuplicateError extends Error {
  code: number;
  keyValue: Record<string, unknown>;
}

function isMongoDuplicate(err: unknown): err is MongoDuplicateError {
  return typeof err === "object" && err !== null && "code" in err && (err as MongoDuplicateError).code === 11000;
}

function isValidationError(err: unknown): err is MongooseValidationError {
  return err instanceof Error && err.name === "ValidationError";
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ status: "error", message: err.message });
    return;
  }

  if (isMongoDuplicate(err)) {
    const field = Object.keys(err.keyValue)[0] ?? "field";
    res.status(409).json({ status: "error", message: `${field} already exists.` });
    return;
  }

  if (isValidationError(err)) {
    const messages = Object.values(err.errors).map((e) => e.message);
    res.status(422).json({ status: "error", message: messages.join(", ") });
    return;
  }

  logger.error({ err, url: req.url, method: req.method }, "Unhandled server error");
  res.status(500).json({ status: "error", message: "Internal server error." });
}
