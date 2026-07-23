import CourseDetailSection from "./CourseDetailSection";

export default function CourseExamPattern({ examPattern }) {
  if (!examPattern?.length) return null;

  return (
    <CourseDetailSection
      id="exam-pattern"
      label="Exam Pattern"
      title="Exam Pattern Overview"
      description="Key details about the examination format."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {examPattern.map((row) => (
          <div
            key={row.label}
            className="premium-card-layered flex items-center justify-between gap-4 p-4"
          >
            <span className="text-sm font-medium text-muted">{row.label}</span>
            <span className="text-right text-sm font-semibold text-primary-dark">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </CourseDetailSection>
  );
}
