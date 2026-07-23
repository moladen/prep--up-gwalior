import prisma from "../config/prisma.js";
import { asyncHandler, AppError } from "../utils/asyncHandler.js";
import { logActivity } from "../utils/activity.js";
import {
  deleteUploadedFile,
  saveMediaRecord,
  uploadFile,
} from "../utils/uploadHelper.js";
import { serializeSettings, withId } from "../utils/serialize.js";

export const getMedia = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.media.count(),
  ]);

  res.json({
    success: true,
    media: media.map(withId),
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  });
});

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("No file uploaded.", 400);
  const result = await uploadFile(req.file);
  const media = await saveMediaRecord(result, req.file.originalname);
  await logActivity("upload", "media", media.id);
  res.status(201).json({ success: true, media: withId(media) });
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await prisma.media.findUnique({ where: { id: req.params.id } });
  if (!media) throw new AppError("Media not found.", 404);

  await deleteUploadedFile(media.publicId);
  await prisma.media.delete({ where: { id: req.params.id } });
  await logActivity("delete", "media", req.params.id);
  res.json({ success: true, message: "Media deleted." });
});

async function getOrCreateSettings() {
  let settings = await prisma.settings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: 1 } });
  }
  return settings;
}

export const getPublicSettings = asyncHandler(async (_req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ success: true, settings: serializeSettings(settings) });
});

export const getSettings = asyncHandler(async (_req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ success: true, settings: serializeSettings(settings) });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const existing = await getOrCreateSettings();
  const data = {};

  if (req.body.websiteName !== undefined) {
    data.websiteName = req.body.websiteName;
  }
  if (req.body.footerContent !== undefined) {
    data.footerContent = req.body.footerContent;
  }
  if (req.body.enquiryLink !== undefined) {
    data.enquiryLink = req.body.enquiryLink;
  }
  if (req.body.enquiryMode !== undefined) {
    data.enquiryMode = req.body.enquiryMode;
  }

  const fileField = req.body.imageField;
  if (req.file && fileField) {
    const result = await uploadFile(
      req.file,
      "prep-up-gwalior/settings"
    );

    if (fileField === "logo") {
      await deleteUploadedFile(existing.logoPublicId);
      data.logoUrl = result.secure_url;
      data.logoPublicId = result.public_id;
    } else if (fileField === "favicon") {
      await deleteUploadedFile(existing.faviconPublicId);
      data.faviconUrl = result.secure_url;
      data.faviconPublicId = result.public_id;
    }

    await saveMediaRecord(result, req.file.originalname);
  }

  const settings = await prisma.settings.update({
    where: { id: 1 },
    data,
  });

  await logActivity("update", "settings", String(settings.id));
  res.json({ success: true, settings: serializeSettings(settings) });
});
