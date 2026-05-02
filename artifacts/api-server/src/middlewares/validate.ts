/**
 * Lightweight request-validation helpers.
 * Throws AppError with HTTP 400/422 so the central error handler formats the response.
 */
import { AppError } from "../utils/AppError.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ── primitives ──────────────────────────────────────────── */
export function requireString(
  value: unknown,
  field: string,
  { min = 1, max = 500 }: { min?: number; max?: number } = {},
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AppError(`${field} is required.`, 400);
  }
  const v = value.trim();
  if (v.length < min) throw new AppError(`${field} must be at least ${min} characters.`, 422);
  if (v.length > max) throw new AppError(`${field} must be at most ${max} characters.`, 422);
  return v;
}

export function requirePositiveNumber(value: unknown, field: string): number {
  const n = typeof value === "string" ? parseFloat(value) : Number(value);
  if (!isFinite(n) || n <= 0) {
    throw new AppError(`${field} must be a positive number.`, 422);
  }
  return n;
}

export function requireEmail(value: unknown): string {
  const email = requireString(value, "Email", { max: 254 }).toLowerCase();
  if (!EMAIL_RE.test(email)) throw new AppError("Please provide a valid email address.", 422);
  return email;
}

export function requirePassword(value: unknown): string {
  const pw = requireString(value, "Password", { min: 8, max: 128 });
  return pw;
}

export function validateMongoId(value: string | string[] | undefined, field = "id"): asserts value is string {
  const v = Array.isArray(value) ? value[0] : value;
  if (!v || !/^[a-f\d]{24}$/i.test(v)) {
    throw new AppError(`Invalid ${field}.`, 400);
  }
}

/* ── pagination helpers ──────────────────────────────────── */
export function parsePagination(
  query: Record<string, string>,
  defaults: { page?: number; limit?: number } = {},
): { page: number; limit: number; skip: number } {
  const page  = Math.max(1, parseInt(query["page"]  ?? String(defaults.page  ?? 1),  10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query["limit"] ?? String(defaults.limit ?? 20), 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
}
