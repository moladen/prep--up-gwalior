import prisma from "../config/prisma.js";

export async function logActivity(action, entity, entityId, details = "") {
  try {
    await prisma.activity.create({
      data: { action, entity, entityId, details },
    });
  } catch {
    // non-blocking
  }
}
