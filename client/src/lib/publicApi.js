const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchPublic(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return res.json();
}

export function getPublicResults(params = "") {
  const q = params ? `?${params}` : "";
  return fetchPublic(`/api/results/public${q}`).then((data) => data.results || []);
}

export function getPublicTestimonials(params = "") {
  const q = params ? `?${params}` : "";
  return fetchPublic(`/api/testimonials/public${q}`).then(
    (data) => data.testimonials || []
  );
}

export function getPublicContactInfo() {
  return fetchPublic("/api/contact-info/public").then(
    (data) => data.contact || null
  );
}

export function getPublicCourses(params = "") {
  const q = params ? `?${params}` : "";
  return fetchPublic(`/api/courses/public${q}`).then((data) => data.courses || []);
}

export async function getPublicCourseBySlug(slug) {
  const res = await fetch(
    `${API_URL}/api/courses/public/by-slug/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch course");
  const data = await res.json();
  return data.course || null;
}

export function getPublicPlatformData() {
  return fetchPublic("/api/platform/public");
}

export function getPublicFaculty(params = "") {
  const q = params ? `?${params}` : "";
  return fetchPublic(`/api/platform/faculty/public${q}`).then(
    (data) => data.faculty || []
  );
}

export function getPublicFacultyBySlug(slug) {
  return fetchPublic(`/api/platform/faculty/public/${encodeURIComponent(slug)}`).then(
    (data) => data.faculty || null
  );
}

export function getPublicBlogs(params = "") {
  const q = params ? `?${params}` : "";
  return fetchPublic(`/api/platform/blogs/public${q}`).then((data) => data.posts || []);
}

export function getPublicBlogBySlug(slug) {
  return fetchPublic(`/api/platform/blogs/public/${encodeURIComponent(slug)}`).then(
    (data) => data.post || null
  );
}

export function getPublicFaqs(params = "") {
  const q = params ? `?${params}` : "";
  return fetchPublic(`/api/platform/faqs/public${q}`).then((data) => data.faqs || []);
}

export function getPublicGallery(params = "") {
  const q = params ? `?${params}` : "";
  return fetchPublic(`/api/platform/gallery/public${q}`).then(
    (data) => data.gallery || []
  );
}

export function getPublicSuccessStories() {
  return fetchPublic("/api/platform/success-stories/public").then(
    (data) => data.stories || []
  );
}

export function getPublicCategories() {
  return fetchPublic("/api/platform/categories/public").then(
    (data) => data.categories || []
  );
}

export function getPublicSeo() {
  return fetchPublic("/api/platform/seo/public").then((data) => data.seo || null);
}

export function getPublicSettings() {
  return fetchPublic("/api/media/public").then((data) => data.settings || null);
}

export function getPublicSlides() {
  return fetchPublic("/api/site/slides/public").then((data) => data.slides || []);
}

export function getPublicStats() {
  return fetchPublic("/api/site/stats/public").then((data) => data.stats || []);
}

export function getPublicNotifications(params = "") {
  const q = params ? `?${params}` : "";
  return fetchPublic(`/api/site/notifications/public${q}`).then(
    (data) => data.notifications || []
  );
}

export async function getPublicNotification(id) {
  const res = await fetch(`${API_URL}/api/site/notifications/public/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch notification");
  const data = await res.json();
  return data.notification || null;
}
