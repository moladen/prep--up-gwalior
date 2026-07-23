"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChevronRight,
  UserPlus,
  Download,
  Clock,
  CalendarDays,
  IndianRupee,
  Sparkles,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useEnrollPanel } from "@/context/EnrollPanelContext";

function CourseBadge({ children, variant = "neutral" }) {
  const styles = {
    neutral: "badge-neutral",
    secondary: "badge-secondary",
    accent: "badge-accent",
    popular: "rounded-full bg-brand-primary-light px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-primary",
  };
  return <span className={styles[variant] || styles.neutral}>{children}</span>;
}

export default function CourseHero({ course }) {
  const { openEnroll } = useEnrollPanel();
  const feeDisplay = course.fees?.amount
    ? `₹${course.fees.amount.toLocaleString("en-IN")}`
    : course.fees?.label || "On Enquiry";

  return (
    <section className="page-banner-bg relative overflow-hidden pt-[calc(var(--header-offset)+1rem)] pb-8 sm:pb-10">
      <div className="hero-mesh opacity-50" aria-hidden>
        <div className="hero-mesh-blob hero-mesh-blob-1 !opacity-25" />
        <div className="hero-mesh-blob hero-mesh-blob-2 !opacity-15" />
      </div>
      <div className="hero-dot-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <Container className="relative">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition-colors hover:text-brand-primary">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          <Link href="/courses" className="transition-colors hover:text-brand-primary">
            Courses
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          <span className="font-medium text-primary-dark">{course.name}</span>
        </motion.nav>

        <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-4 flex flex-wrap gap-2">
              <CourseBadge>
                {course.group ? `${course.section} · ${course.group}` : course.section}
              </CourseBadge>
              {course.isFeatured && <CourseBadge variant="secondary">Featured</CourseBadge>}
              {course.isPopular && <CourseBadge variant="popular">Popular</CourseBadge>}
              {course.isNewBatch && <CourseBadge variant="accent">New Batch</CourseBadge>}
              {course.limitedSeats && (
                <CourseBadge variant="accent">
                  {course.seatsRemaining
                    ? `${course.seatsRemaining} seats left`
                    : "Limited Seats"}
                </CourseBadge>
              )}
            </div>

            <h1 className="text-display-hero">{course.fullName}</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {course.tagline}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {course.duration && (
                <div className="course-hero-stat">
                  <Clock className="h-4 w-4 text-brand-primary" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                      Duration
                    </p>
                    <p className="text-sm font-semibold text-primary-dark">{course.duration}</p>
                  </div>
                </div>
              )}
              {course.batchTiming && (
                <div className="course-hero-stat">
                  <CalendarDays className="h-4 w-4 text-brand-secondary" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                      Batches
                    </p>
                    <p className="text-sm font-semibold text-primary-dark line-clamp-2">
                      {course.batchTiming}
                    </p>
                  </div>
                </div>
              )}
              <div className="course-hero-stat">
                <IndianRupee className="h-4 w-4 text-brand-accent" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Course Fee
                  </p>
                  <p className="text-sm font-semibold text-primary-dark">{feeDisplay}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button onClick={() => openEnroll(course.name)} className="w-full sm:w-auto">
                <UserPlus className="h-4 w-4" />
                Enquiry Now
              </Button>
              {course.brochureUrl && (
                <Button
                  href={course.brochureUrl}
                  variant="secondary"
                  className="w-full sm:w-auto"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" />
                  Download Brochure
                </Button>
              )}
            </div>

            {course.highlights?.length > 0 && (
              <ul className="mt-6 space-y-2">
                {course.highlights.slice(0, 4).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-slate-700"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          {(course.featuredImageUrl || course.demoVideoUrl) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="hero-image-layered"
            >
              {course.featuredImageUrl ? (
                <div className="hero-image-frame-light hero-image-frame-light--hero relative">
                  <Image
                    src={course.featuredImageUrl}
                    alt={course.fullName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                </div>
              ) : (
                <div className="premium-card-layered flex aspect-[16/10] items-center justify-center p-8 text-center">
                  <div>
                    <Sparkles className="mx-auto h-8 w-8 text-brand-primary" />
                    <p className="mt-3 font-semibold text-primary-dark">Premium Coaching</p>
                    <p className="mt-1 text-sm text-muted">Demo class available below</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
}
