"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { aboutContent } from "@/data/content";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

export default function AboutContent() {
  return (
    <section className="section-padding section-alt">
      <Container>
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            label="About Us"
            title={aboutContent.title}
            align="left"
          />
          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
          >
            {aboutContent.paragraphs.map((paragraph) => (
              <motion.p
                key={paragraph.slice(0, 40)}
                variants={fadeUp}
                className="text-lg leading-relaxed text-muted"
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
