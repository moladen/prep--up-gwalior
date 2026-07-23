import { Router } from "express";
import {
  getMedia,
  uploadMedia,
  deleteMedia,
  getSettings,
  getPublicSettings,
  updateSettings,
} from "../controllers/mediaController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/public", getPublicSettings);
router.get("/settings", protect, getSettings);
router.put("/settings", protect, upload.single("file"), updateSettings);

router.get("/", protect, getMedia);
router.post("/upload", protect, upload.single("file"), uploadMedia);
router.delete("/:id", protect, deleteMedia);

export default router;
