"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Link2, GraduationCap } from "lucide-react";
import { getPublicFaculty } from "@/lib/publicApi";
import CourseDetailSection from "./CourseDetailSection";
import PersonImage, { getImageUrl } from "@/components/ui/PersonImage";
import { fadeUp, staggerContainer, viewportSoft } from "@/lib/motion";

export default function CourseFaculty({ facultyIds = [], courseName }) {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!facultyIds?.length) {
      setLoading(false);
      return;
    }
    getPublicFaculty()
      .then((all) => {
        const ids = new Set(facultyIds);
        setFaculty(all.filter((f) => ids.has(f.id) || ids.has(f._id)));
      })
      .catch(() => setFaculty([]))
      .finally(() => setLoading(false));
  }, [facultyIds]);

  if (!facultyIds?.length) return null;
  if (!loading && !faculty.length) return null;

  return (
    <CourseDetailSection
      id="faculty"
      label="Faculty"
      title="Meet Your Faculty"
      description="Learn from experienced educators dedicated to your success."
    >
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="premium-card h-40 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid gap-5 sm:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSoft}
          variants={staggerContainer}
        >
          {faculty.map((member, index) => (
            <motion.article
              key={member.id}
              variants={fadeUp}
              className="premium-card-layered group overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-36 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-auto sm:w-32">
                  {member.image?.url ? (
                    <Image
                      src={member.image.url}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="128px"
                    />
                  ) : (
                    <PersonImage
                      name={member.name}
                      imageUrl={getImageUrl(member)}
                      colorIndex={index}
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-brand-primary" />
                    <h3 className="font-bold text-primary-dark">{member.name}</h3>
                  </div>
                  {member.title && (
                    <p className="text-sm font-medium text-brand-primary">{member.title}</p>
                  )}
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {member.experience}
                    {member.specialization ? ` · ${member.specialization}` : ""}
                  </p>
                  {member.subjects?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {member.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  )}
                  {member.bio && (
                    <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-600">
                      {member.bio}
                    </p>
                  )}
                  <div className="mt-auto flex gap-2 pt-3">
                    {member.social?.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted transition-colors hover:text-brand-primary"
                        aria-label="LinkedIn"
                      >
                        <Link2 className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </CourseDetailSection>
  );
}
