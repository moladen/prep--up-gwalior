"use client";

const STORAGE_KEY = "prepup_course_compare";
const MAX_ITEMS = 3;

export function getComparedCourses() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleCompareCourse(course) {
  const list = getComparedCourses();
  const exists = list.find((c) => c.slug === course.slug);
  if (exists) {
    const next = list.filter((c) => c.slug !== course.slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }
  if (list.length >= MAX_ITEMS) return list;
  const next = [...list, course];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearCompare() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}
