import prisma from "../config/prisma.js";
import { asyncHandler, AppError } from "../utils/asyncHandler.js";
import { logActivity } from "../utils/activity.js";
import {
  deleteUploadedFile,
  uploadFile,
} from "../utils/uploadHelper.js";
import { toCourseSlug } from "../utils/courseSlug.js";
import {
  buildSearchFilter,
  courseDataFromBody,
  serializeCourse,
  serializeCourses,
} from "../utils/serialize.js";

export const getPublicCourseBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const published = await prisma.course.findMany({
    where: { status: "Published" },
  });

  const course =
    published.find((item) => item.slug === slug) ||
    published.find((item) => toCourseSlug(item.name) === slug);

  if (!course) throw new AppError("Course not found.", 404);
  res.json({ success: true, course: serializeCourse(course) });
});

export const getPublicCourses = asyncHandler(async (req, res) => {
  const where = { status: "Published" };
  if (req.query.category) where.category = req.query.category;
  if (req.query.exam) where.exam = { contains: req.query.exam, mode: "insensitive" };
  if (req.query.featured === "true") where.isFeatured = true;
  if (req.query.popular === "true") where.isPopular = true;
  if (req.query.search) {
    Object.assign(
      where,
      buildSearchFilter(req.query.search, ["name", "category", "exam", "subCategory"])
    );
  }

  const courses = await prisma.course.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  res.json({ success: true, courses: serializeCourses(courses) });
});

export const getAdminCourses = asyncHandler(async (req, res) => {
  const { search = "", category = "", status = "", page = 1, limit = 10 } =
    req.query;

  const where = {
    ...buildSearchFilter(search, ["name"]),
    ...(category ? { category } : {}),
    ...(status ? { status } : {}),
  };

  const skip = (Number(page) - 1) * Number(limit);
  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.course.count({ where }),
  ]);

  res.json({
    success: true,
    courses: serializeCourses(courses),
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  });
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
  });
  if (!course) throw new AppError("Course not found.", 404);
  res.json({ success: true, course: serializeCourse(course) });
});

export const createCourse = asyncHandler(async (req, res) => {
  let image;
  if (req.file) {
    const result = await uploadFile(req.file, "prep-up-gwalior/courses");
    image = { url: result.secure_url, publicId: result.public_id };
  }

  const course = await prisma.course.create({
    data: courseDataFromBody(req.body, image),
  });

  await logActivity("create", "course", course.id, course.name);
  res.status(201).json({ success: true, course: serializeCourse(course) });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const existing = await prisma.course.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) throw new AppError("Course not found.", 404);

  let image;
  if (req.file) {
    await deleteUploadedFile(existing.featuredImagePublicId);
    const result = await uploadFile(req.file, "prep-up-gwalior/courses");
    image = { url: result.secure_url, publicId: result.public_id };
  }

  const course = await prisma.course.update({
    where: { id: req.params.id },
    data: courseDataFromBody(req.body, image),
  });

  await logActivity("update", "course", course.id, course.name);
  res.json({ success: true, course: serializeCourse(course) });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
  });
  if (!course) throw new AppError("Course not found.", 404);

  await deleteUploadedFile(course.featuredImagePublicId);
  await prisma.course.delete({ where: { id: req.params.id } });
  await logActivity("delete", "course", req.params.id, course.name);
  res.json({ success: true, message: "Course deleted." });
});
