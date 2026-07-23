"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";
import CourseCategoryTabs from "@/components/courses/CourseCategoryTabs";
import CourseProgramCard from "@/components/courses/CourseProgramCard";
import {
  courseCategories,
  getAllCourses,
  popularCourseNames,
} from "@/data/courses";

export default function PopularCourses() {
  const [activeTab, setActiveTab] = useState("all");
  const allCourses = useMemo(() => getAllCourses(), []);

  const cards = useMemo(() => {
    const popularSet = new Set(popularCourseNames);

    if (activeTab === "all") {
      return popularCourseNames
        .map((name) => allCourses.find((c) => c.name === name))
        .filter(Boolean);
    }

    return allCourses.filter((c) => {
      if (c.categoryId !== activeTab) return false;
      // Prefer popular picks within category; fall back to first 6
      return true;
    }).slice(0, 6);
  }, [activeTab, allCourses]);

  const displayCards = useMemo(() => {
    if (activeTab !== "all") return cards.slice(0, 6);
    return cards;
  }, [activeTab, cards]);

  return (
    <section
      id="courses"
      className="scroll-mt-28 bg-white py-12 sm:py-16 lg:py-20"
    >
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">
              Popular Courses
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-[var(--brand-navy)] sm:text-3xl">
              Explore Our Top Programs
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-[15px]">
              Category-wise programs with expert faculty, structured study plans,
              and proven results.
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary transition hover:gap-2.5"
          >
            View All Courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <CourseCategoryTabs
          categories={courseCategories}
          activeId={activeTab}
          onChange={setActiveTab}
          className="mb-8"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
          >
            {displayCards.map((course) => (
              <CourseProgramCard
                key={`${activeTab}-${course.name}`}
                name={course.name}
                description={course.description}
                category={course.section}
                group={course.group}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {displayCards.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">
            No courses in this category yet.
          </p>
        )}
      </Container>
    </section>
  );
}
