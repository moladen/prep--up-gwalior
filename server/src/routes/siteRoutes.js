import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { protectStudent } from "../middleware/studentAuth.js";
import { upload, uploadDocument } from "../middleware/upload.js";
import {
  getPublicSlides,
  getAdminSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  reorderSlides,
  getPublicStats,
  getAdminStats,
  createStat,
  updateStat,
  deleteStat,
  getPublicNotifications,
  getPublicNotification,
  getAdminNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  getAdminMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "../controllers/siteController.js";
import {
  registerStudent,
  loginStudent,
  logoutStudent,
  getStudentMe,
  getStudentMaterials,
  getStudentNotifications,
  getAdminStudents,
  createAdminStudent,
  updateAdminStudent,
  deleteAdminStudent,
  resetAdminStudentPassword,
  updateStudentStatus,
} from "../controllers/studentController.js";

const router = Router();

// Public site content
router.get("/slides/public", getPublicSlides);
router.get("/stats/public", getPublicStats);
router.get("/notifications/public", getPublicNotifications);
router.get("/notifications/public/:id", getPublicNotification);

// Student auth + portal (legacy paths)
router.post("/students/register", registerStudent);
router.post("/students/login", loginStudent);
router.post("/students/logout", logoutStudent);
router.get("/students/me", protectStudent, getStudentMe);
router.get("/students/materials", protectStudent, getStudentMaterials);
router.get("/students/notifications", protectStudent, getStudentNotifications);

// Admin — slides
router.get("/slides", protect, getAdminSlides);
router.post("/slides", protect, upload.single("image"), createSlide);
router.put("/slides/reorder", protect, reorderSlides);
router.put("/slides/:id", protect, upload.single("image"), updateSlide);
router.delete("/slides/:id", protect, deleteSlide);

// Admin — stats
router.get("/stats", protect, getAdminStats);
router.post("/stats", protect, createStat);
router.put("/stats/:id", protect, updateStat);
router.delete("/stats/:id", protect, deleteStat);

// Admin — notifications
router.get("/notifications", protect, getAdminNotifications);
router.post("/notifications", protect, uploadDocument.single("pdf"), createNotification);
router.put("/notifications/:id", protect, uploadDocument.single("pdf"), updateNotification);
router.delete("/notifications/:id", protect, deleteNotification);

// Admin — study materials + students (legacy)
router.get("/materials", protect, getAdminMaterials);
router.post("/materials", protect, uploadDocument.single("file"), createMaterial);
router.put("/materials/:id", protect, uploadDocument.single("file"), updateMaterial);
router.delete("/materials/:id", protect, deleteMaterial);
router.get("/students", protect, getAdminStudents);
router.post("/students", protect, upload.single("photo"), createAdminStudent);
router.put("/students/:id", protect, upload.single("photo"), updateAdminStudent);
router.delete("/students/:id", protect, deleteAdminStudent);
router.post("/students/:id/reset-password", protect, resetAdminStudentPassword);
router.patch("/students/:id/status", protect, updateStudentStatus);

export default router;
