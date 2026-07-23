import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import CourseDetailSection from "./CourseDetailSection";

export default function RelatedCourses({ courses }) {
  if (!courses.length) return null;

  return (
    <CourseDetailSection
      id="related"
      label="Related"
      title="Related Courses"
      description="Explore more programs in the same category."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.slug}
            name={course.name}
            slug={course.slug}
            category={course.section}
            group={course.group}
          />
        ))}
      </div>
      <div className="mt-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition-colors hover:text-primary-dark"
        >
          View All Courses
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </CourseDetailSection>
  );
}
