"use client";

import { Play } from "lucide-react";
import CourseDetailSection from "./CourseDetailSection";
import { toEmbedVideoUrl } from "@/lib/videoUtils";

export default function CourseDemoVideo({ videoUrl, courseName }) {
  const embedUrl = toEmbedVideoUrl(videoUrl);
  if (!embedUrl) return null;

  return (
    <CourseDetailSection
      id="demo"
      label="Demo Class"
      title="Watch a Free Demo Session"
      description={`Experience our teaching style before enrolling in ${courseName}.`}
    >
      <div className="course-video-frame group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900 shadow-lg">
        <div className="aspect-video">
          <iframe
            src={embedUrl}
            title={`${courseName} demo class`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-primary-dark backdrop-blur-sm">
          <Play className="h-3.5 w-3.5 text-brand-primary" />
          Demo Class
        </div>
      </div>
    </CourseDetailSection>
  );
}
