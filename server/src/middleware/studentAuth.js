import jwt from "jsonwebtoken";
import { AppError } from "../utils/asyncHandler.js";
import prisma from "../config/prisma.js";
import { withId } from "../utils/serialize.js";
import { STUDENT_COOKIE } from "../constants/auth.js";

function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  if (req.cookies?.[STUDENT_COOKIE]) {
    return req.cookies[STUDENT_COOKIE];
  }
  return null;
}

export const protectStudent = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next(new AppError("Not authorized. Please login.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role && decoded.role !== "student") {
      return next(new AppError("Student access required.", 403));
    }

    const student = await prisma.student.findUnique({
      where: { id: decoded.id },
    });

    if (!student || student.status !== "Active") {
      return next(new AppError("Student not found or inactive.", 401));
    }

    const { password, ...safe } = student;
    req.student = withId(safe);
    next();
  } catch {
    next(new AppError("Invalid or expired token.", 401));
  }
};
