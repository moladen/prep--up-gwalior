import prisma from "../config/prisma.js";
import { asyncHandler, AppError } from "../utils/asyncHandler.js";
import { logActivity } from "../utils/activity.js";
import {
  deleteUploadedFile,
  uploadFile,
} from "../utils/uploadHelper.js";
import {
  buildSearchFilter,
  serializeResult,
  serializeResults,
} from "../utils/serialize.js";

export const getPublicResults = asyncHandler(async (req, res) => {
  const where = { status: "Published" };
  if (req.query.exam) {
    where.exam = { contains: req.query.exam, mode: "insensitive" };
  }
  if (req.query.year) where.year = req.query.year;
  if (req.query.topper === "true") where.isTopper = true;

  const results = await prisma.result.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, results: serializeResults(results) });
});

export const getResults = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;
  const where = search
    ? buildSearchFilter(search, ["studentName", "exam"])
    : {};

  const skip = (Number(page) - 1) * Number(limit);
  const [results, total] = await Promise.all([
    prisma.result.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.result.count({ where }),
  ]);

  res.json({
    success: true,
    results: serializeResults(results),
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  });
});

function resultDataFromBody(body, image) {
  return {
    studentName: body.studentName,
    exam: body.exam,
    score: body.score || "",
    year: body.year || "",
    isTopper: body.isTopper === true || body.isTopper === "true",
    beforeText: body.beforeText || "",
    afterText: body.afterText || "",
    status: body.status || "Published",
    ...(image
      ? { imageUrl: image.url, imagePublicId: image.publicId }
      : {}),
  };
}

export const createResult = asyncHandler(async (req, res) => {
  let image;
  if (req.file) {
    const uploaded = await uploadFile(req.file, "prep-up-gwalior/results");
    image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }

  const record = await prisma.result.create({
    data: resultDataFromBody(req.body, image),
  });

  await logActivity("create", "result", record.id, record.studentName);
  res.status(201).json({ success: true, result: serializeResult(record) });
});

export const updateResult = asyncHandler(async (req, res) => {
  const existing = await prisma.result.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) throw new AppError("Result not found.", 404);

  let image;
  if (req.file) {
    await deleteUploadedFile(existing.imagePublicId);
    const uploaded = await uploadFile(req.file, "prep-up-gwalior/results");
    image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }

  const record = await prisma.result.update({
    where: { id: req.params.id },
    data: resultDataFromBody(req.body, image),
  });

  await logActivity("update", "result", record.id);
  res.json({ success: true, result: serializeResult(record) });
});

export const deleteResult = asyncHandler(async (req, res) => {
  const record = await prisma.result.findUnique({
    where: { id: req.params.id },
  });
  if (!record) throw new AppError("Result not found.", 404);

  await deleteUploadedFile(record.imagePublicId);
  await prisma.result.delete({ where: { id: req.params.id } });
  await logActivity("delete", "result", req.params.id);
  res.json({ success: true, message: "Result deleted." });
});
