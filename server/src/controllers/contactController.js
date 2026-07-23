import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logActivity } from "../utils/activity.js";
import { serializeContact } from "../utils/serialize.js";

async function getOrCreateContact() {
  let contact = await prisma.contactInfo.findUnique({ where: { id: 1 } });
  if (!contact) {
    contact = await prisma.contactInfo.create({ data: { id: 1 } });
  }
  return contact;
}

export const getPublicContact = asyncHandler(async (_req, res) => {
  const contact = await getOrCreateContact();
  res.json({ success: true, contact: serializeContact(contact) });
});

export const updateContact = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (typeof data.phones === "string") {
    data.phones = data.phones.split(",").map((p) => p.trim()).filter(Boolean);
  }

  const contact = await prisma.contactInfo.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });

  await logActivity("update", "contact", String(contact.id));
  res.json({ success: true, contact: serializeContact(contact) });
});
