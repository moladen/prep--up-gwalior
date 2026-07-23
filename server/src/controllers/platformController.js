import prisma from "../config/prisma.js";
import { asyncHandler, AppError } from "../utils/asyncHandler.js";
import { logActivity } from "../utils/activity.js";
import {
  deleteUploadedFile,
  uploadFile,
} from "../utils/uploadHelper.js";
import { toCourseSlug } from "../utils/courseSlug.js";
import {
  buildSearchFilter,
  serializeFaculty,
  serializeFacultyList,
  serializeBlogPost,
  serializeBlogPosts,
  serializeFaq,
  serializeFaqs,
  serializeAnnouncement,
  serializeAnnouncements,
  serializeHeroHighlight,
  serializeHeroHighlights,
  serializeGalleryItem,
  serializeGalleryItems,
  serializeSuccessStory,
  serializeSuccessStories,
  serializeCategory,
  serializeCategories,
  serializeSeo,
} from "../utils/serialize.js";
import { parseJsonField, stringifyJsonField } from "../utils/courseFields.js";

function paginate(query) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  return { page, limit, skip: (page - 1) * limit };
}

function paginationMeta(total, page, limit) {
  return { total, page, pages: Math.ceil(total / limit) || 1 };
}

// ——— Public bundles ———
export const getPublicPlatformData = asyncHandler(async (_req, res) => {
  const now = new Date();
  const [announcements, heroHighlights, seo] = await Promise.all([
    prisma.announcement.findMany({
      where: {
        status: "Published",
        OR: [
          { startsAt: null, endsAt: null },
          { startsAt: { lte: now }, endsAt: null },
          { startsAt: null, endsAt: { gte: now } },
          { startsAt: { lte: now }, endsAt: { gte: now } },
        ],
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 5,
    }),
    prisma.heroHighlight.findMany({
      where: { status: "Published" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.siteSeo.findUnique({ where: { id: 1 } }),
  ]);

  res.json({
    success: true,
    announcements: serializeAnnouncements(announcements),
    heroHighlights: serializeHeroHighlights(heroHighlights),
    seo: serializeSeo(seo),
  });
});

// ——— Faculty ———
export const getPublicFaculty = asyncHandler(async (req, res) => {
  const where = { status: "Published" };
  if (req.query.search) {
    Object.assign(where, buildSearchFilter(req.query.search, ["name", "title"]));
  }
  const faculty = await prisma.faculty.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  res.json({ success: true, faculty: serializeFacultyList(faculty) });
});

export const getPublicFacultyBySlug = asyncHandler(async (req, res) => {
  const published = await prisma.faculty.findMany({
    where: { status: "Published" },
  });
  const member =
    published.find((f) => f.slug === req.params.slug) ||
    published.find((f) => toCourseSlug(f.name) === req.params.slug);
  if (!member) throw new AppError("Faculty not found.", 404);
  res.json({ success: true, faculty: serializeFaculty(member) });
});

export const getAdminFaculty = asyncHandler(async (req, res) => {
  const { search = "" } = req.query;
  const { page, limit, skip } = paginate(req.query);
  const where = search ? buildSearchFilter(search, ["name", "title"]) : {};
  const [faculty, total] = await Promise.all([
    prisma.faculty.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      skip,
      take: limit,
    }),
    prisma.faculty.count({ where }),
  ]);
  res.json({
    success: true,
    faculty: serializeFacultyList(faculty),
    pagination: paginationMeta(total, page, limit),
  });
});

function facultyData(body, image) {
  const name = body.name?.trim();
  return {
    name,
    slug: body.slug?.trim() || toCourseSlug(name),
    title: body.title || "",
    qualification: body.qualification || body.title || "",
    experience: body.experience || "",
    subjects: stringifyJsonField(body.subjects, "[]"),
    specialization: body.specialization || "",
    bio: body.bio || "",
    social: stringifyJsonField(body.social, "{}"),
    status: body.status || "Published",
    sortOrder: Number(body.sortOrder) || 0,
    ...(image ? { imageUrl: image.url, imagePublicId: image.publicId } : {}),
  };
}

export const createFaculty = asyncHandler(async (req, res) => {
  let image;
  if (req.file) {
    const uploaded = await uploadFile(req.file, "prep-up-gwalior/faculty");
    image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const faculty = await prisma.faculty.create({ data: facultyData(req.body, image) });
  await logActivity("create", "faculty", faculty.id, faculty.name);
  res.status(201).json({ success: true, faculty: serializeFaculty(faculty) });
});

export const updateFaculty = asyncHandler(async (req, res) => {
  const existing = await prisma.faculty.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Faculty not found.", 404);
  let image;
  if (req.file) {
    await deleteUploadedFile(existing.imagePublicId);
    const uploaded = await uploadFile(req.file, "prep-up-gwalior/faculty");
    image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const faculty = await prisma.faculty.update({
    where: { id: req.params.id },
    data: facultyData(req.body, image),
  });
  await logActivity("update", "faculty", faculty.id, faculty.name);
  res.json({ success: true, faculty: serializeFaculty(faculty) });
});

export const deleteFaculty = asyncHandler(async (req, res) => {
  const faculty = await prisma.faculty.findUnique({ where: { id: req.params.id } });
  if (!faculty) throw new AppError("Faculty not found.", 404);
  await deleteUploadedFile(faculty.imagePublicId);
  await prisma.faculty.delete({ where: { id: req.params.id } });
  await logActivity("delete", "faculty", faculty.id, faculty.name);
  res.json({ success: true });
});

// ——— Blog ———
export const getPublicBlogs = asyncHandler(async (req, res) => {
  const where = { status: "Published" };
  if (req.query.category) where.category = req.query.category;
  if (req.query.search) {
    Object.assign(where, buildSearchFilter(req.query.search, ["title", "excerpt"]));
  }
  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  res.json({ success: true, posts: serializeBlogPosts(posts) });
});

export const getPublicBlogBySlug = asyncHandler(async (req, res) => {
  const post = await prisma.blogPost.findFirst({
    where: { slug: req.params.slug, status: "Published" },
  });
  if (!post) throw new AppError("Blog post not found.", 404);
  res.json({ success: true, post: serializeBlogPost(post) });
});

export const getAdminBlogs = asyncHandler(async (req, res) => {
  const { search = "" } = req.query;
  const { page, limit, skip } = paginate(req.query);
  const where = search ? buildSearchFilter(search, ["title", "category"]) : {};
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);
  res.json({
    success: true,
    posts: serializeBlogPosts(posts),
    pagination: paginationMeta(total, page, limit),
  });
});

function blogData(body, image) {
  const title = body.title?.trim();
  return {
    title,
    slug: body.slug?.trim() || toCourseSlug(title),
    excerpt: body.excerpt || "",
    content: body.content || "",
    category: body.category || "",
    author: body.author || "Prep Up Gwalior",
    status: body.status || "Draft",
    seoTitle: body.seoTitle || "",
    seoDescription: body.seoDescription || "",
    publishedAt:
      body.status === "Published"
        ? body.publishedAt
          ? new Date(body.publishedAt)
          : new Date()
        : null,
    ...(image
      ? { coverImageUrl: image.url, coverImagePublicId: image.publicId }
      : {}),
  };
}

export const createBlog = asyncHandler(async (req, res) => {
  let image;
  if (req.file) {
    const uploaded = await uploadFile(req.file, "prep-up-gwalior/blog");
    image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const post = await prisma.blogPost.create({ data: blogData(req.body, image) });
  await logActivity("create", "blog", post.id, post.title);
  res.status(201).json({ success: true, post: serializeBlogPost(post) });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const existing = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Blog post not found.", 404);
  let image;
  if (req.file) {
    await deleteUploadedFile(existing.coverImagePublicId);
    const uploaded = await uploadFile(req.file, "prep-up-gwalior/blog");
    image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const post = await prisma.blogPost.update({
    where: { id: req.params.id },
    data: blogData(req.body, image),
  });
  await logActivity("update", "blog", post.id, post.title);
  res.json({ success: true, post: serializeBlogPost(post) });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!post) throw new AppError("Blog post not found.", 404);
  await deleteUploadedFile(post.coverImagePublicId);
  await prisma.blogPost.delete({ where: { id: req.params.id } });
  await logActivity("delete", "blog", post.id, post.title);
  res.json({ success: true });
});

// ——— FAQs ———
export const getPublicFaqs = asyncHandler(async (req, res) => {
  const where = { status: "Published" };
  if (req.query.category) where.category = req.query.category;
  if (req.query.courseId) where.courseId = req.query.courseId;
  const faqs = await prisma.faq.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json({ success: true, faqs: serializeFaqs(faqs) });
});

export const getAdminFaqs = asyncHandler(async (req, res) => {
  const { search = "" } = req.query;
  const { page, limit, skip } = paginate(req.query);
  const where = search ? buildSearchFilter(search, ["question", "category"]) : {};
  const [faqs, total] = await Promise.all([
    prisma.faq.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.faq.count({ where }),
  ]);
  res.json({
    success: true,
    faqs: serializeFaqs(faqs),
    pagination: paginationMeta(total, page, limit),
  });
});

function faqData(body) {
  return {
    question: body.question,
    answer: body.answer,
    category: body.category || "general",
    courseId: body.courseId || "",
    sortOrder: Number(body.sortOrder) || 0,
    status: body.status || "Published",
  };
}

export const createFaq = asyncHandler(async (req, res) => {
  const faq = await prisma.faq.create({ data: faqData(req.body) });
  await logActivity("create", "faq", faq.id, faq.question.slice(0, 40));
  res.status(201).json({ success: true, faq: serializeFaq(faq) });
});

export const updateFaq = asyncHandler(async (req, res) => {
  const existing = await prisma.faq.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("FAQ not found.", 404);
  const faq = await prisma.faq.update({
    where: { id: req.params.id },
    data: faqData(req.body),
  });
  await logActivity("update", "faq", faq.id, faq.question.slice(0, 40));
  res.json({ success: true, faq: serializeFaq(faq) });
});

export const deleteFaq = asyncHandler(async (req, res) => {
  const faq = await prisma.faq.findUnique({ where: { id: req.params.id } });
  if (!faq) throw new AppError("FAQ not found.", 404);
  await prisma.faq.delete({ where: { id: req.params.id } });
  await logActivity("delete", "faq", faq.id, faq.question.slice(0, 40));
  res.json({ success: true });
});

// ——— Announcements ———
export const getAdminAnnouncements = asyncHandler(async (req, res) => {
  const items = await prisma.announcement.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json({ success: true, announcements: serializeAnnouncements(items) });
});

function announcementData(body) {
  return {
    message: body.message,
    link: body.link || "",
    linkText: body.linkText || "Learn More",
    status: body.status || "Published",
    sortOrder: Number(body.sortOrder) || 0,
    startsAt: body.startsAt ? new Date(body.startsAt) : null,
    endsAt: body.endsAt ? new Date(body.endsAt) : null,
  };
}

export const createAnnouncement = asyncHandler(async (req, res) => {
  const item = await prisma.announcement.create({ data: announcementData(req.body) });
  await logActivity("create", "announcement", item.id, item.message.slice(0, 40));
  res.status(201).json({ success: true, announcement: serializeAnnouncement(item) });
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
  const existing = await prisma.announcement.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Announcement not found.", 404);
  const item = await prisma.announcement.update({
    where: { id: req.params.id },
    data: announcementData(req.body),
  });
  await logActivity("update", "announcement", item.id, item.message.slice(0, 40));
  res.json({ success: true, announcement: serializeAnnouncement(item) });
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const item = await prisma.announcement.findUnique({ where: { id: req.params.id } });
  if (!item) throw new AppError("Announcement not found.", 404);
  await prisma.announcement.delete({ where: { id: req.params.id } });
  await logActivity("delete", "announcement", item.id, item.message.slice(0, 40));
  res.json({ success: true });
});

// ——— Hero Highlights ———
export const getAdminHeroHighlights = asyncHandler(async (_req, res) => {
  const items = await prisma.heroHighlight.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json({ success: true, heroHighlights: serializeHeroHighlights(items) });
});

function heroHighlightData(body) {
  return {
    label: body.label,
    description: body.description || "",
    icon: body.icon || "BookOpen",
    link: body.link || "",
    section: body.section || "",
    status: body.status || "Published",
    sortOrder: Number(body.sortOrder) || 0,
  };
}

export const createHeroHighlight = asyncHandler(async (req, res) => {
  const item = await prisma.heroHighlight.create({ data: heroHighlightData(req.body) });
  await logActivity("create", "heroHighlight", item.id, item.label);
  res.status(201).json({ success: true, heroHighlight: serializeHeroHighlight(item) });
});

export const updateHeroHighlight = asyncHandler(async (req, res) => {
  const existing = await prisma.heroHighlight.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Hero highlight not found.", 404);
  const item = await prisma.heroHighlight.update({
    where: { id: req.params.id },
    data: heroHighlightData(req.body),
  });
  await logActivity("update", "heroHighlight", item.id, item.label);
  res.json({ success: true, heroHighlight: serializeHeroHighlight(item) });
});

export const deleteHeroHighlight = asyncHandler(async (req, res) => {
  const item = await prisma.heroHighlight.findUnique({ where: { id: req.params.id } });
  if (!item) throw new AppError("Hero highlight not found.", 404);
  await prisma.heroHighlight.delete({ where: { id: req.params.id } });
  await logActivity("delete", "heroHighlight", item.id, item.label);
  res.json({ success: true });
});

// ——— Gallery ———
export const getPublicGallery = asyncHandler(async (req, res) => {
  const where = { status: "Published" };
  if (req.query.category) where.category = req.query.category;
  const items = await prisma.galleryItem.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json({ success: true, gallery: serializeGalleryItems(items) });
});

export const getAdminGallery = asyncHandler(async (_req, res) => {
  const items = await prisma.galleryItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json({ success: true, gallery: serializeGalleryItems(items) });
});

function galleryData(body, image) {
  if (!image?.url) throw new AppError("Image is required.", 400);
  return {
    title: body.title || "",
    category: body.category || "",
    status: body.status || "Published",
    sortOrder: Number(body.sortOrder) || 0,
    imageUrl: image.url,
    imagePublicId: image.publicId,
  };
}

export const createGalleryItem = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("Image is required.", 400);
  const uploaded = await uploadFile(req.file, "prep-up-gwalior/gallery");
  const image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  const item = await prisma.galleryItem.create({ data: galleryData(req.body, image) });
  await logActivity("create", "gallery", item.id, item.title || "Gallery item");
  res.status(201).json({ success: true, item: serializeGalleryItem(item) });
});

export const updateGalleryItem = asyncHandler(async (req, res) => {
  const existing = await prisma.galleryItem.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Gallery item not found.", 404);
  let image;
  if (req.file) {
    await deleteUploadedFile(existing.imagePublicId);
    const uploaded = await uploadFile(req.file, "prep-up-gwalior/gallery");
    image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const item = await prisma.galleryItem.update({
    where: { id: req.params.id },
    data: {
      title: req.body.title ?? existing.title,
      category: req.body.category ?? existing.category,
      status: req.body.status ?? existing.status,
      sortOrder: Number(req.body.sortOrder ?? existing.sortOrder),
      ...(image
        ? { imageUrl: image.url, imagePublicId: image.publicId }
        : {}),
    },
  });
  await logActivity("update", "gallery", item.id, item.title || "Gallery item");
  res.json({ success: true, item: serializeGalleryItem(item) });
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await prisma.galleryItem.findUnique({ where: { id: req.params.id } });
  if (!item) throw new AppError("Gallery item not found.", 404);
  await deleteUploadedFile(item.imagePublicId);
  await prisma.galleryItem.delete({ where: { id: req.params.id } });
  await logActivity("delete", "gallery", item.id, item.title || "Gallery item");
  res.json({ success: true });
});

// ——— Success Stories ———
export const getPublicSuccessStories = asyncHandler(async (_req, res) => {
  const stories = await prisma.successStory.findMany({
    where: { status: "Published" },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, stories: serializeSuccessStories(stories) });
});

export const getAdminSuccessStories = asyncHandler(async (req, res) => {
  const { search = "" } = req.query;
  const { page, limit, skip } = paginate(req.query);
  const where = search
    ? buildSearchFilter(search, ["studentName", "exam"])
    : {};
  const [stories, total] = await Promise.all([
    prisma.successStory.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.successStory.count({ where }),
  ]);
  res.json({
    success: true,
    stories: serializeSuccessStories(stories),
    pagination: paginationMeta(total, page, limit),
  });
});

function successStoryData(body, image) {
  return {
    studentName: body.studentName,
    exam: body.exam || "",
    beforeText: body.beforeText || "",
    afterText: body.afterText || "",
    year: body.year || "",
    status: body.status || "Published",
    ...(image ? { imageUrl: image.url, imagePublicId: image.publicId } : {}),
  };
}

export const createSuccessStory = asyncHandler(async (req, res) => {
  let image;
  if (req.file) {
    const uploaded = await uploadFile(req.file, "prep-up-gwalior/success");
    image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const story = await prisma.successStory.create({
    data: successStoryData(req.body, image),
  });
  await logActivity("create", "successStory", story.id, story.studentName);
  res.status(201).json({ success: true, story: serializeSuccessStory(story) });
});

export const updateSuccessStory = asyncHandler(async (req, res) => {
  const existing = await prisma.successStory.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) throw new AppError("Success story not found.", 404);
  let image;
  if (req.file) {
    await deleteUploadedFile(existing.imagePublicId);
    const uploaded = await uploadFile(req.file, "prep-up-gwalior/success");
    image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const story = await prisma.successStory.update({
    where: { id: req.params.id },
    data: successStoryData(req.body, image),
  });
  await logActivity("update", "successStory", story.id, story.studentName);
  res.json({ success: true, story: serializeSuccessStory(story) });
});

export const deleteSuccessStory = asyncHandler(async (req, res) => {
  const story = await prisma.successStory.findUnique({
    where: { id: req.params.id },
  });
  if (!story) throw new AppError("Success story not found.", 404);
  await deleteUploadedFile(story.imagePublicId);
  await prisma.successStory.delete({ where: { id: req.params.id } });
  await logActivity("delete", "successStory", story.id, story.studentName);
  res.json({ success: true });
});

// ——— Categories ———
export const getPublicCategories = asyncHandler(async (_req, res) => {
  const categories = await prisma.category.findMany({
    where: { status: "Published" },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  res.json({ success: true, categories: serializeCategories(categories) });
});

export const getAdminCategories = asyncHandler(async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  res.json({ success: true, categories: serializeCategories(categories) });
});

function categoryData(body) {
  const name = body.name?.trim();
  return {
    name,
    slug: body.slug?.trim() || toCourseSlug(name),
    description: body.description || "",
    sortOrder: Number(body.sortOrder) || 0,
    status: body.status || "Published",
  };
}

export const createCategory = asyncHandler(async (req, res) => {
  const category = await prisma.category.create({ data: categoryData(req.body) });
  await logActivity("create", "category", category.id, category.name);
  res.status(201).json({ success: true, category: serializeCategory(category) });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Category not found.", 404);
  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: categoryData(req.body),
  });
  await logActivity("update", "category", category.id, category.name);
  res.json({ success: true, category: serializeCategory(category) });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await prisma.category.findUnique({ where: { id: req.params.id } });
  if (!category) throw new AppError("Category not found.", 404);
  await prisma.category.delete({ where: { id: req.params.id } });
  await logActivity("delete", "category", category.id, category.name);
  res.json({ success: true });
});

// ——— SEO ———
export const getPublicSeo = asyncHandler(async (_req, res) => {
  let seo = await prisma.siteSeo.findUnique({ where: { id: 1 } });
  if (!seo) {
    seo = await prisma.siteSeo.create({ data: { id: 1 } });
  }
  res.json({ success: true, seo: serializeSeo(seo) });
});

export const getAdminSeo = asyncHandler(async (_req, res) => {
  let seo = await prisma.siteSeo.findUnique({ where: { id: 1 } });
  if (!seo) {
    seo = await prisma.siteSeo.create({ data: { id: 1 } });
  }
  res.json({ success: true, seo: serializeSeo(seo) });
});

export const updateSeo = asyncHandler(async (req, res) => {
  const data = {
    homeTitle: req.body.homeTitle || "",
    homeDescription: req.body.homeDescription || "",
    homeKeywords: req.body.homeKeywords || "",
    ogImageUrl: req.body.ogImageUrl || "",
    googleRating: Number(req.body.googleRating) || 4.8,
    googleReviewCount: Number(req.body.googleReviewCount) || 0,
    googlePlaceId: req.body.googlePlaceId || "",
    googleReviewsUrl: req.body.googleReviewsUrl || "",
    googleEmbedHtml: req.body.googleEmbedHtml || "",
  };
  const seo = await prisma.siteSeo.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
  await logActivity("update", "seo", "1", "Site SEO");
  res.json({ success: true, seo: serializeSeo(seo) });
});
