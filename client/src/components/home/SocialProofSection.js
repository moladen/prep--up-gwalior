"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Quote,
  Star,
  Trophy,
} from "lucide-react";
import Container from "@/components/ui/Container";
import PersonImage, { getImageUrl } from "@/components/ui/PersonImage";
import { getPublicNotifications, getPublicTestimonials } from "@/lib/publicApi";
import { usePlatform } from "@/context/PlatformContext";

const TESTIMONIAL_INTERVAL = 4500;

const FALLBACK_NOTIFICATIONS = [
  {
    id: "n1",
    title: "New CAT 2026 Batch Admissions Open",
    publishedAt: "2026-07-11",
    category: "Admissions",
    isImportant: true,
  },
  {
    id: "n2",
    title: "Scholarship Test for SSC & Banking",
    publishedAt: "2026-07-10",
    category: "Scholarship",
    isImportant: false,
  },
  {
    id: "n3",
    title: "CLAT Mock Test Series — Register Now",
    publishedAt: "2026-07-08",
    category: "Exams",
    isImportant: false,
  },
  {
    id: "n4",
    title: "IPMAT Weekend Crash Course",
    publishedAt: "2026-07-06",
    category: "Batches",
    isImportant: false,
  },
  {
    id: "n5",
    title: "New Banking Batches Starting Soon",
    publishedAt: "2026-07-04",
    category: "Batches",
    isImportant: false,
  },
  {
    id: "n6",
    title: "Free Counselling Session This Week",
    publishedAt: "2026-07-02",
    category: "General",
    isImportant: false,
  },
];

const CATEGORY_META = {
  Admissions: { icon: GraduationCap, color: "bg-brand-primary text-white" },
  Scholarship: { icon: Trophy, color: "bg-[#f0c419] text-[var(--brand-navy)]" },
  Exams: { icon: BookOpen, color: "bg-emerald-500 text-white" },
  Batches: { icon: CalendarDays, color: "bg-sky-500 text-white" },
  General: { icon: Bell, color: "bg-slate-500 text-white" },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isNewNotification(item) {
  if (item?.isImportant) return true;
  if (!item?.publishedAt) return false;
  const published = new Date(item.publishedAt).getTime();
  if (Number.isNaN(published)) return false;
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - published <= sevenDays;
}

function sortNewestFirst(list) {
  return [...list].sort((a, b) => {
    const aImp = a.isImportant ? 1 : 0;
    const bImp = b.isImportant ? 1 : 0;
    if (bImp !== aImp) return bImp - aImp;
    return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
  });
}

function notificationHref(item) {
  if (item.externalLink) return item.externalLink;
  if (item.id && !String(item.id).startsWith("n")) {
    return `/notifications/${item.id}`;
  }
  return `/notifications`;
}

function NotificationRow({ item }) {
  const meta = CATEGORY_META[item.category] || CATEGORY_META.General;
  const Icon = meta.icon;
  const href = notificationHref(item);
  const external = Boolean(item.externalLink);
  const showNew = isNewNotification(item);
  const className =
    "flex items-start gap-3 rounded-xl border border-border/80 bg-white px-3 py-2.5 transition-colors hover:border-brand-primary/35 hover:bg-white";

  const body = (
    <>
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${meta.color}`}
        aria-hidden
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="min-w-0 flex-1 text-sm font-semibold leading-snug text-[var(--brand-navy)]">
            {item.title}
          </p>
          {showNew ? (
            <span className="mt-0.5 shrink-0 rounded bg-brand-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              New
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-[11px] text-muted">
          {item.category || "General"}
          {item.publishedAt ? ` · ${formatDate(item.publishedAt)}` : ""}
        </p>
      </div>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {body}
    </Link>
  );
}

function NotificationTicker({ items }) {
  const [paused, setPaused] = useState(false);
  const sorted = useMemo(() => sortNewestFirst(items), [items]);
  const loop = useMemo(() => [...sorted, ...sorted], [sorted]);
  const durationSec = Math.max(sorted.length, 4) * 3.6;

  return (
    <div
      className="relative mt-4 h-[13.5rem] overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
        maskImage:
          "linear-gradient(180deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Latest notifications scrolling list"
    >
      <div
        className="notif-ticker-track flex flex-col gap-3 will-change-transform"
        style={{
          animationName: "notifTickerScroll",
          animationDuration: `${durationSec}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {loop.map((item, i) => (
          <div key={`${item.id}-${i}`} className="shrink-0">
            <NotificationRow item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SocialProofSection() {
  const { seo } = usePlatform();
  const [testimonials, setTestimonials] = useState([]);
  const [tIndex, setTIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let active = true;
    getPublicTestimonials()
      .then((data) => {
        if (!active || !Array.isArray(data) || !data.length) return;
        const mapped = data
          .map((t, i) => ({
            id: t.id || t._id || `t-${i}`,
            name: t.name || t.studentName || "Student",
            message: t.message || t.quote || "",
            course: t.course || t.exam || "",
            rating: t.rating || 5,
            imageUrl: getImageUrl(t) || t.imageUrl || "",
          }))
          .filter((t) => t.message);
        if (mapped.length) setTestimonials(mapped);
      })
      .catch(() => {});
    getPublicNotifications("limit=12")
      .then((data) => {
        if (active && Array.isArray(data) && data.length) {
          setNotifications(sortNewestFirst(data));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setTIndex(0);
  }, [testimonials.length]);

  useEffect(() => {
    if (paused || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setTIndex((i) => (i + 1) % testimonials.length);
    }, TESTIMONIAL_INTERVAL);
    return () => clearInterval(timer);
  }, [paused, testimonials.length, tIndex]);

  const rating = seo?.googleRating || 4.8;
  const reviewCount = seo?.googleReviewCount || 1200;
  const items = notifications.length ? notifications : FALLBACK_NOTIFICATIONS;
  const testimonial = testimonials[tIndex] || testimonials[0];

  return (
    <section
      id="testimonials"
      className="scroll-mt-28 bg-white py-14 sm:py-16 lg:py-20"
    >
      <Container>
        <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
          <article
            className="flex flex-col rounded-2xl border border-border bg-[#fafbfd] p-6 shadow-sm"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary">
              Student Testimonials
            </p>
            <Quote className="mt-4 h-8 w-8 text-brand-primary/30" />

            <div className="relative min-h-[9.5rem] flex-1">
              {testimonial ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={testimonial.id || tIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex flex-col"
                  >
                    <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-slate-700">
                      &ldquo;{testimonial.message}&rdquo;
                    </p>
                    <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full bg-brand-primary-light">
                        <PersonImage
                          name={testimonial.name}
                          imageUrl={
                            getImageUrl(testimonial) || testimonial.imageUrl
                          }
                          colorIndex={tIndex % 6}
                          objectPosition="top"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--brand-navy)]">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-muted">{testimonial.course}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <p className="mt-6 text-sm text-slate-500">
                  Student testimonials will appear here once published.
                </p>
              )}
            </div>

            {testimonials.length > 1 ? (
              <div className="mt-4 flex justify-center gap-1.5">
                {testimonials.map((t, i) => (
                  <button
                    key={t.id || i}
                    type="button"
                    onClick={() => setTIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === tIndex
                        ? "w-4 bg-brand-primary"
                        : "w-1.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Show testimonial ${i + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </article>

          <article className="flex flex-col items-center justify-center rounded-2xl border border-border bg-[#fafbfd] p-6 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary">
              Google Reviews
            </p>
            <p className="mt-4 text-5xl font-extrabold text-[var(--brand-navy)]">
              {rating}
            </p>
            <div className="mt-2 flex justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-brand-gold text-brand-gold"
                />
              ))}
            </div>
            <p className="mt-2 text-sm font-semibold text-muted">
              ({reviewCount}+ Reviews)
            </p>
            <p className="mt-1 text-xs text-muted">Rated by students on Google</p>
            {seo?.googleReviewsUrl ? (
              <a
                href={seo.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 text-sm font-semibold text-brand-primary hover:underline"
              >
                Read reviews
              </a>
            ) : null}
          </article>

          <article
            id="notifications"
            className="flex h-full flex-col rounded-2xl border border-border bg-[#fafbfd] p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary">
                Latest Notifications
              </p>
              <Link
                href="/notifications"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
              >
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <NotificationTicker items={items} />
          </article>
        </div>
      </Container>
    </section>
  );
}
