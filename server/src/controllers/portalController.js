import crypto from "crypto";
import { validationResult } from "express-validator";
import prisma from "../config/prisma.js";
import { asyncHandler, AppError } from "../utils/asyncHandler.js";
import { hashPassword } from "../utils/password.js";
import { withId } from "../utils/serialize.js";

function assertValid(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg || "Validation failed.", 400);
  }
}

function serializeEnrollment(e) {
  return withId(e);
}

function serializeTest(t) {
  return withId(t);
}

function serializeResult(r) {
  return {
    ...withId(r),
    test: r.test ? withId(r.test) : undefined,
  };
}

async function getStudentCourseIds(studentId) {
  const enrollments = await prisma.studentEnrollment.findMany({
    where: { studentId, status: "Active" },
    select: { courseId: true },
  });
  return enrollments.map((e) => e.courseId).filter(Boolean);
}

async function syncStudentCourseLabel(studentId) {
  const enrollments = await prisma.studentEnrollment.findMany({
    where: { studentId, status: "Active" },
    orderBy: { enrolledAt: "desc" },
  });
  const label = enrollments.map((e) => e.courseName || e.courseId).filter(Boolean).join(", ");
  await prisma.student.update({
    where: { id: studentId },
    data: { course: label },
  });
  return enrollments;
}

/* ─── Password reset ─── */

export const forgotStudentPassword = asyncHandler(async (req, res) => {
  assertValid(req);
  const identifier = (req.body.identifier || req.body.email || "").trim().toLowerCase();
  if (!identifier) throw new AppError("Email or mobile is required.", 400);

  const phoneDigits = identifier.replace(/\D/g, "");
  const student = await prisma.student.findFirst({
    where: {
      OR: [
        { email: identifier },
        ...(phoneDigits.length >= 8
          ? [{ phone: phoneDigits }, { phone: identifier }]
          : []),
      ],
    },
  });

  // Always return success to avoid account enumeration
  if (!student || student.status !== "Active") {
    res.json({
      success: true,
      message:
        "If an account exists, a password reset link has been prepared. Contact the institute if you do not receive it.",
    });
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.student.update({
    where: { id: student.id },
    data: { resetToken: token, resetTokenExpiry: expiry },
  });

  const frontend = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetUrl = `${frontend}/student/reset-password?token=${token}`;

  res.json({
    success: true,
    message:
      "Password reset link generated. Use the link below (valid 1 hour), or contact the institute.",
    resetUrl,
  });
});

export const resetStudentPassword = asyncHandler(async (req, res) => {
  assertValid(req);
  const token = req.body.token?.trim();
  const newPassword = req.body.newPassword || req.body.password;
  if (!token || !newPassword) {
    throw new AppError("Token and new password are required.", 400);
  }
  if (newPassword.length < 6) {
    throw new AppError("Password must be at least 6 characters.", 400);
  }

  const student = await prisma.student.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });
  if (!student) throw new AppError("Invalid or expired reset link.", 400);

  await prisma.student.update({
    where: { id: student.id },
    data: {
      password: await hashPassword(newPassword),
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  res.json({ success: true, message: "Password reset successfully. You can log in now." });
});

/* ─── Student portal data ─── */

export const getStudentDashboard = asyncHandler(async (req, res) => {
  const studentId = req.student.id;
  const courseIds = await getStudentCourseIds(studentId);

  const [enrollments, upcomingTests, recentResults, notifications, materialsCount] =
    await Promise.all([
      prisma.studentEnrollment.findMany({
        where: { studentId, status: "Active" },
        orderBy: { enrolledAt: "desc" },
      }),
      prisma.mockTest.findMany({
        where: {
          status: { in: ["Upcoming", "Available"] },
          OR: [
            { courseId: "" },
            ...(courseIds.length ? [{ courseId: { in: courseIds } }] : []),
          ],
        },
        orderBy: [{ testDate: "asc" }, { sortOrder: "asc" }],
        take: 5,
      }),
      prisma.studentTestResult.findMany({
        where: { studentId, status: "Completed" },
        include: { test: true },
        orderBy: { completedAt: "desc" },
        take: 5,
      }),
      prisma.notification.findMany({
        where: { status: "Published" },
        orderBy: [{ isImportant: "desc" }, { publishedAt: "desc" }],
        take: 5,
      }),
      prisma.studyMaterial.count({
        where: {
          status: "Published",
          OR: [
            { courseId: "" },
            ...(courseIds.length ? [{ courseId: { in: courseIds } }] : []),
          ],
        },
      }),
    ]);

  res.json({
    success: true,
    dashboard: {
      student: req.student,
      enrollments: enrollments.map(serializeEnrollment),
      upcomingTests: upcomingTests.map(serializeTest),
      recentResults: recentResults.map(serializeResult),
      notifications: notifications.map((n) => withId(n)),
      stats: {
        courses: enrollments.length,
        materials: materialsCount,
        upcomingTests: upcomingTests.length,
        results: recentResults.length,
      },
    },
  });
});

export const getStudentCourses = asyncHandler(async (req, res) => {
  const enrollments = await prisma.studentEnrollment.findMany({
    where: { studentId: req.student.id, status: "Active" },
    orderBy: { enrolledAt: "desc" },
  });

  const courseIds = enrollments.map((e) => e.courseId).filter(Boolean);
  const courses = courseIds.length
    ? await prisma.course.findMany({
        where: { id: { in: courseIds } },
      })
    : [];
  const byId = Object.fromEntries(courses.map((c) => [c.id, c]));

  res.json({
    success: true,
    enrollments: enrollments.map((e) => ({
      ...serializeEnrollment(e),
      course: byId[e.courseId] ? withId(byId[e.courseId]) : null,
    })),
  });
});

export const getStudentTests = asyncHandler(async (req, res) => {
  const studentId = req.student.id;
  const courseIds = await getStudentCourseIds(studentId);

  const tests = await prisma.mockTest.findMany({
    where: {
      status: { not: "Draft" },
      OR: [
        { courseId: "" },
        ...(courseIds.length ? [{ courseId: { in: courseIds } }] : []),
      ],
    },
    orderBy: [{ testDate: "desc" }, { sortOrder: "asc" }],
  });

  const results = await prisma.studentTestResult.findMany({
    where: { studentId, testId: { in: tests.map((t) => t.id) } },
  });
  const resultByTest = Object.fromEntries(results.map((r) => [r.testId, r]));

  res.json({
    success: true,
    tests: tests.map((t) => ({
      ...serializeTest(t),
      myResult: resultByTest[t.id] ? serializeResult(resultByTest[t.id]) : null,
    })),
  });
});

export const startStudentTest = asyncHandler(async (req, res) => {
  const test = await prisma.mockTest.findUnique({ where: { id: req.params.id } });
  if (!test || test.status === "Draft") throw new AppError("Test not found.", 404);
  if (test.status === "Upcoming") {
    throw new AppError("This test is not available yet.", 403);
  }
  if (test.status === "Closed") {
    throw new AppError("This test is closed.", 403);
  }

  if (test.courseId) {
    const enrolled = await prisma.studentEnrollment.findFirst({
      where: {
        studentId: req.student.id,
        courseId: test.courseId,
        status: "Active",
      },
    });
    if (!enrolled) {
      throw new AppError("You are not enrolled in the course for this test.", 403);
    }
  }

  let result = await prisma.studentTestResult.findUnique({
    where: {
      studentId_testId: { studentId: req.student.id, testId: test.id },
    },
    include: { test: true },
  });

  if (!result) {
    result = await prisma.studentTestResult.create({
      data: {
        studentId: req.student.id,
        testId: test.id,
        status: "InProgress",
        startedAt: new Date(),
        maxScore: test.totalMarks,
      },
      include: { test: true },
    });
  } else if (result.status === "Scheduled") {
    result = await prisma.studentTestResult.update({
      where: { id: result.id },
      data: { status: "InProgress", startedAt: new Date() },
      include: { test: true },
    });
  }

  res.json({
    success: true,
    result: serializeResult(result),
    externalUrl: test.externalUrl || "",
  });
});

export const getStudentResults = asyncHandler(async (req, res) => {
  const results = await prisma.studentTestResult.findMany({
    where: { studentId: req.student.id },
    include: { test: true },
    orderBy: [{ completedAt: "desc" }, { createdAt: "desc" }],
  });

  const completed = results.filter((r) => r.status === "Completed" && r.score != null);
  const avgScore =
    completed.length > 0
      ? completed.reduce((s, r) => s + Number(r.score || 0), 0) / completed.length
      : null;

  res.json({
    success: true,
    results: results.map(serializeResult),
    overview: {
      total: results.length,
      completed: completed.length,
      averageScore: avgScore != null ? Math.round(avgScore * 10) / 10 : null,
      bestPercentile:
        completed.length > 0
          ? Math.max(...completed.map((r) => Number(r.percentile || 0)))
          : null,
    },
  });
});

export const getStudentNotificationDetail = asyncHandler(async (req, res) => {
  const item = await prisma.notification.findFirst({
    where: { id: req.params.id, status: "Published" },
  });
  if (!item) throw new AppError("Notification not found.", 404);
  res.json({
    success: true,
    notification: {
      ...withId(item),
      pdf: { url: item.pdfUrl || "", publicId: item.pdfPublicId || "" },
    },
  });
});

/* ─── Admin enrollments ─── */

export const setStudentEnrollments = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({ where: { id: req.params.id } });
  if (!student) throw new AppError("Student not found.", 404);

  const courseIds = Array.isArray(req.body.courseIds)
    ? req.body.courseIds.filter(Boolean)
    : typeof req.body.courseIds === "string"
      ? req.body.courseIds.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  const courses = courseIds.length
    ? await prisma.course.findMany({ where: { id: { in: courseIds } } })
    : [];
  const byId = Object.fromEntries(courses.map((c) => [c.id, c]));

  await prisma.$transaction(async (tx) => {
    await tx.studentEnrollment.deleteMany({ where: { studentId: student.id } });
    if (courses.length) {
      await tx.studentEnrollment.createMany({
        data: courses.map((c) => ({
          studentId: student.id,
          courseId: c.id,
          courseName: c.name,
          status: "Active",
        })),
      });
    }
  });

  const enrollments = await syncStudentCourseLabel(student.id);
  // also allow free-text course override
  if (req.body.course !== undefined || req.body.batch !== undefined) {
    await prisma.student.update({
      where: { id: student.id },
      data: {
        ...(req.body.course !== undefined
          ? { course: String(req.body.course).trim() || enrollments.map((e) => e.courseName).join(", ") }
          : {}),
        ...(req.body.batch !== undefined ? { batch: String(req.body.batch).trim() } : {}),
      },
    });
  }

  res.json({
    success: true,
    enrollments: enrollments.map(serializeEnrollment),
  });
});

export const getAdminStudentEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await prisma.studentEnrollment.findMany({
    where: { studentId: req.params.id },
    orderBy: { enrolledAt: "desc" },
  });
  res.json({ success: true, enrollments: enrollments.map(serializeEnrollment) });
});

/* ─── Admin mock tests ─── */

export const getAdminMockTests = asyncHandler(async (_req, res) => {
  const tests = await prisma.mockTest.findMany({
    orderBy: [{ testDate: "desc" }, { createdAt: "desc" }],
    include: { _count: { select: { results: true } } },
  });
  res.json({
    success: true,
    tests: tests.map((t) => ({
      ...serializeTest(t),
      resultsCount: t._count?.results || 0,
    })),
  });
});

export const createAdminMockTest = asyncHandler(async (req, res) => {
  const title = req.body.title?.trim();
  if (!title) throw new AppError("Title is required.", 400);

  let courseName = req.body.courseName?.trim() || "";
  const courseId = req.body.courseId?.trim() || "";
  if (courseId && !courseName) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    courseName = course?.name || "";
  }

  const test = await prisma.mockTest.create({
    data: {
      title,
      description: req.body.description?.trim() || "",
      courseId,
      courseName,
      testDate: req.body.testDate ? new Date(req.body.testDate) : null,
      durationMin: Number(req.body.durationMin) || 60,
      totalMarks: Number(req.body.totalMarks) || 100,
      status: req.body.status || "Upcoming",
      externalUrl: req.body.externalUrl?.trim() || "",
      sortOrder: Number(req.body.sortOrder) || 0,
    },
  });
  res.status(201).json({ success: true, test: serializeTest(test) });
});

export const updateAdminMockTest = asyncHandler(async (req, res) => {
  const existing = await prisma.mockTest.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Test not found.", 404);

  const data = {};
  if (req.body.title?.trim()) data.title = req.body.title.trim();
  if (req.body.description !== undefined) data.description = String(req.body.description).trim();
  if (req.body.courseId !== undefined) data.courseId = String(req.body.courseId).trim();
  if (req.body.courseName !== undefined) data.courseName = String(req.body.courseName).trim();
  if (req.body.testDate !== undefined) {
    data.testDate = req.body.testDate ? new Date(req.body.testDate) : null;
  }
  if (req.body.durationMin !== undefined) data.durationMin = Number(req.body.durationMin) || 60;
  if (req.body.totalMarks !== undefined) data.totalMarks = Number(req.body.totalMarks) || 100;
  if (req.body.status) data.status = req.body.status;
  if (req.body.externalUrl !== undefined) data.externalUrl = String(req.body.externalUrl).trim();
  if (req.body.sortOrder !== undefined) data.sortOrder = Number(req.body.sortOrder) || 0;

  if (data.courseId && !data.courseName) {
    const course = await prisma.course.findUnique({ where: { id: data.courseId } });
    if (course) data.courseName = course.name;
  }

  const test = await prisma.mockTest.update({ where: { id: existing.id }, data });
  res.json({ success: true, test: serializeTest(test) });
});

export const deleteAdminMockTest = asyncHandler(async (req, res) => {
  const existing = await prisma.mockTest.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Test not found.", 404);
  await prisma.mockTest.delete({ where: { id: existing.id } });
  res.json({ success: true, message: "Test deleted." });
});

export const upsertAdminTestResult = asyncHandler(async (req, res) => {
  const testId = req.params.id;
  const test = await prisma.mockTest.findUnique({ where: { id: testId } });
  if (!test) throw new AppError("Test not found.", 404);

  const studentId = req.body.studentId;
  if (!studentId) throw new AppError("studentId is required.", 400);

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) throw new AppError("Student not found.", 404);

  const data = {
    score: req.body.score != null ? Number(req.body.score) : null,
    maxScore: req.body.maxScore != null ? Number(req.body.maxScore) : test.totalMarks,
    rank: req.body.rank != null ? Number(req.body.rank) : null,
    percentile: req.body.percentile != null ? Number(req.body.percentile) : null,
    status: req.body.status || "Completed",
    remarks: req.body.remarks?.trim() || "",
    completedAt: req.body.status === "Scheduled" ? null : new Date(),
  };

  const result = await prisma.studentTestResult.upsert({
    where: { studentId_testId: { studentId, testId } },
    create: {
      studentId,
      testId,
      ...data,
      startedAt: new Date(),
    },
    update: data,
    include: { test: true, student: true },
  });

  res.json({
    success: true,
    result: {
      ...serializeResult(result),
      student: result.student
        ? {
            id: result.student.id,
            name: result.student.name,
            email: result.student.email,
            studentId: result.student.studentId,
          }
        : null,
    },
  });
});

export const getAdminTestResults = asyncHandler(async (req, res) => {
  const results = await prisma.studentTestResult.findMany({
    where: { testId: req.params.id },
    include: { student: true },
    orderBy: [{ rank: "asc" }, { score: "desc" }],
  });
  res.json({
    success: true,
    results: results.map((r) => ({
      ...serializeResult(r),
      student: r.student
        ? {
            id: r.student.id,
            name: r.student.name,
            email: r.student.email,
            studentId: r.student.studentId,
          }
        : null,
    })),
  });
});
