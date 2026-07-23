"use client";

import CourseDetailSection from "./CourseDetailSection";
import CourseAccordion from "./CourseAccordion";

export default function CourseFAQ({ faqs }) {
  if (!faqs?.length) return null;

  return (
    <CourseDetailSection
      id="faq"
      label="FAQ"
      title="Frequently Asked Questions"
      description="Quick answers to common questions about this course."
    >
      <CourseAccordion items={faqs} defaultOpen={0} />
    </CourseDetailSection>
  );
}
