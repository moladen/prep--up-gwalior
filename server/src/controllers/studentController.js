import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import prisma from "../config/prisma.js";
import { asyncHandler, AppError } from "../utils/asyncHandler.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { withId } from "../utils/serialize.js";
import { uploadFile, deleteUploadedFile } from "../utils/uploadHelper.js";
import { STUDENT_COOKIE } from "../constants/auth.js";

const COOKIE_NAME = STUDENT_COOKIE;
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function signStudentToken(id) {
  return jwt.sign({ id, role: "student" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  };
}

function serializeStudent(student) {
  if (!student) return student;
  const { password, ...safe } = student;
  return withId(safe);
}

function assertValid(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg || "Validation failed.", 400);
  }
}

async function findStudentByIdentifier(identifier) {
  const value = identifier?.trim()?.toLowerCase();
  if (!value) return null;
  const phoneDigits = value.replace(/\D/g, "");
  return prisma.student.findFirst({
    where: {
      OR: [
        { email: value },
        ...(phoneDigits.length >= 8 ? [{ phone: phoneDigits }, { phone: value }] : []),
      ],
    },
  });
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, cookieOptions());
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: 0 });
}

export const registerStudent = asyncHandler(async (req, res) => {
  assertValid(req);
  const name = req.body.name?.trim();
  const email = req.body.email?.trim()?.toLowerCase();
  const phone = (req.body.phone || req.body.mobile || "").trim().replace(/\D/g, "");
  const password = req.body.password;
  const course = req.body.course?.trim() || "";
  const batch = req.body.batch?.trim() || "";

  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required.", 400);
  }
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters.", 400);
  }

  const existing = await prisma.student.findUnique({ where: { email } });
  if (existing) throw new AppError("An account with this email already exists.", 409);

  const student = await prisma.student.create({
    data: {
      name,
      email,
      phone,
      password: await hashPassword(password),
      course,
      batch,
      status: "Active",
    },
  });

  const token = signStudentToken(student.id);
  setAuthCookie(res, token);
  res.status(201).json({
    success: true,
    token,
    student: serializeStudent(student),
  });
});

export const loginStudent = asyncHandler(async (req, res) => {
  assertValid(req);
  const identifier =
    req.body.identifier || req.body.email || req.body.mobile || req.body.phone;
  const password = req.body.password;
  if (!identifier || !password) {
    throw new AppError("Email/mobile and password are required.", 400);
  }

  const student = await findStudentByIdentifier(identifier);
  if (!student || !(await comparePassword(password, student.password))) {
    throw new AppError("Invalid email/mobile or password.", 401);
  }
  if (student.status !== "Active") {
    throw new AppError("Your account is not active. Contact the institute.", 403);
  }

  const token = signStudentToken(student.id);
  setAuthCookie(res, token);
  res.json({
    success: true,
    token,
    student: serializeStudent(student),
  });
});

export const logoutStudent = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: "Logged out successfully." });
});

export const getStudentMe = asyncHandler(async (req, res) => {
  res.json({ success: true, student: req.student });
});

export const updateStudentProfile = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({ where: { id: req.student.id } });
  if (!student) throw new AppError("Student not found.", 404);

  const data = {};
  if (req.body.name?.trim()) data.name = req.body.name.trim();
  if (req.body.phone !== undefined) {
    data.phone = String(req.body.phone).trim().replace(/\D/g, "");
  }

  if (req.file?.buffer) {
    if (student.profilePhotoPublicId) {
      await deleteUploadedFile(student.profilePhotoPublicId).catch(() => {});
    }
    const uploaded = await uploadFile(req.file, "prep-up/students");
    data.profilePhotoUrl = uploaded.secure_url;
    data.profilePhotoPublicId = uploaded.public_id;
  }

  const updated = await prisma.student.update({
    where: { id: student.id },
    data,
  });

  res.json({ success: true, student: serializeStudent(updated) });
});

export const changeStudentPassword = asyncHandler(async (req, res) => {
  assertValid(req);
  const { currentPassword, newPassword } = req.body;
  const student = await prisma.student.findUnique({ where: { id: req.student.id } });
  if (!student) throw new AppError("Student not found.", 404);

  if (!(await comparePassword(currentPassword, student.password))) {
    throw new AppError("Current password is incorrect.", 400);
  }
  if (!newPassword || newPassword.length < 6) {
    throw new AppError("New password must be at least 6 characters.", 400);
  }

  await prisma.student.update({
    where: { id: student.id },
    data: { password: await hashPassword(newPassword) },
  });

  res.json({ success: true, message: "Password updated successfully." });
});

export const getStudentMaterials = asyncHandler(async (req, res) => {
  const enrollments = await prisma.studentEnrollment.findMany({
    where: { studentId: req.student.id, status: "Active" },
    select: { courseId: true },
  });
  const courseIds = enrollments.map((e) => e.courseId).filter(Boolean);

  const materials = await prisma.studyMaterial.findMany({
    where: {
      status: "Published",
      OR: [
        { courseId: "" },
        ...(courseIds.length ? [{ courseId: { in: courseIds } }] : []),
      ],
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json({
    success: true,
    materials: materials.map((m) => ({
      ...withId(m),
      file: { url: m.fileUrl || "", publicId: m.filePublicId || "" },
    })),
  });
});

export const getStudentNotifications = asyncHandler(async (_req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { status: "Published" },
    orderBy: [{ isImportant: "desc" }, { publishedAt: "desc" }],
    take: 30,
  });
  res.json({
    success: true,
    notifications: notifications.map((n) => ({
      ...withId(n),
      pdf: { url: n.pdfUrl || "", publicId: n.pdfPublicId || "" },
    })),
  });
});

/* ─── Admin CRUD ─── */

export const getAdminStudents = asyncHandler(async (req, res) => {
  const q = req.query.q?.trim();
  const status = req.query.status?.trim();
  const students = await prisma.student.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q } },
              { studentId: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      enrollments: {
        where: { status: "Active" },
        orderBy: { enrolledAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 300,
  });
  res.json({
    success: true,
    students: students.map((s) => ({
      ...serializeStudent(s),
      enrollments: (s.enrollments || []).map((e) => withId(e)),
      courseIds: (s.enrollments || []).map((e) => e.courseId),
    })),
  });
});

function parseCourseIds(body) {
  if (Array.isArray(body.courseIds)) return body.courseIds.filter(Boolean);
  if (typeof body.courseIds === "string" && body.courseIds.trim()) {
    try {
      const parsed = JSON.parse(body.courseIds);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      return body.courseIds.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  if (body.courseId) return [String(body.courseId).trim()].filter(Boolean);
  return [];
}

async function assignEnrollments(studentId, courseIds) {
  const unique = [...new Set(courseIds.filter(Boolean))];
  const courses = unique.length
    ? await prisma.course.findMany({ where: { id: { in: unique } } })
    : [];
  await prisma.studentEnrollment.deleteMany({ where: { studentId } });
  if (!courses.length) return [];
  await prisma.studentEnrollment.createMany({
    data: courses.map((c) => ({
      studentId,
      courseId: c.id,
      courseName: c.name,
      status: "Active",
    })),
  });
  return courses;
}

export const createAdminStudent = asyncHandler(async (req, res) => {
  assertValid(req);
  const name = req.body.name?.trim();
  const email = req.body.email?.trim()?.toLowerCase();
  const phone = (req.body.phone || "").trim().replace(/\D/g, "");
  const password = req.body.password || "PrepUp@123";
  const course = req.body.course?.trim() || "";
  const batch = req.body.batch?.trim() || "";
  const status = req.body.status === "Inactive" ? "Inactive" : "Active";

  if (!name || !email) throw new AppError("Name and email are required.", 400);

  const existing = await prisma.student.findUnique({ where: { email } });
  if (existing) throw new AppError("Email already registered.", 409);

  const data = {
    name,
    email,
    phone,
    password: await hashPassword(password),
    course,
    batch,
    status,
  };

  if (req.file?.buffer) {
    const uploaded = await uploadFile(req.file, "prep-up/students");
    data.profilePhotoUrl = uploaded.secure_url;
    data.profilePhotoPublicId = uploaded.public_id;
  }

  const student = await prisma.student.create({ data });

  // Optional course enrollments
  const courseIds = parseCourseIds(req.body);
  if (courseIds.length) {
    await assignEnrollments(student.id, courseIds);
    await prisma.student.update({
      where: { id: student.id },
      data: {
        course:
          (await prisma.studentEnrollment.findMany({ where: { studentId: student.id } }))
            .map((e) => e.courseName)
            .join(", ") || course,
      },
    });
  }

  const fresh = await prisma.student.findUnique({
    where: { id: student.id },
    include: { enrollments: true },
  });

  res.status(201).json({
    success: true,
    student: {
      ...serializeStudent(fresh),
      enrollments: (fresh.enrollments || []).map((e) => withId(e)),
      courseIds: (fresh.enrollments || []).map((e) => e.courseId),
    },
    tempPassword: req.body.password ? undefined : password,
  });
});

export const updateAdminStudent = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({ where: { id: req.params.id } });
  if (!student) throw new AppError("Student not found.", 404);

  const data = {};
  if (req.body.name?.trim()) data.name = req.body.name.trim();
  if (req.body.email?.trim()) data.email = req.body.email.trim().toLowerCase();
  if (req.body.phone !== undefined) {
    data.phone = String(req.body.phone).trim().replace(/\D/g, "");
  }
  if (req.body.course !== undefined) data.course = String(req.body.course).trim();
  if (req.body.batch !== undefined) data.batch = String(req.body.batch).trim();
  if (req.body.status === "Active" || req.body.status === "Inactive") {
    data.status = req.body.status;
  }

  if (req.file?.buffer) {
    if (student.profilePhotoPublicId) {
      await deleteUploadedFile(student.profilePhotoPublicId).catch(() => {});
    }
    const uploaded = await uploadFile(req.file, "prep-up/students");
    data.profilePhotoUrl = uploaded.secure_url;
    data.profilePhotoPublicId = uploaded.public_id;
  }

  try {
    const updated = await prisma.student.update({
      where: { id: student.id },
      data,
    });

    if (req.body.courseIds !== undefined) {
      const courseIds = parseCourseIds(req.body);
      const courses = await assignEnrollments(student.id, courseIds);
      if (!req.body.course) {
        await prisma.student.update({
          where: { id: student.id },
          data: { course: courses.map((c) => c.name).join(", ") },
        });
      }
    }

    const fresh = await prisma.student.findUnique({
      where: { id: student.id },
      include: { enrollments: { where: { status: "Active" } } },
    });

    res.json({
      success: true,
      student: {
        ...serializeStudent(fresh),
        enrollments: (fresh.enrollments || []).map((e) => withId(e)),
        courseIds: (fresh.enrollments || []).map((e) => e.courseId),
      },
    });
  } catch (err) {
    if (err.code === "P2002") throw new AppError("Email already in use.", 409);
    throw err;
  }
});

export const deleteAdminStudent = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({ where: { id: req.params.id } });
  if (!student) throw new AppError("Student not found.", 404);
  if (student.profilePhotoPublicId) {
    await deleteUploadedFile(student.profilePhotoPublicId).catch(() => {});
  }
  await prisma.student.delete({ where: { id: student.id } });
  res.json({ success: true, message: "Student deleted." });
});

export const resetAdminStudentPassword = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({ where: { id: req.params.id } });
  if (!student) throw new AppError("Student not found.", 404);

  const newPassword = req.body.password?.trim() || "PrepUp@123";
  if (newPassword.length < 6) {
    throw new AppError("Password must be at least 6 characters.", 400);
  }

  await prisma.student.update({
    where: { id: student.id },
    data: { password: await hashPassword(newPassword) },
  });

  res.json({
    success: true,
    message: "Password reset successfully.",
    tempPassword: req.body.password ? undefined : newPassword,
  });
});

export const updateStudentStatus = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({ where: { id: req.params.id } });
  if (!student) throw new AppError("Student not found.", 404);
  const status = req.body.status === "Inactive" ? "Inactive" : "Active";
  const updated = await prisma.student.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json({ success: true, student: serializeStudent(updated) });
});

export { serializeStudent };
