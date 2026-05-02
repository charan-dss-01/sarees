import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { broadcastMessage } from "../controllers/broadcast.controller.js";

const router = Router();

router.post("/", protect, broadcastMessage);

export default router;
