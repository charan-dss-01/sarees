import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { createEnquiry, getEnquiries } from "../controllers/enquiry.controller.js";

const router = Router();

router.post("/", createEnquiry);
router.get("/",  protect, getEnquiries);

export default router;
