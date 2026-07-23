import prisma from "../config/prisma.js";
import { asyncHandler, AppError } from "../utils/asyncHandler.js";
import { logActivity } from "../utils/activity.js";
import { uploadFile, deleteUploadedFile } from "../utils/uploadHelper.js";
import {
  withId,
  withIdList,
  buildSearchFilter,
} from "../utils/serialize.js";

function paginate(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

function paginationMeta(total, page, limit) {
  return { total, page, pages: Math.ceil(total / limit) || 1 };
}

function serializeSlide(record) {
  if (!record) return record;
  return {
    ...withId(record),
    image: {
      url: record.imageUrl || "",
      publicId: record.imagePublicId || "",
    },
  };
}

function serializeNotification(record) {
  if (!record) return record;
  return {
    ...withId(record),
    pdf: {
      url: record.pdfUrl || "",
      publicId: record.pdfPublicId || "",
    },
  };
}

function serializeMaterial(record) {
  if (!record) return record;
  return {
    ...withId(record),
    file: {
      url: record.fileUrl || "",
      publicId: record.filePublicId || "",
    },
  };
}

// ——— Result Slides ———
export const getPublicSlides = asyncHandler(async (_req, res) => {
  const slides = await prisma.resultSlide.findMany({
    where: { status: "Published" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json({ success: true, slides: slides.map(serializeSlide) });
});

export const getAdminSlides = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const where = req.query.search
    ? buildSearchFilter(req.query.search, ["studentName", "exam", "institute"])
    : {};
  const [slides, total] = await Promise.all([
    prisma.resultSlide.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.resultSlide.count({ where }),
  ]);
  res.json({
    success: true,
    slides: slides.map(serializeSlide),
    pagination: paginationMeta(total, page, limit),
  });
});

function slideData(body, image) {
  return {
    studentName: body.studentName?.trim() || "",
    exam: body.exam || "",
    achievement: body.achievement || "",
    institute: body.institute || "",
    ctaText: body.ctaText || "Enquiry Now",
    ctaLink: body.ctaLink || "",
    sortOrder: Number(body.sortOrder) || 0,
    status: body.status || "Published",
    ...(image ? { imageUrl: image.url, imagePublicId: image.publicId } : {}),
  };
}

export const createSlide = asyncHandler(async (req, res) => {
  let image;
  if (req.file) {
    const uploaded = await uploadFile(req.file, "prep-up-gwalior/slides");
    image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const slide = await prisma.resultSlide.create({ data: slideData(req.body, image) });
  await logActivity("create", "result_slide", slide.id, slide.studentName);
  res.status(201).json({ success: true, slide: serializeSlide(slide) });
});

export const updateSlide = asyncHandler(async (req, res) => {
  const existing = await prisma.resultSlide.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Slide not found.", 404);
  let image;
  if (req.file) {
    const uploaded = await uploadFile(req.file, "prep-up-gwalior/slides");
    await deleteUploadedFile(existing.imagePublicId);
    image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const slide = await prisma.resultSlide.update({
    where: { id: req.params.id },
    data: slideData(req.body, image),
  });
  await logActivity("update", "result_slide", slide.id, slide.studentName);
  res.json({ success: true, slide: serializeSlide(slide) });
});

export const deleteSlide = asyncHandler(async (req, res) => {
  const slide = await prisma.resultSlide.findUnique({ where: { id: req.params.id } });
  if (!slide) throw new AppError("Slide not found.", 404);
  await deleteUploadedFile(slide.imagePublicId);
  await prisma.resultSlide.delete({ where: { id: req.params.id } });
  await logActivity("delete", "result_slide", slide.id, slide.studentName);
  res.json({ success: true });
});

export const reorderSlides = asyncHandler(async (req, res) => {
  const order = Array.isArray(req.body.order) ? req.body.order : [];
  await Promise.all(
    order.map((id, index) =>
      prisma.resultSlide.update({
        where: { id },
        data: { sortOrder: index },
      }).catch(() => null)
    )
  );
  res.json({ success: true });
});

// ——— Stats ———
export const getPublicStats = asyncHandler(async (_req, res) => {
  const stats = await prisma.siteStat.findMany({
    where: { status: "Published" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  res.json({ success: true, stats: withIdList(stats) });
});

export const getAdminStats = asyncHandler(async (_req, res) => {
  const stats = await prisma.siteStat.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  res.json({ success: true, stats: withIdList(stats) });
});

function statData(body) {
  return {
    key: body.key?.trim() || `stat-${Date.now()}`,
    label: body.label?.trim() || "",
    value: Number(body.value) || 0,
    suffix: body.suffix ?? "+",
    prefix: body.prefix || "",
    icon: body.icon || "Users",
    sortOrder: Number(body.sortOrder) || 0,
    status: body.status || "Published",
  };
}

export const createStat = asyncHandler(async (req, res) => {
  const stat = await prisma.siteStat.create({ data: statData(req.body) });
  await logActivity("create", "site_stat", stat.id, stat.label);
  res.status(201).json({ success: true, stat: withId(stat) });
});

export const updateStat = asyncHandler(async (req, res) => {
  const existing = await prisma.siteStat.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Stat not found.", 404);
  const data = statData({ ...existing, ...req.body, key: req.body.key || existing.key });
  const stat = await prisma.siteStat.update({ where: { id: req.params.id }, data });
  await logActivity("update", "site_stat", stat.id, stat.label);
  res.json({ success: true, stat: withId(stat) });
});

export const deleteStat = asyncHandler(async (req, res) => {
  const stat = await prisma.siteStat.findUnique({ where: { id: req.params.id } });
  if (!stat) throw new AppError("Stat not found.", 404);
  await prisma.siteStat.delete({ where: { id: req.params.id } });
  await logActivity("delete", "site_stat", stat.id, stat.label);
  res.json({ success: true });
});

// ——— Notifications ———
export const getPublicNotifications = asyncHandler(async (req, res) => {
  const where = { status: "Published" };
  if (req.query.category) where.category = req.query.category;
  const notifications = await prisma.notification.findMany({
    where,
    orderBy: [{ isImportant: "desc" }, { publishedAt: "desc" }, { sortOrder: "asc" }],
    take: Number(req.query.limit) || 50,
  });
  res.json({ success: true, notifications: notifications.map(serializeNotification) });
});

export const getPublicNotification = asyncHandler(async (req, res) => {
  const item = await prisma.notification.findFirst({
    where: { id: req.params.id, status: "Published" },
  });
  if (!item) throw new AppError("Notification not found.", 404);
  res.json({ success: true, notification: serializeNotification(item) });
});

export const getAdminNotifications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const where = req.query.search
    ? buildSearchFilter(req.query.search, ["title", "category", "summary"])
    : {};
  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { sortOrder: "asc" }],
      skip,
      take: limit,
    }),
    prisma.notification.count({ where }),
  ]);
  res.json({
    success: true,
    notifications: notifications.map(serializeNotification),
    pagination: paginationMeta(total, page, limit),
  });
});

function notificationData(body, pdf) {
  return {
    title: body.title?.trim() || "",
    category: body.category || "General",
    summary: body.summary || "",
    content: body.content || "",
    externalLink: body.externalLink || "",
    isImportant: body.isImportant === true || body.isImportant === "true",
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
    sortOrder: Number(body.sortOrder) || 0,
    status: body.status || "Published",
    ...(pdf ? { pdfUrl: pdf.url, pdfPublicId: pdf.publicId } : {}),
  };
}

export const createNotification = asyncHandler(async (req, res) => {
  let pdf;
  if (req.file) {
    const uploaded = await uploadFile(req.file, "prep-up-gwalior/notifications");
    pdf = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const item = await prisma.notification.create({
    data: notificationData(req.body, pdf),
  });
  await logActivity("create", "notification", item.id, item.title);
  res.status(201).json({ success: true, notification: serializeNotification(item) });
});

export const updateNotification = asyncHandler(async (req, res) => {
  const existing = await prisma.notification.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Notification not found.", 404);
  let pdf;
  if (req.file) {
    const uploaded = await uploadFile(req.file, "prep-up-gwalior/notifications");
    await deleteUploadedFile(existing.pdfPublicId);
    pdf = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const item = await prisma.notification.update({
    where: { id: req.params.id },
    data: notificationData(req.body, pdf),
  });
  await logActivity("update", "notification", item.id, item.title);
  res.json({ success: true, notification: serializeNotification(item) });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const item = await prisma.notification.findUnique({ where: { id: req.params.id } });
  if (!item) throw new AppError("Notification not found.", 404);
  await deleteUploadedFile(item.pdfPublicId);
  await prisma.notification.delete({ where: { id: req.params.id } });
  await logActivity("delete", "notification", item.id, item.title);
  res.json({ success: true });
});

// ——— Study materials (admin) ———
export const getAdminMaterials = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const where = req.query.search
    ? buildSearchFilter(req.query.search, ["title", "category", "description"])
    : {};
  const [materials, total] = await Promise.all([
    prisma.studyMaterial.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.studyMaterial.count({ where }),
  ]);
  res.json({
    success: true,
    materials: materials.map(serializeMaterial),
    pagination: paginationMeta(total, page, limit),
  });
});

function materialData(body, file) {
  return {
    title: body.title?.trim() || "",
    description: body.description || "",
    category: body.category || "General",
    externalLink: body.externalLink || "",
    courseId: body.courseId || "",
    sortOrder: Number(body.sortOrder) || 0,
    status: body.status || "Published",
    ...(file ? { fileUrl: file.url, filePublicId: file.publicId } : {}),
  };
}

export const createMaterial = asyncHandler(async (req, res) => {
  let file;
  if (req.file) {
    const uploaded = await uploadFile(req.file, "prep-up-gwalior/materials");
    file = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const material = await prisma.studyMaterial.create({
    data: materialData(req.body, file),
  });
  await logActivity("create", "study_material", material.id, material.title);
  res.status(201).json({ success: true, material: serializeMaterial(material) });
});

export const updateMaterial = asyncHandler(async (req, res) => {
  const existing = await prisma.studyMaterial.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Material not found.", 404);
  let file;
  if (req.file) {
    const uploaded = await uploadFile(req.file, "prep-up-gwalior/materials");
    await deleteUploadedFile(existing.filePublicId);
    file = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const material = await prisma.studyMaterial.update({
    where: { id: req.params.id },
    data: materialData(req.body, file),
  });
  await logActivity("update", "study_material", material.id, material.title);
  res.json({ success: true, material: serializeMaterial(material) });
});

export const deleteMaterial = asyncHandler(async (req, res) => {
  const material = await prisma.studyMaterial.findUnique({ where: { id: req.params.id } });
  if (!material) throw new AppError("Material not found.", 404);
  await deleteUploadedFile(material.filePublicId);
  await prisma.studyMaterial.delete({ where: { id: req.params.id } });
  await logActivity("delete", "study_material", material.id, material.title);
  res.json({ success: true });
});
