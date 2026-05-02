/**
 * NoSQL injection sanitizer — Express 5 compatible.
 *
 * express-mongo-sanitize 2.x tries to overwrite req.query which is a
 * read-only getter in Express 5 and throws a TypeError at runtime.
 * This middleware achieves the same protection by recursively stripping
 * keys that start with '$' or contain '.' from req.body only (the attack
 * surface for NoSQL injection via JSON payloads).
 */
import type { Request, Response, NextFunction } from "express";

function strip(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(strip);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (!k.startsWith("$") && !k.includes(".")) {
        out[k] = strip(v);
      }
    }
    return out;
  }
  return value;
}

export function sanitizeBody(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === "object") {
    req.body = strip(req.body);
  }
  next();
}
