"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Link2, Search } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import Container from "@/components/ui/Container";
import PersonImage, { getImageUrl } from "@/components/ui/PersonImage";
import { getPublicFaculty } from "@/lib/publicApi";
import { fadeUp, staggerContainer, viewportSoft } from "@/lib/motion";

export default function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicFaculty()
      .then(setFaculty)
      .catch(() => setFaculty([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = faculty.filter((member) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      member.name.toLowerCase().includes(q) ||
      member.specialization?.toLowerCase().includes(q) ||
      member.subjects?.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <PageBanner
        title="Our Faculty"
        subtitle="Experienced educators dedicated to your success."
      />
      <section className="section-padding bg-white">
        <Container>
          <div className="premium-card mb-10 p-5">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, subject, or specialization..."
                className="input-premium !pl-11"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="premium-card h-64 animate-pulse bg-slate-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted">Faculty profiles coming soon.</p>
          ) : (
            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={viewportSoft}
              variants={staggerContainer}
            >
              {filtered.map((member, index) => (
                <motion.article key={member.id} variants={fadeUp} className="premium-card p-6">
                  <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-2xl bg-slate-100">
                    <PersonImage
                      name={member.name}
                      imageUrl={getImageUrl(member)}
                      colorIndex={index}
                      objectPosition="top"
                    />
                  </div>
                  <h2 className="text-center text-lg font-bold text-primary-dark">
                    {member.name}
                  </h2>
                  <p className="text-center text-sm text-brand-primary">{member.title}</p>
                  <p className="mt-2 text-center text-xs text-muted">{member.experience}</p>
                  {member.specialization && (
                    <p className="mt-2 text-center text-sm text-slate-600">
                      {member.specialization}
                    </p>
                  )}
                  {member.subjects?.length > 0 && (
                    <p className="mt-3 text-center text-xs text-muted">
                      Subjects: {member.subjects.join(", ")}
                    </p>
                  )}
                  {member.social?.linkedin && (
                    <div className="mt-4 flex justify-center">
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted hover:text-brand-primary"
                        aria-label="LinkedIn"
                      >
                        <Link2 className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </motion.article>
              ))}
            </motion.div>
          )}
        </Container>
      </section>
    </>
  );
}
