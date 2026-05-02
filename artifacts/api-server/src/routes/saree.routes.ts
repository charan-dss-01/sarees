import { Router } from "express";
import {
  getAllSarees,
  getSareeById,
  createSaree,
  updateSaree,
  deleteSaree,
} from "../controllers/saree.controller.js";
import { protect } from "../middlewares/auth.js";
import { uploadMultiple } from "../middlewares/upload.js";

const router = Router();

router.get("/",       getAllSarees);
router.get("/:id",    getSareeById);
router.post("/",      protect, uploadMultiple, createSaree);
router.put("/:id",    protect, uploadMultiple, updateSaree);
router.delete("/:id", protect, deleteSaree);

export default router;
