import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  getAdminMockTests,
  createAdminMockTest,
  updateAdminMockTest,
  deleteAdminMockTest,
  upsertAdminTestResult,
  getAdminTestResults,
  setStudentEnrollments,
  getAdminStudentEnrollments,
} from "../controllers/portalController.js";

const router = Router();

router.get("/tests", protect, getAdminMockTests);
router.post("/tests", protect, createAdminMockTest);
router.put("/tests/:id", protect, updateAdminMockTest);
router.delete("/tests/:id", protect, deleteAdminMockTest);
router.get("/tests/:id/results", protect, getAdminTestResults);
router.post("/tests/:id/results", protect, upsertAdminTestResult);

router.get("/students/:id/enrollments", protect, getAdminStudentEnrollments);
router.put("/students/:id/enrollments", protect, setStudentEnrollments);

export default router;
