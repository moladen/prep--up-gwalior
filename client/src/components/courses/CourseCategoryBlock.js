"use client";

import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Scale,
  Sparkles,
} from "lucide-react";
import CourseProgramCard from "@/components/courses/CourseProgramCard";

const ICONS = {
  scale: Scale,
  graduation: GraduationCap,
  sparkles: Sparkles,
  book: BookOpen,
  briefcase: Briefcase,
};

function normalizeCourse(course) {
  if (typeof course === "string") {
    return { name: course, description: "" };
  }
  return course;
}

export default function CourseCategoryBlock({ category }) {
  const Icon = ICONS[category.icon] || BookOpen;

  return (
    <section
      id={`category-${category.id}`}
      className="scroll-mt-32"
      aria-labelledby={`heading-${category.id}`}
    >
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:gap-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8F0FE] text-brand-primary ring-1 ring-brand-primary/10">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h2
            id={`heading-${category.id}`}
            className="text-xl font-extrabold tracking-tight text-[var(--brand-navy)] sm:text-2xl"
          >
            {category.title}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            {category.description}
          </p>
        </div>
      </div>

      {category.groups ? (
        <div className="space-y-8">
          {category.groups.map((group) => (
            <div key={group.id}>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-brand-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-accent)]" />
                {group.title}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
                {group.courses.map((course) => {
                  const item = normalizeCourse(course);
                  return (
                    <CourseProgramCard
                      key={item.name}
                      name={item.name}
                      description={item.description}
                      category={category.title}
                      group={group.title}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          {category.courses.map((course) => {
            const item = normalizeCourse(course);
            return (
              <CourseProgramCard
                key={item.name}
                name={item.name}
                description={item.description}
                category={category.title}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
