"use client";

import {
  Award,
  BookMarked,
  ClipboardCheck,
  Headset,
  Layers,
  Users,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { FEATURE_STRIP } from "@/data/content";

const ICONS = [Users, Layers, Award, Headset, ClipboardCheck, BookMarked];

export default function FeatureStrip() {
  return (
    <section className="bg-[var(--brand-navy)] py-5 sm:py-6">
      <Container>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-2">
          {FEATURE_STRIP.map((label, i) => {
            const Icon = ICONS[i] || Award;
            return (
              <div
                key={label}
                className="flex items-center gap-2.5 text-white sm:justify-center"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4 text-brand-accent" />
                </span>
                <span className="text-xs font-semibold sm:text-[13px]">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
