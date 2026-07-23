"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Container from "@/components/ui/Container";
import { getImageUrl } from "@/components/ui/PersonImage";
import { ACHIEVERS } from "@/data/achievers";
import { getPublicResults } from "@/lib/publicApi";

const FALLBACK = ACHIEVERS.map((a, i) => ({
  ...a,
  rank: i + 1,
}));

export default function ResultsSection() {
  const [results, setResults] = useState(FALLBACK);
  const [start, setStart] = useState(0);

  useEffect(() => {
    let active = true;
    getPublicResults()
      .then((data) => {
        if (!active || !Array.isArray(data) || !data.length) return;
        const mapped = data.slice(0, 8).map((r, i) => ({
          id: r.id || `r-${i}`,
          studentName: r.studentName,
          exam: r.exam,
          institute: r.score || r.institute || "",
          imageUrl: getImageUrl(r) || "/students/achievers/mohit-kushwah.webp",
          quote:
            r.quote || "Hard work and the right guidance made the difference.",
          rank: i + 1,
        }));
        setResults(mapped.length ? mapped : FALLBACK);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const visibleCount = 4;
  const visible = results.slice(start, start + visibleCount);
  const canPrev = start > 0;
  const canNext = start + visibleCount < results.length;

  return (
    <section
      id="results"
      className="scroll-mt-28 bg-[#f5f7fb] py-10 sm:py-12 lg:py-14"
    >
      <Container>
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">
              Our Top Achievers
            </p>
            <h2 className="mt-1.5 text-xl font-extrabold text-[var(--brand-navy)] sm:text-2xl">
              Real Results. Real Stories.
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => setStart((s) => Math.max(0, s - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-brand-primary disabled:opacity-40"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={!canNext}
              onClick={() =>
                setStart((s) => Math.min(results.length - visibleCount, s + 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-brand-primary disabled:opacity-40"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <Link
              href="/results"
              className="ml-2 text-sm font-semibold text-brand-primary hover:underline"
            >
              View All Results
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((item) => (
            <article
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-[var(--shadow-premium)]"
            >
              <div className="relative aspect-[3/3.2] w-full overflow-hidden bg-brand-primary-light">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    getImageUrl(item) ||
                    "/students/achievers/mohit-kushwah.webp"
                  }
                  alt={item.studentName}
                  className="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white shadow-md">
                  {item.rank || 1}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-3.5">
                <h3 className="text-[15px] font-bold text-[var(--brand-navy)]">
                  {item.studentName}
                </h3>
                <p className="mt-0.5 text-sm font-semibold text-brand-primary">
                  {item.exam}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {item.institute || item.score}
                </p>
                <p className="mt-2 line-clamp-2 flex-1 text-[13px] italic leading-snug text-slate-600">
                  &ldquo;
                  {item.quote || "Focused mentoring made the difference."}
                  &rdquo;
                </p>
                <div className="mt-2.5 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-brand-gold text-brand-gold"
                    />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
