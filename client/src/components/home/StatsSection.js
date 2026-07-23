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
    label: "Years of Excellence in Guidance",
  },
];

export default function StatsSection() {
  return (
    <section className="relative z-20 -mt-2 pb-10 sm:-mt-4 sm:pb-14 lg:-mt-6">
      <Container>
        <div className="grid grid-cols-2 overflow-hidden rounded-[20px] border border-slate-200/90 bg-white shadow-[0_16px_48px_-20px_rgba(15,36,68,0.2)] sm:grid-cols-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            const isLastDesktop = i === STATS.length - 1;
            const isLastMobileCol = i % 2 === 1;

            return (
              <div
                key={stat.label}
                className={`flex min-h-[136px] items-center gap-4 px-4 py-6 sm:min-h-[144px] sm:gap-4 sm:px-5 lg:min-h-[152px] lg:px-6 ${
                  !isLastDesktop ? "sm:border-r sm:border-slate-200" : ""
                } ${
                  !isLastMobileCol
                    ? "border-r border-slate-200 sm:border-r"
                    : ""
                } ${i < 2 ? "border-b border-slate-200 sm:border-b-0" : ""}`}
              >
                <span className="flex h-[4.625rem] w-[4.625rem] shrink-0 items-center justify-center rounded-full bg-[#E8F0FE] text-brand-primary shadow-[0_4px_12px_-4px_rgba(30,75,156,0.2)] sm:h-[4.75rem] sm:w-[4.75rem]">
                  <Icon className="h-9 w-9 sm:h-[2.35rem] sm:w-[2.35rem]" strokeWidth={1.55} />
                </span>
                <div className="min-w-0">
                  <p className="text-[1.35rem] font-extrabold leading-none tracking-tight text-[var(--brand-navy)] sm:text-[1.5rem]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[11px] font-medium leading-relaxed text-slate-500 sm:mt-2.5 sm:text-xs sm:leading-snug">
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
