import type { Request, Response, NextFunction } from "express";
import { Collection } from "../models/Collection.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinary.service.js";
import { AppError } from "../utils/AppError.js";

export async function getAllCollections(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", count: collections.length, data: collections });
  } catch (err) { next(err); }
}

export async function createCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name } = req.body as { name?: string };
    if (!name) throw new AppError("Collection name is required.", 400);
    if (!req.file) throw new AppError("Collection image is required.", 400);

    const { url } = await uploadToCloudinary(req.file.buffer, "ananya/collections", { width: 1200 });
    const collection = await Collection.create({ name, image: url });

    res.status(201).json({ status: "success", data: collection });
  } catch (err) { next(err); }
}

export async function updateCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const collection = await Collection.findById(req.params["id"]);
    if (!collection) throw new AppError("Collection not found.", 404);

    const { name } = req.body as { name?: string };
    if (name) collection.name = name;

    if (req.file) {
      const { url } = await uploadToCloudinary(req.file.buffer, "ananya/collections", { width: 1200 });
      collection.image = url;
    }

    await collection.save();
    res.status(200).json({ status: "success", data: collection });
  } catch (err) { next(err); }
}

export async function deleteCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const collection = await Collection.findByIdAndDelete(req.params["id"]);
    if (!collection) throw new AppError("Collection not found.", 404);

    const publicId = extractPublicId(collection.image);
    if (publicId) await deleteFromCloudinary(publicId).catch(() => void 0);

    res.status(200).json({ status: "success", message: "Collection deleted." });
  } catch (err) { next(err); }
}

function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]{2,4})?$/i);
  return match?.[1] ?? null;
}
