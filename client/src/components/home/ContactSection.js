"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactFormWrapper from "@/components/contact/ContactFormWrapper";
import GoogleMapsEmbed from "@/components/contact/GoogleMapsEmbed";
import { slideInLeft, slideInRight, viewportSoft } from "@/lib/motion";

export default function ContactSection({ showHeading = true }) {
  return (
    <section
      id="contact"
      className="section-padding section-glow relative overflow-hidden scroll-mt-28 surface-muted"
    >
      <Container className="relative">
        {showHeading && (
          <SectionHeading
            label="Contact"
            title="Get In Touch"
            description="Have questions? Reach out to us or visit our Gwalior center."
          />
        )}

        <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSoft}
            variants={slideInLeft}
            className="h-full space-y-6"
          >
            <ContactInfo unified />
            <GoogleMapsEmbed />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSoft}
            variants={slideInRight}
            className="h-full"
          >
            <ContactFormWrapper />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
