import { Clock, CalendarDays } from "lucide-react";
import CourseDetailSection from "./CourseDetailSection";

export default function CourseSchedule({ duration, batchTiming }) {
  if (!duration && !batchTiming) return null;

  return (
    <CourseDetailSection
      id="schedule"
      label="Schedule"
      title="Duration & Batch Timings"
      description="Plan your preparation with flexible batch options."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {duration && (
          <div className="premium-card-layered flex gap-4 p-5">
            <span className="icon-box-blue flex h-11 w-11 shrink-0 items-center justify-center">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Duration
              </p>
              <p className="mt-1 font-semibold text-primary-dark">{duration}</p>
            </div>
          </div>
        )}
        {batchTiming && (
          <div className="premium-card-layered flex gap-4 p-5">
            <span className="icon-box-emerald flex h-11 w-11 shrink-0 items-center justify-center">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Batch Timings
              </p>
              <p className="mt-1 font-semibold leading-relaxed text-primary-dark">
                {batchTiming}
              </p>
            </div>
          </div>
        )}
      </div>
    </CourseDetailSection>
  );
}
