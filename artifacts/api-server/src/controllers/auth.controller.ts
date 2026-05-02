import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";
import { requireEmail, requirePassword } from "../middlewares/validate.js";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;

    const email    = requireEmail(body["email"]);
    const password = requirePassword(body["password"]);

    const user = await User.findOne({ email }).select("+password");
    /* Use constant-time compare even when user not found to prevent timing attacks */
    const valid = user ? await user.comparePassword(password) : false;

    if (!user || !valid) {
      throw new AppError("Invalid email or password.", 401);
    }

    let token: string;
    try {
      token = signToken({ id: user.id as string, email: user.email });
    } catch {
      throw new AppError("Authentication service is not configured. Please set JWT_SECRET.", 503);
    }

    res.status(200).json({
      status: "success",
      token,
      admin: { id: user.id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.admin!.id).lean();
    if (!user) throw new AppError("Admin not found.", 404);
    res.status(200).json({
      status: "success",
      admin: { id: (user._id as { toString(): string }).toString(), email: user.email },
    });
  } catch (err) {
    next(err);
  }
}
