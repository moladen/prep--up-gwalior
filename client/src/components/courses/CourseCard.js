import Link from "next/link";
import { ArrowRight, GitCompare } from "lucide-react";
import { toCourseSlug } from "@/lib/courseUtils";

export default function CourseCard({
  name,
  description,
  slug,
  category,
  group,
  isFeatured,
  isPopular,
  isNewBatch,
  limitedSeats,
  seatsRemaining,
  onCompare,
  isCompared,
}) {
  const courseSlug = slug || toCourseSlug(name);
  const href = `/courses/${courseSlug}`;

  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,36,68,0.04)] transition duration-300 hover:-translate-y-1 hover:border-brand-primary/35 hover:shadow-[var(--shadow-premium)] sm:p-6">
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-primary">
          {group ? `${category} · ${group}` : category}
        </span>
        {isFeatured && (
          <span className="rounded-full bg-brand-primary-light px-2.5 py-0.5 text-[10px] font-semibold text-brand-primary">
            Featured
          </span>
        )}
        {isPopular && (
          <span className="rounded-full bg-brand-primary-light px-2.5 py-0.5 text-[10px] font-semibold text-brand-primary">
            Popular
          </span>
        )}
        {isNewBatch && (
          <span className="rounded-full bg-[var(--brand-accent-light)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--brand-navy)]">
            New Batch
          </span>
        )}
        {limitedSeats && (
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-800">
            {seatsRemaining ? `${seatsRemaining} seats left` : "Limited Seats"}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold tracking-tight text-[var(--brand-navy)] transition-colors group-hover:text-brand-primary">
        {name}
      </h3>

      {description ? (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      ) : (
        <div className="flex-1" />
      )}

      <Link
        href={href}
        className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-hover"
      >
        Know More
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>

      {onCompare && (
        <button
          type="button"
          onClick={() => onCompare({ name, slug: courseSlug, category })}
          className={`mt-4 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            isCompared ? "text-brand-primary" : "text-muted hover:text-brand-primary"
          }`}
        >
          <GitCompare className="h-3.5 w-3.5" />
          {isCompared ? "Added to compare" : "Compare"}
        </button>
      )}
    </div>
  );
}
