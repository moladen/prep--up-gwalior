import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  getAdminStudents,
  createAdminStudent,
  updateAdminStudent,
  deleteAdminStudent,
  resetAdminStudentPassword,
  updateStudentStatus,
} from "../controllers/studentController.js";

const router = Router();

router.get("/", protect, getAdminStudents);
router.post("/", protect, upload.single("photo"), createAdminStudent);
router.put("/:id", protect, upload.single("photo"), updateAdminStudent);
router.delete("/:id", protect, deleteAdminStudent);
router.post("/:id/reset-password", protect, resetAdminStudentPassword);
router.patch("/:id/status", protect, updateStudentStatus);

export default router;
