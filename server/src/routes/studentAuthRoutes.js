import { Router } from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import { protectStudent } from "../middleware/studentAuth.js";
import { upload } from "../middleware/upload.js";
import {
  registerStudent,
  loginStudent,
  logoutStudent,
  getStudentMe,
  updateStudentProfile,
  changeStudentPassword,
  getStudentMaterials,
  getStudentNotifications,
} from "../controllers/studentController.js";
import {
  forgotStudentPassword,
  resetStudentPassword,
  getStudentDashboard,
  getStudentCourses,
  getStudentTests,
  startStudentTest,
  getStudentResults,
  getStudentNotificationDetail,
} from "../controllers/portalController.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Try again later." },
});

router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters."),
  ],
  registerStudent
);
router.post(
  "/login",
  authLimiter,
  [body("password").notEmpty().withMessage("Password is required.")],
  loginStudent
);
router.post("/logout", logoutStudent);

router.post(
  "/forgot-password",
  authLimiter,
  [body("identifier").notEmpty().withMessage("Email or mobile is required.")],
  forgotStudentPassword
);
router.post(
  "/reset-password",
  authLimiter,
  [
    body("token").notEmpty().withMessage("Reset token is required."),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters."),
  ],
  resetStudentPassword
);

router.get("/me", protectStudent, getStudentMe);
router.get("/profile", protectStudent, getStudentMe);
router.put("/profile", protectStudent, upload.single("photo"), updateStudentProfile);
router.put(
  "/change-password",
  protectStudent,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required."),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters."),
  ],
  changeStudentPassword
);

router.get("/dashboard", protectStudent, getStudentDashboard);
router.get("/courses", protectStudent, getStudentCourses);
router.get("/materials", protectStudent, getStudentMaterials);
router.get("/tests", protectStudent, getStudentTests);
router.post("/tests/:id/start", protectStudent, startStudentTest);
router.get("/results", protectStudent, getStudentResults);
router.get("/notifications", protectStudent, getStudentNotifications);
router.get("/notifications/:id", protectStudent, getStudentNotificationDetail);

export default router;
