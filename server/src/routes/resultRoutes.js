import { Router } from "express";
import {
  getPublicResults,
  getResults,
  createResult,
  updateResult,
  deleteResult,
} from "../controllers/resultController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/public", getPublicResults);
router.get("/", protect, getResults);
router.post("/", protect, upload.single("image"), createResult);
router.put("/:id", protect, upload.single("image"), updateResult);
router.delete("/:id", protect, deleteResult);

export default router;
