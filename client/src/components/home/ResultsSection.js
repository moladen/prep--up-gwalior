"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import Container from "@/components/ui/Container";
import { getImageUrl } from "@/components/ui/PersonImage";
import { getPublicResults } from "@/lib/publicApi";

export default function ResultsSection() {
  const [results, setResults] = useState([]);
  const [ready, setReady] = useState(false);

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
          imageUrl: getImageUrl(r) || "",
          quote: r.quote || "",
          rank: i + 1,
        }));
        if (mapped.length) setResults(mapped);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!ready || !results.length) return null;

  const loop = [...results, ...results];
  const durationSec = Math.max(results.length, 4) * 4;

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
            <Link
              href="/results"
              className="ml-0 text-sm font-semibold text-brand-primary hover:underline"
            >
              View All Results
            </Link>
          </div>
        </div>

        <div className="relative">
          <div
            className="achievers-marquee-viewport"
            style={{ ["--achievers-duration"]: `${durationSec}s` }}
            aria-label="Our Top Achievers auto-scrolling cards"
          >
            <div className="achievers-marquee-track">
              {loop.map((item, idx) => (
                <article
                  key={`${item.id}-${idx}`}
                  className="group relative flex w-[260px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-[var(--shadow-premium)] sm:w-[280px] md:w-[300px]"
                >
                  <div className="relative aspect-[3/3.2] w-full overflow-hidden bg-brand-primary-light">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.studentName}
                        className="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
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
                    {item.quote ? (
                      <p className="mt-2 line-clamp-2 flex-1 text-[13px] italic leading-snug text-slate-600">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    ) : null}
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
          </div>
        </div>
      </Container>
    </section>
  );
}
