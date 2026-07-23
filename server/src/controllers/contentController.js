import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logActivity } from "../utils/activity.js";
import { serializeContent } from "../utils/serialize.js";

async function getOrCreateContent() {
  let content = await prisma.siteContent.findUnique({ where: { id: 1 } });
  if (!content) {
    content = await prisma.siteContent.create({ data: { id: 1 } });
  }
  return content;
}

export const getPublicContent = asyncHandler(async (_req, res) => {
  const content = await getOrCreateContent();
  res.json({ success: true, content: serializeContent(content) });
});

export const updateContent = asyncHandler(async (req, res) => {
  const content = await prisma.siteContent.upsert({
    where: { id: 1 },
    create: { id: 1, ...req.body },
    update: req.body,
  });
  await logActivity("update", "content", String(content.id));
  res.json({ success: true, content: serializeContent(content) });
});
