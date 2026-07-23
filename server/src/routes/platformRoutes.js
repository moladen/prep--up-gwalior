import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  getPublicPlatformData,
  getPublicFaculty,
  getPublicFacultyBySlug,
  getAdminFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getPublicBlogs,
  getPublicBlogBySlug,
  getAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getPublicFaqs,
  getAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getAdminAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAdminHeroHighlights,
  createHeroHighlight,
  updateHeroHighlight,
  deleteHeroHighlight,
  getPublicGallery,
  getAdminGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getPublicSuccessStories,
  getAdminSuccessStories,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
  getPublicCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getPublicSeo,
  getAdminSeo,
  updateSeo,
} from "../controllers/platformController.js";

const router = Router();

// Public
router.get("/public", getPublicPlatformData);
router.get("/faculty/public", getPublicFaculty);
router.get("/faculty/public/:slug", getPublicFacultyBySlug);
router.get("/blogs/public", getPublicBlogs);
router.get("/blogs/public/:slug", getPublicBlogBySlug);
router.get("/faqs/public", getPublicFaqs);
router.get("/gallery/public", getPublicGallery);
router.get("/success-stories/public", getPublicSuccessStories);
router.get("/categories/public", getPublicCategories);
router.get("/seo/public", getPublicSeo);

// Admin — Faculty
router.get("/faculty", protect, getAdminFaculty);
router.post("/faculty", protect, upload.single("image"), createFaculty);
router.put("/faculty/:id", protect, upload.single("image"), updateFaculty);
router.delete("/faculty/:id", protect, deleteFaculty);

// Admin — Blog
router.get("/blogs", protect, getAdminBlogs);
router.post("/blogs", protect, upload.single("coverImage"), createBlog);
router.put("/blogs/:id", protect, upload.single("coverImage"), updateBlog);
router.delete("/blogs/:id", protect, deleteBlog);

// Admin — FAQs
router.get("/faqs", protect, getAdminFaqs);
router.post("/faqs", protect, createFaq);
router.put("/faqs/:id", protect, updateFaq);
router.delete("/faqs/:id", protect, deleteFaq);

// Admin — Announcements
router.get("/announcements", protect, getAdminAnnouncements);
router.post("/announcements", protect, createAnnouncement);
router.put("/announcements/:id", protect, updateAnnouncement);
router.delete("/announcements/:id", protect, deleteAnnouncement);

// Admin — Hero Highlights
router.get("/hero-highlights", protect, getAdminHeroHighlights);
router.post("/hero-highlights", protect, createHeroHighlight);
router.put("/hero-highlights/:id", protect, updateHeroHighlight);
router.delete("/hero-highlights/:id", protect, deleteHeroHighlight);

// Admin — Gallery
router.get("/gallery", protect, getAdminGallery);
router.post("/gallery", protect, upload.single("image"), createGalleryItem);
router.put("/gallery/:id", protect, upload.single("image"), updateGalleryItem);
router.delete("/gallery/:id", protect, deleteGalleryItem);

// Admin — Success Stories
router.get("/success-stories", protect, getAdminSuccessStories);
router.post("/success-stories", protect, upload.single("image"), createSuccessStory);
router.put("/success-stories/:id", protect, upload.single("image"), updateSuccessStory);
router.delete("/success-stories/:id", protect, deleteSuccessStory);

// Admin — Categories
router.get("/categories", protect, getAdminCategories);
router.post("/categories", protect, createCategory);
router.put("/categories/:id", protect, updateCategory);
router.delete("/categories/:id", protect, deleteCategory);

// Admin — SEO
router.get("/seo", protect, getAdminSeo);
router.put("/seo", protect, updateSeo);

export default router;
