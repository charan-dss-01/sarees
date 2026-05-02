import type { Request, Response, NextFunction } from "express";
import { Collection } from "../models/Collection.js";
import { Saree } from "../models/Saree.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinary.service.js";
import { AppError } from "../utils/AppError.js";
import { requireString, validateMongoId } from "../middlewares/validate.js";

/* ── GET /collections ────────────────────────────────────── */
export async function getAllCollections(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ status: "success", count: collections.length, data: collections });
  } catch (err) { next(err); }
}

/* ── GET /collections/:id ────────────────────────────────── */
export async function getCollectionById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    validateMongoId(req.params["id"] ?? "", "collection id");
    const collection = await Collection.findById(req.params["id"]).lean();
    if (!collection) throw new AppError("Collection not found.", 404);
    res.status(200).json({ status: "success", data: collection });
  } catch (err) { next(err); }
}

/* ── POST /collections ───────────────────────────────────── */
export async function createCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const name = requireString(body["name"], "Collection name", { max: 80 });

    if (!req.file) throw new AppError("Collection image is required.", 400);

    const { url } = await uploadToCloudinary(req.file.buffer, "ananya/collections", { width: 1200 });
    const collection = await Collection.create({ name, image: url });

    res.status(201).json({ status: "success", data: collection });
  } catch (err) { next(err); }
}

/* ── PUT /collections/:id ────────────────────────────────── */
export async function updateCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    validateMongoId(req.params["id"] ?? "", "collection id");
    const collection = await Collection.findById(req.params["id"]);
    if (!collection) throw new AppError("Collection not found.", 404);

    const body = req.body as Record<string, unknown>;
    if (body["name"] !== undefined)
      collection.name = requireString(body["name"], "Collection name", { max: 80 });

    if (req.file) {
      /* delete old image from Cloudinary before uploading new one */
      const oldPublicId = extractPublicId(collection.image);
      if (oldPublicId) await deleteFromCloudinary(oldPublicId).catch(() => void 0);

      const { url } = await uploadToCloudinary(req.file.buffer, "ananya/collections", { width: 1200 });
      collection.image = url;
    }

    await collection.save();
    res.status(200).json({ status: "success", data: collection });
  } catch (err) { next(err); }
}

/* ── DELETE /collections/:id ─────────────────────────────── */
export async function deleteCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    validateMongoId(req.params["id"] ?? "", "collection id");

    /* prevent deletion if sarees still belong to this collection */
    const sareeCount = await Saree.countDocuments({ collection: req.params["id"] });
    if (sareeCount > 0) {
      throw new AppError(
        `Cannot delete collection — ${sareeCount} saree${sareeCount === 1 ? "" : "s"} still belong to it. Remove or reassign them first.`,
        409,
      );
    }

    const collection = await Collection.findByIdAndDelete(req.params["id"]);
    if (!collection) throw new AppError("Collection not found.", 404);

    const publicId = extractPublicId(collection.image);
    if (publicId) await deleteFromCloudinary(publicId).catch(() => void 0);

    res.status(200).json({ status: "success", message: "Collection deleted." });
  } catch (err) { next(err); }
}

/* ── helpers ─────────────────────────────────────────────── */
function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]{2,4})?$/i);
  return match?.[1] ?? null;
}
