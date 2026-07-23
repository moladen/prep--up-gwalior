import prisma from "../config/prisma.js";
import { asyncHandler, AppError } from "../utils/asyncHandler.js";
import { logActivity } from "../utils/activity.js";
import {
  deleteUploadedFile,
  uploadFile,
} from "../utils/uploadHelper.js";
import {
  buildSearchFilter,
  serializeTestimonial,
  serializeTestimonials,
} from "../utils/serialize.js";

export const getPublicTestimonials = asyncHandler(async (req, res) => {
  const where = { status: "Published" };
  if (req.query.course) {
    where.course = { contains: req.query.course, mode: "insensitive" };
  }
  if (req.query.featured === "true") where.isFeatured = true;
  if (req.query.type) where.type = req.query.type;

  const testimonials = await prisma.testimonial.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, testimonials: serializeTestimonials(testimonials) });
});

export const getTestimonials = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;
  const where = search ? buildSearchFilter(search, ["name", "course"]) : {};

  const skip = (Number(page) - 1) * Number(limit);
  const [testimonials, total] = await Promise.all([
    prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.testimonial.count({ where }),
  ]);

  res.json({
    success: true,
    testimonials: serializeTestimonials(testimonials),
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  });
});

function testimonialDataFromBody(body, image) {
  return {
    name: body.name,
    course: body.course || "",
    message: body.message,
    rating: Number(body.rating) || 5,
    type: body.type || "text",
    videoUrl: body.videoUrl || "",
    isFeatured: body.isFeatured === true || body.isFeatured === "true",
    status: body.status || "Published",
    ...(image
      ? { imageUrl: image.url, imagePublicId: image.publicId }
      : {}),
  };
}

export const createTestimonial = asyncHandler(async (req, res) => {
  let image;
  if (req.file) {
    const uploaded = await uploadFile(
      req.file,
      "prep-up-gwalior/testimonials"
    );
    image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }

  const testimonial = await prisma.testimonial.create({
    data: testimonialDataFromBody(req.body, image),
  });

  await logActivity("create", "testimonial", testimonial.id, testimonial.name);
  res
    .status(201)
    .json({ success: true, testimonial: serializeTestimonial(testimonial) });
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const existing = await prisma.testimonial.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) throw new AppError("Testimonial not found.", 404);

  let image;
  if (req.file) {
    await deleteUploadedFile(existing.imagePublicId);
    const uploaded = await uploadFile(
      req.file,
      "prep-up-gwalior/testimonials"
    );
    image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }

  const testimonial = await prisma.testimonial.update({
    where: { id: req.params.id },
    data: testimonialDataFromBody(req.body, image),
  });

  await logActivity("update", "testimonial", testimonial.id);
  res.json({ success: true, testimonial: serializeTestimonial(testimonial) });
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id: req.params.id },
  });
  if (!testimonial) throw new AppError("Testimonial not found.", 404);

  await deleteUploadedFile(testimonial.imagePublicId);
  await prisma.testimonial.delete({ where: { id: req.params.id } });
  await logActivity("delete", "testimonial", req.params.id);
  res.json({ success: true, message: "Testimonial deleted." });
});
