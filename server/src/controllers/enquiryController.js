import prisma from "../config/prisma.js";
import { asyncHandler, AppError } from "../utils/asyncHandler.js";
import { logActivity } from "../utils/activity.js";
import { buildSearchFilter, withId, withIdList } from "../utils/serialize.js";

export const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await prisma.enquiry.create({ data: req.body });
  await logActivity("create", "enquiry", enquiry.id, enquiry.name);
  res.status(201).json({
    success: true,
    message: "Enquiry submitted successfully",
  });
});

export const getEnquiries = asyncHandler(async (req, res) => {
  const { search = "", status = "", page = 1, limit = 10 } = req.query;

  const where = {
    ...(status ? { status } : {}),
    ...(search
      ? buildSearchFilter(search, ["name", "email", "phone", "course"])
      : {}),
  };

  const skip = (Number(page) - 1) * Number(limit);
  const [enquiries, total] = await Promise.all([
    prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.enquiry.count({ where }),
  ]);

  res.json({
    success: true,
    enquiries: withIdList(enquiries),
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  });
});

export const updateEnquiryStatus = asyncHandler(async (req, res) => {
  try {
    const enquiry = await prisma.enquiry.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    await logActivity("update", "enquiry", enquiry.id, enquiry.status);
    res.json({ success: true, enquiry: withId(enquiry) });
  } catch {
    throw new AppError("Enquiry not found.", 404);
  }
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  try {
    await prisma.enquiry.delete({ where: { id: req.params.id } });
    await logActivity("delete", "enquiry", req.params.id);
    res.json({ success: true, message: "Enquiry deleted." });
  } catch {
    throw new AppError("Enquiry not found.", 404);
  }
});
