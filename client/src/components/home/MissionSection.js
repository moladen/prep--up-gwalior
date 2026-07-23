"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { mission } from "@/data/content";
import { fadeUp, staggerContainer, viewportSoft } from "@/lib/motion";

export default function MissionSection() {
  return (
    <section className="section-padding section-glow relative overflow-hidden surface-muted">
      <Container className="relative">
        <SectionHeading label="Mission" title={mission.title} />
        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSoft}
          variants={staggerContainer}
        >
          {mission.items.map((item, index) => (
            <motion.div
              key={item}
              variants={fadeUp}
              className="premium-card-layered group flex gap-5 p-6 sm:p-7"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary-hover text-sm font-bold text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="pt-1 leading-relaxed text-slate-700">{item}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
