"use client";

import CourseDetailSection from "./CourseDetailSection";
import CourseAccordion from "./CourseAccordion";

export default function CourseSyllabus({ syllabus }) {
  if (!syllabus?.length) return null;

  const items = syllabus.map((module) => ({
    title: module.title,
    content: (
      <ul className="grid gap-2 sm:grid-cols-2">
        {module.topics.map((topic) => (
          <li key={topic} className="flex items-center gap-2 text-sm text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
            {topic}
          </li>
        ))}
      </ul>
    ),
  }));

  return (
    <CourseDetailSection
      id="syllabus"
      label="Syllabus"
      title="Complete Course Syllabus"
      description="Structured modules covering all essential topics for your target exam."
    >
      <CourseAccordion items={items} defaultOpen={0} />
    </CourseDetailSection>
  );
}
