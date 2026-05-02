import type { Request, Response, NextFunction } from "express";
import { requireString } from "../middlewares/validate.js";
import { getIo } from "../socket/index.js";
import { AppError } from "../utils/AppError.js";

/* ── POST /api/broadcast ─────────────────────────────────── */
export async function broadcastMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const message = requireString(body["message"], "message", { min: 1, max: 500 });

    let io;
    try {
      io = getIo();
    } catch {
      throw new AppError("Real-time service is not available.", 503);
    }

    io.emit("admin_message", { message, sentAt: new Date().toISOString() });

    req.log.info({ message }, "Admin broadcast sent");
    res.status(200).json({ status: "success", message: "Broadcast sent to all connected clients." });
  } catch (err) { next(err); }
}
