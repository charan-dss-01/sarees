import { Router } from "express";
import {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collection.controller.js";
import { protect } from "../middlewares/auth.js";
import { uploadSingle } from "../middlewares/upload.js";

const router = Router();

router.get("/",        getAllCollections);
router.get("/:id",     getCollectionById);
router.post("/",       protect, uploadSingle, createCollection);
router.put("/:id",     protect, uploadSingle, updateCollection);
router.delete("/:id",  protect, deleteCollection);

export default router;
