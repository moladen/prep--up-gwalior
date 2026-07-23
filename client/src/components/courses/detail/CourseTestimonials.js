"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { getPublicTestimonials } from "@/lib/publicApi";
import PersonImage, { getImageUrl } from "@/components/ui/PersonImage";
import CourseDetailSection from "./CourseDetailSection";
import { toEmbedVideoUrl } from "@/lib/videoUtils";
import { fadeUp, staggerContainer, viewportSoft } from "@/lib/motion";

function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? "fill-brand-gold text-brand-gold" : "text-slate-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function CourseTestimonials({ courseName }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicTestimonials(`course=${encodeURIComponent(courseName)}`)
      .then((data) => setItems(data.slice(0, 4)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [courseName]);

  if (!loading && !items.length) return null;

  return (
    <CourseDetailSection
      id="testimonials"
      label="Testimonials"
      title="Student Testimonials"
      description="Hear from students who prepared with us for this course."
    >
      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="premium-card h-36 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid gap-5 lg:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSoft}
          variants={staggerContainer}
        >
          {items.map((item, index) => (
            <motion.blockquote
              key={item.id}
              variants={fadeUp}
              className="premium-card-layered overflow-hidden"
            >
              {item.type === "video" && item.videoUrl ? (
                <div className="aspect-video bg-slate-900">
                  <iframe
                    src={toEmbedVideoUrl(item.videoUrl)}
                    title={`${item.name} testimonial`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : null}
              <div className="p-5 sm:p-6">
                <Quote className="mb-3 h-6 w-6 text-brand-primary/30" />
                <StarRating rating={item.rating || 5} />
                <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                  &ldquo;{item.message}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3 border-t border-slate-200/80 pt-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                    <PersonImage
                      name={item.name}
                      imageUrl={getImageUrl(item)}
                      colorIndex={index}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-dark">{item.name}</p>
                    {item.course && <p className="text-xs text-muted">{item.course}</p>}
                  </div>
                </div>
              </div>
            </motion.blockquote>
          ))}
        </motion.div>
      )}
    </CourseDetailSection>
  );
}
