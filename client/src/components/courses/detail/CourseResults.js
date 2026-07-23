"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { getPublicResults } from "@/lib/publicApi";
import PersonImage, { getImageUrl } from "@/components/ui/PersonImage";
import CourseDetailSection from "./CourseDetailSection";
import { fadeUp, staggerContainer, viewportSoft } from "@/lib/motion";

export default function CourseResults({ exam }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!exam?.trim()) {
      setLoading(false);
      return;
    }
    getPublicResults(`exam=${encodeURIComponent(exam)}`)
      .then((data) => setResults(data.slice(0, 6)))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [exam]);

  if (!exam?.trim()) return null;
  if (!loading && !results.length) return null;

  return (
    <CourseDetailSection
      id="results"
      label="Results"
      title="Previous Results"
      description="Our students who achieved success in this examination."
    >
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSoft}
          variants={staggerContainer}
        >
          {results.map((result, index) => (
            <motion.article
              key={result.id || result._id}
              variants={fadeUp}
              className="premium-card-layered group overflow-hidden"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                <PersonImage
                  name={result.studentName}
                  imageUrl={getImageUrl(result)}
                  colorIndex={index}
                  className="transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/15 to-transparent" />
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-secondary px-2.5 py-1 text-xs font-semibold text-white">
                  <Trophy className="h-3 w-3" />
                  {result.exam}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="text-lg font-bold text-white">{result.studentName}</h3>
                  <p className="text-sm text-slate-300">{result.score || "Top Performer"}</p>
                  {result.year && (
                    <p className="mt-1 text-xs text-slate-400">{result.year}</p>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </CourseDetailSection>
  );
}
