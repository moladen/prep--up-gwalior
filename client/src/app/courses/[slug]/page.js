import { notFound } from "next/navigation";
import CourseDetailView from "@/components/courses/detail/CourseDetailView";
import { getCourseDetail } from "@/data/courseDetails";
import { mergeCourseWithApi } from "@/lib/courseDetailMerge";
import { getPublicCourseBySlug } from "@/lib/publicApi";
import {
  getAllCourseEntries,
  getRelatedCourseEntries,
} from "@/lib/courseUtils";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getAllCourseEntries().map((course) => ({
    slug: course.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const staticCourse = getCourseDetail(slug);

  if (!staticCourse) {
    return { title: "Course Not Found" };
  }

  let apiCourse = null;
  try {
    apiCourse = await getPublicCourseBySlug(slug);
  } catch {
    apiCourse = null;
  }

  const course = mergeCourseWithApi(staticCourse, apiCourse);

  return {
    title: course.name,
    description: course.overview.slice(0, 160),
  };
}

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const staticCourse = getCourseDetail(slug);

  if (!staticCourse) {
    notFound();
  }

  let apiCourse = null;
  try {
    apiCourse = await getPublicCourseBySlug(slug);
  } catch {
    apiCourse = null;
  }

  const course = mergeCourseWithApi(staticCourse, apiCourse);
  const relatedCourses = getRelatedCourseEntries(slug, 3);

  return <CourseDetailView course={course} relatedCourses={relatedCourses} />;
}
