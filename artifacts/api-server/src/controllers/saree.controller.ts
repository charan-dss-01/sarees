import type { Request, Response, NextFunction } from "express";
import { Saree } from "../models/Saree.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";
import { AppError } from "../utils/AppError.js";
import {
  requireString,
  requirePositiveNumber,
  validateMongoId,
  parsePagination,
} from "../middlewares/validate.js";
import { sendWhatsAppNotification } from "../utils/whatsapp.js";

/* ── GET /sarees ─────────────────────────────────────────── */
export async function getAllSarees(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const q = req.query as Record<string, string>;
    const { page, limit, skip } = parsePagination(q, { limit: 20 });

    const filter: Record<string, unknown> = {};
    if (q["collection"]) {
      validateMongoId(q["collection"], "collection");
      filter["collection"] = q["collection"];
    }
    if (q["fabric"]) filter["fabric"] = { $regex: q["fabric"].trim(), $options: "i" };

    const [sarees, total] = await Promise.all([
      Saree.find(filter)
        .populate("collection", "name image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Saree.countDocuments(filter),
    ]);

    res.status(200).json({
      status: "success",
      count:  sarees.length,
      total,
      page,
      pages:  Math.ceil(total / limit),
      data:   sarees,
    });
  } catch (err) { next(err); }
}

/* ── GET /sarees/:id ─────────────────────────────────────── */
export async function getSareeById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    validateMongoId(req.params["id"] ?? "", "saree id");
    const saree = await Saree.findById(req.params["id"])
      .populate("collection", "name image")
      .lean();
    if (!saree) throw new AppError("Saree not found.", 404);
    res.status(200).json({ status: "success", data: saree });
  } catch (err) { next(err); }
}

/* ── POST /sarees ────────────────────────────────────────── */
export async function createSaree(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;

    const title      = requireString(body["title"],      "Title",      { max: 200 });
    const fabric     = requireString(body["fabric"],     "Fabric",     { max: 100 });
    const collection = requireString(body["collection"], "Collection");
    const price      = requirePositiveNumber(body["price"], "Price");

    validateMongoId(collection, "collection");

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files?.length) throw new AppError("At least one image is required.", 400);

    const uploads = await Promise.all(
      files.map((f) => uploadToCloudinary(f.buffer, "ananya/sarees", { width: 1600 })),
    );

    const saree = await Saree.create({
      title,
      price,
      fabric,
      collection,
      images: uploads.map((u) => u.url),
    });

    const populated = await saree.populate("collection", "name");

    /* non-blocking notifications — failure must not break the response */
    try { sendWhatsAppNotification({ title, price }); } catch { /* intentional */ }
    try {
      const { getIo } = await import("../socket/index.js");
      getIo().emit("new_saree", {
        title,
        price,
        image: uploads[0]?.url ?? "",
      });
    } catch { /* socket may not be ready */ }

    res.status(201).json({ status: "success", data: populated });
  } catch (err) { next(err); }
}

/* ── PUT /sarees/:id ─────────────────────────────────────── */
export async function updateSaree(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    validateMongoId(req.params["id"] ?? "", "saree id");
    const saree = await Saree.findById(req.params["id"]);
    if (!saree) throw new AppError("Saree not found.", 404);

    const body = req.body as Record<string, unknown>;

    if (body["title"] !== undefined)
      saree.title = requireString(body["title"], "Title", { max: 200 });
    if (body["fabric"] !== undefined)
      saree.fabric = requireString(body["fabric"], "Fabric", { max: 100 });
    if (body["collection"] !== undefined) {
      const col = requireString(body["collection"], "Collection");
      validateMongoId(col, "collection");
      saree.collection = col as unknown as typeof saree.collection;
    }
    if (body["price"] !== undefined)
      saree.price = requirePositiveNumber(body["price"], "Price");

    const files = req.files as Express.Multer.File[] | undefined;
    if (files?.length) {
      const uploads = await Promise.all(
        files.map((f) => uploadToCloudinary(f.buffer, "ananya/sarees", { width: 1600 })),
      );
      saree.images = uploads.map((u) => u.url);
    }

    await saree.save();
    const populated = await saree.populate("collection", "name");
    res.status(200).json({ status: "success", data: populated });
  } catch (err) { next(err); }
}

/* ── DELETE /sarees/:id ──────────────────────────────────── */
export async function deleteSaree(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    validateMongoId(req.params["id"] ?? "", "saree id");
    const saree = await Saree.findByIdAndDelete(req.params["id"]);
    if (!saree) throw new AppError("Saree not found.", 404);
    res.status(200).json({ status: "success", message: "Saree deleted." });
  } catch (err) { next(err); }
}
