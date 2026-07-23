import { Router } from "express";
import {
  getPublicCourses,
  getPublicCourseBySlug,
  getAdminCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/public", getPublicCourses);
router.get("/public/by-slug/:slug", getPublicCourseBySlug);
router.get("/public/:id", getCourse);

router.get("/", protect, getAdminCourses);
router.get("/:id", protect, getCourse);
router.post("/", protect, upload.single("featuredImage"), createCourse);
router.put("/:id", protect, upload.single("featuredImage"), updateCourse);
router.delete("/:id", protect, deleteCourse);

export default router;
