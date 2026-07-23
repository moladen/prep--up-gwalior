"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toCourseSlug } from "@/lib/courseUtils";

export default function CourseProgramCard({
  name,
  description,
  category,
  group,
  href,
}) {
  const courseHref = href || `/courses/${toCourseSlug(name)}`;
  const subtitle = group ? `${category} · ${group}` : category;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,36,68,0.04)] transition duration-300 hover:-translate-y-1 hover:border-brand-primary/35 hover:shadow-[var(--shadow-premium)] sm:p-6">
      {subtitle ? (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-primary">
          {subtitle}
        </p>
      ) : null}

      <h3 className="text-lg font-bold tracking-tight text-[var(--brand-navy)] transition-colors group-hover:text-brand-primary">
        {name}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {description ||
          `Structured coaching for ${name} with expert faculty and regular practice.`}
      </p>

      <Link
        href={courseHref}
        className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-hover group-hover:gap-2.5"
      >
        Know More
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </article>
  );
}
