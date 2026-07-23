"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Eye, Target } from "lucide-react";
import Container from "@/components/ui/Container";
import { aboutContent, vision, mission } from "@/data/content";
import { fadeUp, staggerContainer, viewportSoft } from "@/lib/motion";

const trustPoints = [
  "Expert faculty with proven track record",
  "Structured curriculum for competitive exams",
  "Personalized mentorship & doubt sessions",
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-28 bg-white py-10 sm:py-12 lg:py-14"
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSoft}
            variants={staggerContainer}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary"
            >
              About Us
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-1.5 text-xl font-extrabold text-[var(--brand-navy)] sm:text-2xl"
            >
              {aboutContent.title}
            </motion.h2>

            <motion.div className="mt-5 space-y-3.5" variants={staggerContainer}>
              {aboutContent.paragraphs.map((paragraph) => (
                <motion.p
                  key={paragraph.slice(0, 40)}
                  variants={fadeUp}
                  className="text-[15px] leading-relaxed text-slate-600 sm:text-base"
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>

            <motion.ul className="mt-6 space-y-2.5" variants={staggerContainer}>
              {trustPoints.map((point) => (
                <motion.li
                  key={point}
                  variants={fadeUp}
                  className="flex items-start gap-2.5 text-sm text-slate-700"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
                  {point}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="mt-7">
              <Link
                href="/about"
                className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-[#163a7a] bg-white px-6 text-sm font-semibold text-[#163a7a] shadow-[0_2px_10px_-4px_rgba(15,36,68,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary hover:bg-[#E8F0FE] hover:text-brand-primary"
              >
                Read More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSoft}
            variants={fadeUp}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative overflow-hidden rounded-[20px] border border-slate-200/80 bg-slate-100 shadow-[0_12px_36px_-18px_rgba(15,36,68,0.22)]">
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/about-classroom.webp"
                  alt="Prep Up Gwalior classroom"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <div className="absolute -bottom-3 left-4 z-10 rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-[0_10px_28px_-12px_rgba(15,36,68,0.28)] sm:left-5">
              <p className="text-xl font-extrabold text-brand-primary">5+</p>
              <p className="text-xs font-medium text-slate-500">
                Years of excellence in Gwalior
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 grid gap-4 sm:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSoft}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-slate-200 bg-[#f5f7fb] p-5 shadow-sm sm:p-6"
          >
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FE] text-brand-primary">
              <Eye className="h-5 w-5" />
            </span>
            <h3 className="text-base font-bold text-[var(--brand-navy)]">
              {vision.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {vision.text}
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-slate-200 bg-[#f5f7fb] p-5 shadow-sm sm:p-6"
          >
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff8e0] text-[var(--brand-navy)]">
              <Target className="h-5 w-5" />
            </span>
            <h3 className="text-base font-bold text-[var(--brand-navy)]">
              {mission.title}
            </h3>
            <ul className="mt-2 space-y-1.5">
              {mission.items.slice(0, 3).map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
