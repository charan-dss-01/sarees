import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import helmet from "helmet";
import { sanitizeBody } from "./middlewares/sanitize.js";
import rateLimit from "express-rate-limit";
import router from "./routes/index.js";
import { errorHandler, notFound } from "./middlewares/error.js";
import { logger } from "./lib/logger.js";

const app: Express = express();

/* ── security headers ────────────────────────────────────── */
app.use(helmet());

/* ── request logging ─────────────────────────────────────── */
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

/* ── CORS ────────────────────────────────────────────────── */
app.use(
  cors({
    origin: process.env["CORS_ORIGIN"] ?? "*",
    credentials: true,
  }),
);

/* ── body parsing ────────────────────────────────────────── */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

/* ── NoSQL injection sanitization (body only — Express 5 compatible) ── */
app.use(sanitizeBody);

/* ── rate limiting — auth routes only ───────────────────── */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  /* 15 minutes */
  max: 20,                    /* max 20 login attempts per window */
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", message: "Too many login attempts. Please try again in 15 minutes." },
});
app.use("/api/auth/login", authLimiter);

/* ── routes ──────────────────────────────────────────────── */
app.use("/api", router);

/* ── 404 & error handlers (order matters) ───────────────── */
app.use(notFound);
app.use(errorHandler);

export default app;
