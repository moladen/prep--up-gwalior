"use client";

import { motion } from "framer-motion";
import {
  Users,
  Lightbulb,
  MessageSquare,
  ClipboardCheck,
  Compass,
  Wallet,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { whyChooseUs } from "@/data/content";
import { fadeUp, staggerContainer, viewportSoft } from "@/lib/motion";

const icons = [Users, Lightbulb, MessageSquare, ClipboardCheck, Compass, Wallet];
const iconStyles = [
  "icon-box-blue",
  "icon-box-emerald",
  "icon-box-gold",
  "icon-box-blue",
  "icon-box-emerald",
  "icon-box-gold",
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding relative overflow-hidden surface-dark-accent">
      <div className="hero-mesh opacity-40" aria-hidden>
        <div className="hero-mesh-blob hero-mesh-blob-1 !opacity-30" />
        <div className="hero-mesh-blob hero-mesh-blob-2 !opacity-20" />
      </div>

      <Container className="relative">
        <SectionHeading
          label="Why Choose Us"
          title={whyChooseUs.title}
          light
        />
        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSoft}
          variants={staggerContainer}
        >
          {whyChooseUs.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={item}
                variants={fadeUp}
                className="glass-card-dark group p-6 sm:p-7"
              >
                <span
                  className={`mb-5 flex h-11 w-11 items-center justify-center transition-transform duration-300 group-hover:scale-110 ${iconStyles[index]}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p className="font-medium leading-relaxed text-white/90">{item}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
