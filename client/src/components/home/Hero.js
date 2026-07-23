"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, Star } from "lucide-react";
import { useEnrollPanel } from "@/context/EnrollPanelContext";
import PersonImage, { getImageUrl } from "@/components/ui/PersonImage";
import { ACHIEVERS } from "@/data/achievers";
import { getPublicSlides } from "@/lib/publicApi";

const INTERVAL = 4000;
const HERO_IMG = "/hero-classroom-room.webp";

function normalizeSlide(slide) {
  return {
    id: slide.id || slide._id,
    studentName: slide.studentName || "",
    exam: slide.exam || "",
    achievement: slide.achievement || "",
    institute: slide.institute || "",
    imageUrl: getImageUrl(slide) || "",
  };
}

export default function Hero() {
  const { openEnroll } = useEnrollPanel();
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState(ACHIEVERS);

  useEffect(() => {
    let active = true;
    getPublicSlides()
      .then((data) => {
        if (!active || !Array.isArray(data) || !data.length) return;
        const mapped = data.map(normalizeSlide).filter((s) => s.studentName);
        if (mapped.length) setSlides(mapped);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % Math.max(slides.length, 1));
  }, [slides.length]);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(goNext, INTERVAL);
    return () => clearInterval(t);
  }, [goNext, index, slides.length]);

  const current = slides[index] || slides[0];
  if (!current) return null;

  return (
    <section className="relative w-full overflow-hidden bg-white pt-[var(--header-offset)]">
      <div className="relative z-10 mx-auto grid w-full max-w-[100rem] items-center gap-6 px-[var(--site-gutter)] pb-16 pt-8 sm:gap-8 sm:pb-20 sm:pt-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10 lg:pb-24 lg:pt-12 xl:gap-12">
        <div className="relative z-20 mx-auto w-full max-w-xl text-left lg:mx-0 lg:max-w-[34rem] xl:max-w-[38rem]">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F0FE] px-3.5 py-1.5 text-[11px] font-semibold text-brand-primary sm:text-xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            India&apos;s Trusted Coaching Institute for SSC &amp; Banking Since
            2021
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="mt-4 text-[2rem] font-extrabold leading-[1.12] tracking-tight text-[var(--brand-navy)] sm:mt-5 sm:text-[2.45rem] lg:text-[2.85rem] xl:text-[3.1rem]"
          >
            Dream. Prepare. Achieve.{" "}
            <span className="text-brand-primary">Succeed.</span>
          </motion.h1>

          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="mt-4 block h-1.5 w-14 origin-left rounded-full bg-[var(--brand-accent)] sm:mt-5"
            aria-hidden
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="mt-5 max-w-lg text-[15px] leading-[1.65] text-slate-600 sm:mt-6 sm:text-base sm:leading-[1.65]"
          >
            Join 3000+ successful students who turned their dreams into reality
            with expert guidance, structured courses and proven results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-stretch"
          >
            <button
              type="button"
              onClick={() => openEnroll()}
              className="inline-flex h-11 min-h-11 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#14366f] via-[#1e4b9c] to-[#2a6bb5] px-7 text-sm font-semibold text-white shadow-[0_14px_32px_-12px_rgba(30,75,156,0.55)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:brightness-[1.06] hover:shadow-[0_18px_36px_-12px_rgba(30,75,156,0.6)] sm:w-auto"
            >
              Enquiry Now
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
              </span>
            </button>
            <Link
              href="/courses"
              className="inline-flex h-11 min-h-11 w-full items-center justify-center gap-2.5 rounded-full border-2 border-[#0f2444] bg-white px-6 text-sm font-semibold text-[#0f2444] shadow-[0_2px_10px_-4px_rgba(15,36,68,0.12)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#14366f] hover:bg-[#E8F0FE] hover:text-[#14366f] hover:shadow-[0_12px_28px_-14px_rgba(30,75,156,0.35)] sm:w-auto"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#0f2444]/35">
                <BookOpen className="h-3.5 w-3.5 text-[#0f2444]" strokeWidth={2} />
              </span>
              Explore Courses
            </Link>
          </motion.div>
        </div>

        <div className="relative z-10 w-full">
          <div className="relative mx-auto aspect-[16/9] w-full max-w-xl overflow-hidden rounded-[18px] bg-slate-100 sm:max-w-none lg:mx-0">
            <Image
              src={HERO_IMG}
              alt="Prep Up Gwalior classroom"
              fill
              className="hero-classroom-img object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 54vw"
              quality={95}
              priority
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-4 right-3 z-10 w-[min(100%-1.5rem,300px)] sm:bottom-5 sm:right-5 sm:w-[min(100%-2rem,320px)]"
              >
                <div
                  className="rounded-[18px] border border-white/30 p-4 text-white shadow-[0_24px_52px_-18px_rgba(15,36,68,0.68),0_10px_28px_-14px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-2xl sm:p-5"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(15,36,68,0.68), rgba(15,36,68,0.46))",
                  }}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-[4.75rem] w-[4.75rem] shrink-0 overflow-hidden rounded-full bg-white/10 shadow-[0_8px_22px_rgba(0,0,0,0.35)] ring-[3px] ring-[#F0C419] sm:h-[5.15rem] sm:w-[5.15rem] sm:ring-[3.5px]">
                      <PersonImage
                        name={current.studentName}
                        imageUrl={current.imageUrl}
                        objectPosition="top"
                        className="!text-2xl"
                      />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#F0C419] sm:text-[11px]">
                        {current.exam}
                      </p>
                      <p className="truncate text-[14px] font-semibold leading-snug text-white/90 sm:text-[15px]">
                        {current.achievement}
                      </p>
                      <p className="truncate text-[15px] font-black leading-snug tracking-tight text-white sm:text-base">
                        {current.studentName}
                      </p>
                      <p className="truncate text-xs font-medium text-white/60">
                        {current.institute}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-1 border-t border-white/15 pt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-[#F0C419] text-[#F0C419]"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-5 bg-brand-primary shadow-sm"
                      : "w-2 bg-white/75 ring-1 ring-black/10 hover:bg-white"
                  }`}
                  aria-label={`Show ${s.studentName}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
