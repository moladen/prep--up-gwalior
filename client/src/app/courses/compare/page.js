import { Suspense } from "react";
import CourseCompareClient from "./CourseCompareClient";

export const metadata = {
  title: "Compare Courses",
};

export default function CourseComparePage() {
  return (
    <Suspense fallback={<div className="section-padding text-center text-muted">Loading...</div>}>
      <CourseCompareClient />
    </Suspense>
  );
}
