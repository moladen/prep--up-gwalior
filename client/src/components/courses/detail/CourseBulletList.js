"use client";

import { CheckCircle2, Target } from "lucide-react";
import CourseDetailSection from "./CourseDetailSection";

export default function CourseBulletList({
  id,
  label,
  title,
  description,
  items = [],
  icon: Icon = CheckCircle2,
}) {
  if (!items?.length) return null;

  return (
    <CourseDetailSection id={id} label={label} title={title} description={description}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="premium-card-layered flex items-start gap-3 p-4 text-sm leading-relaxed text-slate-700"
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-secondary" />
            {item}
          </li>
        ))}
      </ul>
    </CourseDetailSection>
  );
}

export function CourseLearningOutcomes({ items }) {
  return (
    <CourseBulletList
      id="outcomes"
      label="Outcomes"
      title="Learning Outcomes"
      description="What you will achieve by the end of this program."
      items={items}
      icon={Target}
    />
  );
}
