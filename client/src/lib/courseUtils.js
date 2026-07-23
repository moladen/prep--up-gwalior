import { courseCategories, getAllCourses } from "@/data/courses";

export function toCourseSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[()]/g, "")
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getAllCourseEntries() {
  return getAllCourses().map((course) => ({
    ...course,
    slug: toCourseSlug(course.name),
  }));
}

export function getCourseEntryBySlug(slug) {
  return getAllCourseEntries().find((course) => course.slug === slug) || null;
}

export function getRelatedCourseEntries(currentSlug, limit = 3) {
  const current = getCourseEntryBySlug(currentSlug);
  if (!current) return [];

  return getAllCourseEntries()
    .filter(
      (course) =>
        course.slug !== currentSlug &&
        (course.groupId === current.groupId ||
          course.sectionId === current.sectionId ||
          course.categoryId === current.categoryId)
    )
    .slice(0, limit);
}

export { courseCategories };
