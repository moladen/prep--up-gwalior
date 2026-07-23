import jwt from "jsonwebtoken";
import { AppError } from "../utils/asyncHandler.js";
import prisma from "../config/prisma.js";
import { serializeAdmin } from "../utils/serialize.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return next(new AppError("Not authorized. Please login.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });

    if (!admin) {
      return next(new AppError("Admin not found.", 401));
    }

    req.admin = serializeAdmin(admin);
    next();
  } catch {
    next(new AppError("Invalid or expired token.", 401));
  }
};
