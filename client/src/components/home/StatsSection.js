"use client";

import {
  BookOpen,
  GraduationCap,
  Trophy,
  Users,
} from "lucide-react";
import Container from "@/components/ui/Container";

const STATS = [
  {
    icon: GraduationCap,
    value: "3000+",
    label: "Students Trained Since 2021",
  },
  {
    icon: BookOpen,
    value: "27+",
    label: "Programs Offered",
  },
  {
    icon: Users,
    value: "Team of",
    label: "Experienced Mentors",
  },
  {
    icon: Trophy,
    value: "5+",
    label: "Years of Excellence",
  },
];

export default function StatsSection() {
  return (
    <section className="relative z-20 mt-auto shrink-0 pb-7 sm:pb-8 lg:pb-9">
      <Container>
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_14px_36px_-18px_rgba(15,36,68,0.2)] sm:grid-cols-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            const isLastDesktop = i === STATS.length - 1;
            const isLastMobileCol = i % 2 === 1;

            return (
              <div
                key={stat.label}
                className={`flex items-center gap-3 px-3.5 py-4 sm:gap-3.5 sm:px-5 sm:py-5 ${
                  !isLastDesktop ? "sm:border-r sm:border-slate-200" : ""
                } ${
                  !isLastMobileCol
                    ? "border-r border-slate-200 sm:border-r"
                    : ""
                } ${i < 2 ? "border-b border-slate-200 sm:border-b-0" : ""}`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F0FE] text-brand-primary sm:h-14 sm:w-14">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.65} />
                </span>
                <div className="min-w-0">
                  <p className="text-lg font-extrabold leading-none tracking-tight text-[var(--brand-navy)] sm:text-xl">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-[11px] font-medium leading-snug text-slate-500 sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
