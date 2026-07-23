import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { asyncHandler, AppError } from "../utils/asyncHandler.js";
import { logActivity } from "../utils/activity.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { serializeAdmin } from "../utils/serialize.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin || !(await comparePassword(password, admin.password))) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = signToken(admin.id);
  await logActivity("login", "admin", admin.id, admin.email);

  res.json({
    success: true,
    token,
    admin: serializeAdmin(admin),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await prisma.admin.findUnique({
    where: { id: req.admin.id },
  });

  if (!admin || !(await comparePassword(currentPassword, admin.password))) {
    throw new AppError("Current password is incorrect.", 400);
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: { password: await hashPassword(newPassword) },
  });

  await logActivity("change_password", "admin", admin.id);
  res.json({ success: true, message: "Password updated successfully." });
});
