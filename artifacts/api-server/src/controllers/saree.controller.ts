import type { Request, Response, NextFunction } from "express";
import { Saree } from "../models/Saree.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";
import { AppError } from "../utils/AppError.js";

export async function getAllSarees(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { collection, fabric, page = "1", limit = "20" } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};
    if (collection) filter["collection"] = collection;
    if (fabric)     filter["fabric"]     = { $regex: fabric, $options: "i" };

    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const [sarees, total] = await Promise.all([
      Saree.find(filter)
        .populate("collection", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Saree.countDocuments(filter),
    ]);

    res.status(200).json({
      status: "success",
      count: sarees.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: sarees,
    });
  } catch (err) { next(err); }
}

export async function getSareeById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const saree = await Saree.findById(req.params["id"]).populate("collection", "name image");
    if (!saree) throw new AppError("Saree not found.", 404);
    res.status(200).json({ status: "success", data: saree });
  } catch (err) { next(err); }
}

export async function createSaree(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, price, fabric, collection } = req.body as {
      title?: string; price?: string; fabric?: string; collection?: string;
    };

    if (!title || !price || !fabric || !collection) {
      throw new AppError("title, price, fabric, and collection are required.", 400);
    }

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files?.length) throw new AppError("At least one image is required.", 400);

    const uploads = await Promise.all(
      files.map((f) => uploadToCloudinary(f.buffer, "ananya/sarees", { width: 1600 })),
    );

    const saree = await Saree.create({
      title,
      price: parseFloat(price),
      fabric,
      collection,
      images: uploads.map((u) => u.url),
    });

    const populated = await saree.populate("collection", "name");
    res.status(201).json({ status: "success", data: populated });
  } catch (err) { next(err); }
}

export async function updateSaree(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const saree = await Saree.findById(req.params["id"]);
    if (!saree) throw new AppError("Saree not found.", 404);

    const { title, price, fabric, collection } = req.body as {
      title?: string; price?: string; fabric?: string; collection?: string;
    };

    if (title)      saree.title      = title;
    if (price)      saree.price      = parseFloat(price);
    if (fabric)     saree.fabric     = fabric;
    if (collection) saree.collection = collection as unknown as typeof saree.collection;

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

export async function deleteSaree(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const saree = await Saree.findByIdAndDelete(req.params["id"]);
    if (!saree) throw new AppError("Saree not found.", 404);
    res.status(200).json({ status: "success", message: "Saree deleted." });
  } catch (err) { next(err); }
}
