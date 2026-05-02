import { Router } from "express";
import { getHomepageContent, updateHomepageContent } from "../controllers/homepage.controller.js";
import { protect } from "../middlewares/auth.js";
import { uploadMultiple } from "../middlewares/upload.js";

const router = Router();

router.get("/",  getHomepageContent);
router.put("/",  protect, uploadMultiple, updateHomepageContent);

export default router;
