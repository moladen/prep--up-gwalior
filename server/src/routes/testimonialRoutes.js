import { Router } from "express";
import {
  getPublicTestimonials,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/public", getPublicTestimonials);
router.get("/", protect, getTestimonials);
router.post("/", protect, upload.single("image"), createTestimonial);
router.put("/:id", protect, upload.single("image"), updateTestimonial);
router.delete("/:id", protect, deleteTestimonial);

export default router;
