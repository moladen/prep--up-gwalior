"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import CourseCategoryTabs from "@/components/courses/CourseCategoryTabs";
import CourseCategoryBlock from "@/components/courses/CourseCategoryBlock";
import { courseCategories } from "@/data/courses";
import { fadeUp, viewportSoft } from "@/lib/motion";

export default function CoursesExplorer({ showHeading = true }) {
  const [activeTab, setActiveTab] = useState("all");

  const visibleCategories = useMemo(() => {
    if (activeTab === "all") return courseCategories;
    return courseCategories.filter((c) => c.id === activeTab);
  }, [activeTab]);

  return (
    <section
      className={`bg-[#f7f9fc] ${
        showHeading ? "section-padding" : "pb-16 pt-6 sm:pb-20 sm:pt-8"
      }`}
    >
      <Container>
        {showHeading && (
          <SectionHeading
            label="Courses"
            title="Our Courses"
            description="Browse programs by category — UG, IPMAT, PG, and Government Jobs."
          />
        )}

        <CourseCategoryTabs
          categories={courseCategories}
          activeId={activeTab}
          onChange={setActiveTab}
          className="mb-10 sm:mb-12"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-14 sm:space-y-16"
          >
            {visibleCategories.map((category) => (
              <motion.div
                key={category.id}
                initial="hidden"
                whileInView="visible"
                viewport={viewportSoft}
                variants={fadeUp}
              >
                <CourseCategoryBlock category={category} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
