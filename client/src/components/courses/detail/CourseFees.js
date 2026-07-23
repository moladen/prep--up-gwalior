import { IndianRupee, Check } from "lucide-react";
import CourseDetailSection from "./CourseDetailSection";

const includes = [
  "Classroom coaching & comprehensive study material",
  "Mock tests and detailed performance analysis",
  "Doubt-solving sessions and mentorship",
];

export default function CourseFees({ fees }) {
  return (
    <CourseDetailSection
      id="fees"
      label="Fees"
      title="Course Fees"
      description="Transparent pricing with flexible payment options."
    >
      <div className="premium-card-layered overflow-hidden">
        <div className="bg-gradient-to-br from-brand-primary-light/40 via-white to-brand-secondary-light/20 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-7 w-7 text-brand-primary" />
                <p className="text-3xl font-bold text-primary-dark sm:text-4xl">
                  {fees.amount ? fees.amount.toLocaleString("en-IN") : "On Enquiry"}
                </p>
              </div>
              {fees.label && (
                <p className="mt-1 text-sm font-medium text-primary-dark">{fees.label}</p>
              )}
              <p className="mt-2 text-sm text-muted">{fees.note}</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white/80 p-5 lg:max-w-xs">
              <p className="text-sm font-semibold text-primary-dark">Fee includes</p>
              <ul className="mt-3 space-y-2">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CourseDetailSection>
  );
}
