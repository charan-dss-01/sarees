import type { Request, Response, NextFunction } from "express";
import { Enquiry } from "../models/Enquiry.js";
import mongoose from "mongoose";
import { getIo } from "../socket/index.js";

/* ── POST /api/enquiry ───────────────────────────────────── */
export async function createEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const sareeTitle =
      typeof body["sareeTitle"] === "string" && body["sareeTitle"].trim().length > 0
        ? body["sareeTitle"].trim().slice(0, 200)
        : "Unknown Saree";
    const rawId = body["sareeId"];
    const sareeId =
      typeof rawId === "string" && mongoose.Types.ObjectId.isValid(rawId)
        ? new mongoose.Types.ObjectId(rawId)
        : null;

    const enquiry = await Enquiry.create({ sareeId, sareeTitle });

    /* notify admin panel via socket */
    try {
      getIo().emit("new_enquiry", {
        sareeTitle,
        createdAt: enquiry.createdAt,
      });
    } catch { /* socket optional */ }

    res.status(201).json({ status: "success", data: { id: enquiry._id } });
  } catch (err) { next(err); }
}

/* ── GET /api/enquiry ────────────────────────────────────── */
export async function getEnquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.status(200).json({ status: "success", count: enquiries.length, data: enquiries });
  } catch (err) { next(err); }
}
