import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      throw new AppError("Email and password are required.", 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid email or password.", 401);
    }

    const token = signToken({ id: user.id as string, email: user.email });

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
    const user = await User.findById(req.admin!.id);
    if (!user) throw new AppError("Admin not found.", 404);
    res.status(200).json({ status: "success", admin: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
}
