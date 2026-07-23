import { Router } from "express";
import {
  getPublicContent,
  updateContent,
} from "../controllers/contentController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/public", getPublicContent);
router.put("/", protect, updateContent);

export default router;
