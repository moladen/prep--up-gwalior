"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import CourseCategoryBlock from "@/components/courses/CourseCategoryBlock";
import { courseCategories } from "@/data/courses";
import { fadeUp, staggerContainer, viewportSoft } from "@/lib/motion";

export default function AboutCourses() {
  return (
    <section className="section-padding relative overflow-hidden bg-[#f7f9fc]">
      <Container className="relative">
        <SectionHeading
          label="Programs"
          title="Our Courses"
          description="Undergraduate, postgraduate, and government exam programs — organised by category."
        />

        <motion.div
          className="space-y-14"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSoft}
          variants={staggerContainer}
        >
          {courseCategories.map((category) => (
            <motion.div key={category.id} variants={fadeUp}>
              <CourseCategoryBlock category={category} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition hover:text-brand-primary-hover"
          >
            View all course details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
