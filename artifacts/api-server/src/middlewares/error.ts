import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { logger } from "../lib/logger.js";

/* ── type guards ─────────────────────────────────────────── */
interface MongooseBufferingError extends Error {
  name: "MongooseError";
}
function isMongooseBufferingTimeout(e: unknown): e is MongooseBufferingError {
  return e instanceof Error && e.name === "MongooseError" && e.message.includes("buffering timed out");
}


interface MongooseValidationError extends Error {
  name: "ValidationError";
  errors: Record<string, { message: string }>;
}
interface MongoDuplicateError extends Error {
  code: number;
  keyValue: Record<string, unknown>;
}
interface MongooseCastError extends Error {
  name: "CastError";
  path: string;
  value: unknown;
}
interface MulterError extends Error {
  name: "MulterError";
  code: string;
}

function isMongoDuplicate(e: unknown): e is MongoDuplicateError {
  return typeof e === "object" && e !== null && "code" in e &&
    (e as MongoDuplicateError).code === 11000;
}
function isValidationError(e: unknown): e is MongooseValidationError {
  return e instanceof Error && e.name === "ValidationError";
}
function isCastError(e: unknown): e is MongooseCastError {
  return e instanceof Error && e.name === "CastError";
}
function isMulterError(e: unknown): e is MulterError {
  return e instanceof Error && e.name === "MulterError";
}
function isJwtError(e: unknown): boolean {
  return e instanceof Error &&
    (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError" || e.name === "NotBeforeError");
}

/* ── main handler ────────────────────────────────────────── */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  /* operational errors — known, safe to expose */
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ status: "error", message: err.message });
    return;
  }

  /* Mongoose: invalid ObjectId in URL params */
  if (isCastError(err)) {
    res.status(400).json({
      status: "error",
      message: `Invalid value for field "${err.path}".`,
    });
    return;
  }

  /* Mongoose: schema validation failures */
  if (isValidationError(err)) {
    const messages = Object.values(err.errors).map((e) => e.message);
    res.status(422).json({ status: "error", message: messages.join(", ") });
    return;
  }

  /* MongoDB: unique index violation */
  if (isMongoDuplicate(err)) {
    const field = Object.keys(err.keyValue)[0] ?? "field";
    res.status(409).json({ status: "error", message: `${field} already exists.` });
    return;
  }

  /* Mongoose: DB not connected (no MONGODB_URI) */
  if (isMongooseBufferingTimeout(err)) {
    res.status(503).json({
      status: "error",
      message: "Database is unavailable. Please configure MONGODB_URI and restart the server.",
    });
    return;
  }

  /* JWT: invalid or expired token */
  if (isJwtError(err)) {
    const msg = err instanceof Error && err.name === "TokenExpiredError"
      ? "Your session has expired. Please log in again."
      : "Invalid authentication token.";
    res.status(401).json({ status: "error", message: msg });
    return;
  }

  /* Multer: file too large or wrong field */
  if (isMulterError(err)) {
    const msg = (err as MulterError).code === "LIMIT_FILE_SIZE"
      ? "File is too large. Maximum size is 10 MB."
      : `Upload error: ${(err as Error).message}`;
    res.status(413).json({ status: "error", message: msg });
    return;
  }

  /* unknown / programmer errors — log and hide details */
  logger.error({ err, url: req.url, method: req.method }, "Unhandled server error");
  res.status(500).json({ status: "error", message: "Internal server error." });
}

/* ── 404 catch-all (mount after all routes) ─────────────── */
export function notFound(req: Request, res: Response): void {
  res.status(404).json({ status: "error", message: `Route ${req.method} ${req.path} not found.` });
}
