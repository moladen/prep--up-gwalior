"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import Container from "@/components/ui/Container";
import PersonImage, { getImageUrl } from "@/components/ui/PersonImage";
import {
  getPublicResults,
  getPublicSuccessStories,
} from "@/lib/publicApi";
import { fadeUp, staggerContainer, viewportSoft } from "@/lib/motion";

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [stories, setStories] = useState([]);
  const [exam, setExam] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (exam) params.set("exam", exam);
    if (year) params.set("year", year);
    Promise.all([
      getPublicResults(params.toString()),
      getPublicSuccessStories(),
    ])
      .then(([resultsData, storiesData]) => {
        setResults(resultsData);
        setStories(storiesData);
      })
      .catch(() => {
        setResults([]);
        setStories([]);
      })
      .finally(() => setLoading(false));
  }, [exam, year]);

  const exams = useMemo(
    () => [...new Set(results.map((r) => r.exam).filter(Boolean))],
    [results]
  );
  const years = useMemo(
    () => [...new Set(results.map((r) => r.year).filter(Boolean))].sort().reverse(),
    [results]
  );

  const toppers = results.filter((r) => r.isTopper);

  return (
    <>
      <PageBanner
        title="Results"
        subtitle="Celebrating our students' achievements and success journeys."
      />
      <section className="section-padding section-alt">
        <Container>
          <div className="premium-card mb-10 flex flex-col gap-4 p-5 sm:flex-row">
            <select
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="input-premium sm:flex-1"
            >
              <option value="">All Exams</option>
              {exams.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="input-premium sm:w-48"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="premium-card h-80 animate-pulse bg-slate-200" />
              ))}
            </div>
          ) : (
            <>
              {toppers.length > 0 && (
                <div className="mb-14">
                  <h2 className="mb-6 text-2xl font-bold text-primary-dark">Top Toppers</h2>
                  <motion.div
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportSoft}
                    variants={staggerContainer}
                  >
                    {toppers.map((result, index) => (
                      <motion.article
                        key={result.id}
                        variants={fadeUp}
                        className="premium-card overflow-hidden ring-2 ring-brand-primary/20"
                      >
                        <ResultCard result={result} index={index} featured />
                      </motion.article>
                    ))}
                  </motion.div>
                </div>
              )}

              <h2 className="mb-6 text-2xl font-bold text-primary-dark">All Results</h2>
              <motion.div
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                whileInView="visible"
                viewport={viewportSoft}
                variants={staggerContainer}
              >
                {results.map((result, index) => (
                  <motion.article key={result.id} variants={fadeUp} className="premium-card overflow-hidden">
                    <ResultCard result={result} index={index} />
                  </motion.article>
                ))}
              </motion.div>

              {stories.length > 0 && (
                <div className="mt-16">
                  <h2 className="mb-6 text-2xl font-bold text-primary-dark">
                    Before & After Journeys
                  </h2>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {stories.map((story, index) => (
                      <article key={story.id} className="premium-card p-6">
                        <h3 className="font-bold text-primary-dark">{story.studentName}</h3>
                        <p className="text-sm text-brand-primary">
                          {story.exam} {story.year ? `· ${story.year}` : ""}
                        </p>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase text-muted">Before</p>
                            <p className="mt-2 text-sm text-slate-700">{story.beforeText}</p>
                          </div>
                          <div className="rounded-xl bg-brand-primary-light/40 p-4">
                            <p className="text-xs font-semibold uppercase text-brand-primary">
                              After
                            </p>
                            <p className="mt-2 text-sm text-slate-700">{story.afterText}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}

function ResultCard({ result, index, featured = false }) {
  return (
    <>
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
        <PersonImage
          name={result.studentName}
          imageUrl={getImageUrl(result)}
          colorIndex={index}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/20 to-transparent" />
        {featured && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-accent px-2.5 py-1 text-xs font-semibold text-white">
            Topper
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-secondary px-2.5 py-1 text-xs font-semibold text-white">
            <Trophy className="h-3 w-3" />
            {result.exam}
          </span>
          <h3 className="text-lg font-bold text-white">{result.studentName}</h3>
          <p className="mt-0.5 text-sm text-slate-300">{result.score || "Achiever"}</p>
        </div>
      </div>
    </>
  );
}
