import type { Request, Response, NextFunction } from "express";
import { Saree } from "../models/Saree.js";
import { Collection } from "../models/Collection.js";
import { Enquiry } from "../models/Enquiry.js";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const;

/* ── GET /api/analytics ──────────────────────────────────── */
export async function getAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const now = new Date();
    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

    const [totalSarees, totalCollections, enquiriesCount, recentSarees, monthlyRaw] = await Promise.all([
      Saree.countDocuments(),
      Collection.countDocuments(),
      Enquiry.countDocuments(),

      /* last 5 sarees */
      Saree.find()
        .populate("collection", "name")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      /* monthly uploads — last 12 months */
      Saree.aggregate([
        { $match: { createdAt: { $gte: yearAgo } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    /* build a full 12-month window (oldest → newest) */
    const monthlyMap = new Map<string, number>();
    for (const entry of monthlyRaw as { _id: { year: number; month: number }; count: number }[]) {
      monthlyMap.set(`${entry._id.year}-${entry._id.month}`, entry.count);
    }

    const monthlySareeUploads: { month: string; count: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      monthlySareeUploads.unshift({
        month: MONTHS[d.getMonth()],
        count: monthlyMap.get(key) ?? 0,
      });
    }
    /* unshift built it reversed, fix ordering — push into array forward instead */
    const ordered: { month: string; count: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      ordered.push({ month: MONTHS[d.getMonth()], count: monthlyMap.get(key) ?? 0 });
    }

    res.status(200).json({
      status: "success",
      data: {
        totalSarees,
        totalCollections,
        totalCustomers: enquiriesCount,
        enquiriesCount,
        recentSarees,
        monthlySareeUploads: ordered,
      },
    });
  } catch (err) { next(err); }
}
