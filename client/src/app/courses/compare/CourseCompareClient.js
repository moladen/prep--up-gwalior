"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, GitCompare } from "lucide-react";
import Container from "@/components/ui/Container";
import PageBanner from "@/components/ui/PageBanner";
import { getAllCourseEntries } from "@/lib/courseUtils";
import { getCourseDetail } from "@/data/courseDetails";

export default function CourseCompareClient() {
  const searchParams = useSearchParams();
  const slugs = (searchParams.get("slugs") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  const courses = slugs
    .map((slug) => {
      const entry = getAllCourseEntries().find((e) => e.slug === slug);
      const detail = getCourseDetail(slug);
      return entry
        ? {
            slug,
            name: entry.name,
            section: entry.section,
            duration: detail?.duration || "—",
            batchTiming: detail?.batchTiming || "—",
            fees: detail?.fees?.label || detail?.fees?.amount || "On enquiry",
          }
        : null;
    })
    .filter(Boolean);

  return (
    <>
      <PageBanner
        title="Compare Courses"
        subtitle="Side-by-side comparison to help you choose the right program."
      />
      <section className="section-padding surface-white">
        <Container>
          {courses.length < 2 ? (
            <div className="premium-card p-8 text-center">
              <p className="text-muted">
                Select at least 2 courses from the courses page to compare.
              </p>
              <Link href="/courses" className="btn-primary mt-6 inline-flex">
                Browse Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="premium-card border-0 p-4 font-semibold text-muted">
                      Feature
                    </th>
                    {courses.map((c) => (
                      <th
                        key={c.slug}
                        className="premium-card border-0 p-4 font-bold text-primary-dark"
                      >
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Category", (c) => c.section],
                    ["Duration", (c) => c.duration],
                    ["Batch Timing", (c) => c.batchTiming],
                    ["Fees", (c) => c.fees],
                  ].map(([label, getter]) => (
                    <tr key={label}>
                      <td className="border-t border-border/60 p-4 font-medium text-muted">
                        {label}
                      </td>
                      {courses.map((c) => (
                        <td
                          key={c.slug}
                          className="border-t border-border/60 p-4 text-slate-700"
                        >
                          {getter(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-8 flex items-center gap-2 text-xs text-muted">
            <GitCompare className="h-3.5 w-3.5" />
            Use the compare button on course cards to add up to 3 programs.
          </p>
        </Container>
      </section>
    </>
  );
}
