const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export function setToken(token) {
  localStorage.setItem("admin_token", token);
}

export function clearToken() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
}

export function setAdminUser(user) {
  localStorage.setItem("admin_user", JSON.stringify(user));
}

export function getAdminUser() {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("admin_user");
  return data ? JSON.parse(data) : null;
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  login: (body) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getMe: () => request("/api/auth/me"),
  changePassword: (body) =>
    request("/api/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  getDashboard: () => request("/api/admin/dashboard"),

  getCourses: (params = "") => request(`/api/courses?${params}`),
  getCourse: (id) => request(`/api/courses/${id}`),
  createCourse: (body) =>
    request("/api/courses", { method: "POST", body }),
  updateCourse: (id, body) =>
    request(`/api/courses/${id}`, { method: "PUT", body }),
  deleteCourse: (id) =>
    request(`/api/courses/${id}`, { method: "DELETE" }),

  getEnquiries: (params = "") => request(`/api/enquiries?${params}`),
  updateEnquiryStatus: (id, status) =>
    request(`/api/enquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteEnquiry: (id) =>
    request(`/api/enquiries/${id}`, { method: "DELETE" }),

  getResults: (params = "") => request(`/api/results?${params}`),
  createResult: (body) => request("/api/results", { method: "POST", body }),
  updateResult: (id, body) =>
    request(`/api/results/${id}`, { method: "PUT", body }),
  deleteResult: (id) =>
    request(`/api/results/${id}`, { method: "DELETE" }),

  getTestimonials: (params = "") => request(`/api/testimonials?${params}`),
  createTestimonial: (body) =>
    request("/api/testimonials", { method: "POST", body }),
  updateTestimonial: (id, body) =>
    request(`/api/testimonials/${id}`, { method: "PUT", body }),
  deleteTestimonial: (id) =>
    request(`/api/testimonials/${id}`, { method: "DELETE" }),

  getContent: () => request("/api/content/public"),
  updateContent: (body) =>
    request("/api/content", { method: "PUT", body: JSON.stringify(body) }),

  getContactInfo: () => request("/api/contact-info/public"),
  updateContactInfo: (body) =>
    request("/api/contact-info", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  getMedia: (params = "") => request(`/api/media?${params}`),
  uploadMedia: (body) =>
    request("/api/media/upload", { method: "POST", body }),
  deleteMedia: (id) =>
    request(`/api/media/${id}`, { method: "DELETE" }),

  getSettings: () => request("/api/media/settings"),
  updateSettings: (body) =>
    request("/api/media/settings", { method: "PUT", body }),

  submitEnquiry: (body) =>
    request("/api/enquiries", { method: "POST", body: JSON.stringify(body) }),

  // Platform CMS
  getFaculty: (params = "") => request(`/api/platform/faculty?${params}`),
  createFaculty: (body) => request("/api/platform/faculty", { method: "POST", body }),
  updateFaculty: (id, body) =>
    request(`/api/platform/faculty/${id}`, { method: "PUT", body }),
  deleteFaculty: (id) =>
    request(`/api/platform/faculty/${id}`, { method: "DELETE" }),

  getBlogs: (params = "") => request(`/api/platform/blogs?${params}`),
  createBlog: (body) => request("/api/platform/blogs", { method: "POST", body }),
  updateBlog: (id, body) =>
    request(`/api/platform/blogs/${id}`, { method: "PUT", body }),
  deleteBlog: (id) =>
    request(`/api/platform/blogs/${id}`, { method: "DELETE" }),

  getFaqs: (params = "") => request(`/api/platform/faqs?${params}`),
  createFaq: (body) =>
    request("/api/platform/faqs", { method: "POST", body: JSON.stringify(body) }),
  updateFaq: (id, body) =>
    request(`/api/platform/faqs/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteFaq: (id) =>
    request(`/api/platform/faqs/${id}`, { method: "DELETE" }),

  getAnnouncements: () => request("/api/platform/announcements"),
  createAnnouncement: (body) =>
    request("/api/platform/announcements", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateAnnouncement: (id, body) =>
    request(`/api/platform/announcements/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteAnnouncement: (id) =>
    request(`/api/platform/announcements/${id}`, { method: "DELETE" }),

  getHeroHighlights: () => request("/api/platform/hero-highlights"),
  createHeroHighlight: (body) =>
    request("/api/platform/hero-highlights", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateHeroHighlight: (id, body) =>
    request(`/api/platform/hero-highlights/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteHeroHighlight: (id) =>
    request(`/api/platform/hero-highlights/${id}`, { method: "DELETE" }),

  getGallery: () => request("/api/platform/gallery"),
  createGalleryItem: (body) =>
    request("/api/platform/gallery", { method: "POST", body }),
  updateGalleryItem: (id, body) =>
    request(`/api/platform/gallery/${id}`, { method: "PUT", body }),
  deleteGalleryItem: (id) =>
    request(`/api/platform/gallery/${id}`, { method: "DELETE" }),

  getSuccessStories: (params = "") =>
    request(`/api/platform/success-stories?${params}`),
  createSuccessStory: (body) =>
    request("/api/platform/success-stories", { method: "POST", body }),
  updateSuccessStory: (id, body) =>
    request(`/api/platform/success-stories/${id}`, { method: "PUT", body }),
  deleteSuccessStory: (id) =>
    request(`/api/platform/success-stories/${id}`, { method: "DELETE" }),

  getCategories: () => request("/api/platform/categories"),
  createCategory: (body) =>
    request("/api/platform/categories", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateCategory: (id, body) =>
    request(`/api/platform/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteCategory: (id) =>
    request(`/api/platform/categories/${id}`, { method: "DELETE" }),

  getSeo: () => request("/api/platform/seo"),
  updateSeo: (body) =>
    request("/api/platform/seo", { method: "PUT", body: JSON.stringify(body) }),

  // Site CMS — slides
  getSlides: (params = "") => request(`/api/site/slides?${params}`),
  createSlide: (body) => request("/api/site/slides", { method: "POST", body }),
  updateSlide: (id, body) =>
    request(`/api/site/slides/${id}`, { method: "PUT", body }),
  deleteSlide: (id) =>
    request(`/api/site/slides/${id}`, { method: "DELETE" }),
  reorderSlides: (order) =>
    request("/api/site/slides/reorder", {
      method: "PUT",
      body: JSON.stringify({ order }),
    }),

  // Site CMS — stats
  getStats: () => request("/api/site/stats"),
  createStat: (body) =>
    request("/api/site/stats", { method: "POST", body: JSON.stringify(body) }),
  updateStat: (id, body) =>
    request(`/api/site/stats/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteStat: (id) =>
    request(`/api/site/stats/${id}`, { method: "DELETE" }),

  // Site CMS — notifications
  getNotifications: (params = "") =>
    request(`/api/site/notifications?${params}`),
  createNotification: (body) =>
    request("/api/site/notifications", { method: "POST", body }),
  updateNotification: (id, body) =>
    request(`/api/site/notifications/${id}`, { method: "PUT", body }),
  deleteNotification: (id) =>
    request(`/api/site/notifications/${id}`, { method: "DELETE" }),

  // Site CMS — study materials
  getMaterials: (params = "") => request(`/api/site/materials?${params}`),
  createMaterial: (body) =>
    request("/api/site/materials", { method: "POST", body }),
  updateMaterial: (id, body) =>
    request(`/api/site/materials/${id}`, { method: "PUT", body }),
  deleteMaterial: (id) =>
    request(`/api/site/materials/${id}`, { method: "DELETE" }),

  // Site CMS — students (admin)
  getStudents: (params = "") =>
    request(`/api/admin/students${params ? `?${params}` : ""}`),
  createStudent: (body) =>
    request("/api/admin/students", { method: "POST", body }),
  updateStudent: (id, body) =>
    request(`/api/admin/students/${id}`, { method: "PUT", body }),
  deleteStudent: (id) =>
    request(`/api/admin/students/${id}`, { method: "DELETE" }),
  resetStudentPassword: (id, body = {}) =>
    request(`/api/admin/students/${id}/reset-password`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateStudentStatus: (id, status) =>
    request(`/api/admin/students/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  setStudentEnrollments: (id, body) =>
    request(`/api/admin/students/${id}/enrollments`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  getStudentEnrollments: (id) =>
    request(`/api/admin/students/${id}/enrollments`),

  // Admin mock tests
  getMockTests: () => request("/api/admin/tests"),
  createMockTest: (body) =>
    request("/api/admin/tests", { method: "POST", body: JSON.stringify(body) }),
  updateMockTest: (id, body) =>
    request(`/api/admin/tests/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteMockTest: (id) =>
    request(`/api/admin/tests/${id}`, { method: "DELETE" }),
  getMockTestResults: (id) => request(`/api/admin/tests/${id}/results`),
  upsertMockTestResult: (id, body) =>
    request(`/api/admin/tests/${id}/results`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

const STUDENT_TOKEN_KEY = "student_token";
const STUDENT_USER_KEY = "student_user";

export function getStudentToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STUDENT_TOKEN_KEY);
}

export function setStudentToken(token) {
  if (token) localStorage.setItem(STUDENT_TOKEN_KEY, token);
}

export function clearStudentToken() {
  localStorage.removeItem(STUDENT_TOKEN_KEY);
  localStorage.removeItem(STUDENT_USER_KEY);
}

export function setStudentUser(user) {
  localStorage.setItem(STUDENT_USER_KEY, JSON.stringify(user));
}

export function getStudentUser() {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STUDENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

async function studentRequest(endpoint, options = {}) {
  const token = getStudentToken();
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    throw err;
  }
  return data;
}

export const studentApi = {
  register: (body) =>
    studentRequest("/api/student/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body) =>
    studentRequest("/api/student/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  logout: () =>
    studentRequest("/api/student/logout", { method: "POST", body: "{}" }),
  forgotPassword: (body) =>
    studentRequest("/api/student/forgot-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  resetPassword: (body) =>
    studentRequest("/api/student/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getMe: () => studentRequest("/api/student/me"),
  updateProfile: (body) =>
    studentRequest("/api/student/profile", {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  changePassword: (body) =>
    studentRequest("/api/student/change-password", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  getDashboard: () => studentRequest("/api/student/dashboard"),
  getCourses: () => studentRequest("/api/student/courses"),
  getMaterials: () => studentRequest("/api/student/materials"),
  getTests: () => studentRequest("/api/student/tests"),
  startTest: (id) =>
    studentRequest(`/api/student/tests/${id}/start`, {
      method: "POST",
      body: "{}",
    }),
  getResults: () => studentRequest("/api/student/results"),
  getNotifications: () => studentRequest("/api/student/notifications"),
  getNotification: (id) =>
    studentRequest(`/api/student/notifications/${id}`),
};
