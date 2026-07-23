"use client";

import { Suspense } from "react";
import StudentDashboardClient from "./DashboardClient";

export default function StudentDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
        </div>
      }
    >
      <StudentDashboardClient />
    </Suspense>
  );
}
