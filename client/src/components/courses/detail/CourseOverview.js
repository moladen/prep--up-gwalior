import CourseDetailSection from "./CourseDetailSection";

export default function CourseOverview({ overview }) {
  return (
    <CourseDetailSection
      id="overview"
      label="Overview"
      title="Course Overview"
      description="A complete look at what this program offers."
    >
      <div className="premium-card-layered p-6 sm:p-8">
        <p className="text-base leading-relaxed text-slate-700 sm:text-lg">{overview}</p>
      </div>
    </CourseDetailSection>
  );
}
