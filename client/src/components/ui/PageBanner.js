"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

export default function PageBanner({ title, subtitle }) {
  return (
    <section className="page-banner-bg relative overflow-hidden pt-[calc(var(--header-offset)+1rem)] pb-8 sm:pb-10">
      <div className="hero-mesh opacity-50" aria-hidden>
        <div className="hero-mesh-blob hero-mesh-blob-1 !opacity-25" />
        <div className="hero-mesh-blob hero-mesh-blob-2 !opacity-15" />
      </div>
      <div className="hero-dot-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="badge-neutral mb-4">Prep Up Gwalior</span>
          <h1 className="text-display-hero">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
              {subtitle}
            </p>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
