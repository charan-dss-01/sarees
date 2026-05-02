import type { Request, Response, NextFunction } from "express";
import { HomepageContent } from "../models/HomepageContent.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

export async function getHomepageContent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let content = await HomepageContent.findOne().sort({ updatedAt: -1 });
    if (!content) {
      content = await HomepageContent.create({ heroImages: [], featuredCollections: [], banners: [] });
    }
    res.status(200).json({ status: "success", data: content });
  } catch (err) { next(err); }
}

export async function updateHomepageContent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as {
      heroImages?: string[];
      featuredCollections?: Array<{ collectionId: string; label: string; image: string }>;
      banners?: Array<{ title: string; subtitle?: string; image: string; ctaText?: string; ctaLink?: string }>;
    };

    const files = req.files as Express.Multer.File[] | undefined;
    let uploadedUrls: string[] = [];
    if (files?.length) {
      const results = await Promise.all(
        files.map((f) => uploadToCloudinary(f.buffer, "ananya/homepage", { width: 1920, quality: "auto:best" })),
      );
      uploadedUrls = results.map((r) => r.url);
    }

    const update: Record<string, unknown> = {};
    if (body.heroImages)           update["heroImages"]           = body.heroImages;
    if (body.featuredCollections)  update["featuredCollections"]  = body.featuredCollections;
    if (body.banners)              update["banners"]              = body.banners;
    if (uploadedUrls.length)       update["heroImages"]           = uploadedUrls;

    const content = await HomepageContent.findOneAndUpdate(
      {},
      { $set: update },
      { new: true, upsert: true },
    );

    res.status(200).json({ status: "success", data: content });
  } catch (err) { next(err); }
}
