"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { vision } from "@/data/content";
import { fadeUp, viewportSoft } from "@/lib/motion";

export default function VisionSection() {
  return (
    <section className="section-padding section-glow relative overflow-hidden surface-accent">
      <Container className="relative">
        <SectionHeading label="Vision" title={vision.title} />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSoft}
          variants={fadeUp}
          className="mx-auto max-w-3xl"
        >
          <div className="premium-card-layered relative overflow-hidden p-8 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-primary/8 blur-3xl" />
            <span className="icon-box-blue relative mb-6 flex h-12 w-12 items-center justify-center">
              <Eye className="h-5 w-5" />
            </span>
            <p className="relative text-lg leading-relaxed text-slate-700 sm:text-xl">
              {vision.text}
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
