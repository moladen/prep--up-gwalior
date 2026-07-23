"use client";

import { motion } from "framer-motion";
import { fadeUp, viewportSoft } from "@/lib/motion";

export default function CourseDetailSection({
  id,
  label,
  title,
  description,
  children,
  className = "",
}) {
  return (
    <motion.section
      id={id}
      className={`scroll-mt-28 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={viewportSoft}
      variants={fadeUp}
    >
      {label && <span className="badge-neutral mb-3">{label}</span>}
      <h2 className="text-2xl font-bold tracking-tight text-primary-dark sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-3xl leading-relaxed text-muted">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </motion.section>
  );
}
