import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { withIdList } from "../utils/serialize.js";

export const getDashboard = asyncHandler(async (_req, res) => {
  const [courses, enquiries, results, testimonials, activities] =
    await Promise.all([
      prisma.course.count(),
      prisma.enquiry.count(),
      prisma.result.count(),
      prisma.testimonial.count(),
      prisma.activity.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

  res.json({
    success: true,
    stats: { courses, enquiries, results, testimonials },
    recentActivities: withIdList(activities),
  });
});
