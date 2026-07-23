"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Trophy,
} from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import Container from "@/components/ui/Container";
import { getPublicNotifications } from "@/lib/publicApi";

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
  return Date.now() - published <= 7 * 24 * 60 * 60 * 1000;
}

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPublicNotifications("limit=50")
      .then((data) => {
        if (!active || !Array.isArray(data)) return;
        const sorted = [...data].sort((a, b) => {
          const aImp = a.isImportant ? 1 : 0;
          const bImp = b.isImportant ? 1 : 0;
          if (bImp !== aImp) return bImp - aImp;
          return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
        });
        setItems(sorted);
      })
      .catch(() => setItems([]))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category || "General"));
    return ["All", ...Array.from(set)];
  }, [items]);

  const [filter, setFilter] = useState("All");
  const filtered =
    filter === "All"
      ? items
      : items.filter((i) => (i.category || "General") === filter);

  return (
    <>
      <PageBanner
        title="Notifications"
        subtitle="Latest admissions, batches, exams and institute updates."
      />
      <section className="section-padding bg-white">
        <Container className="max-w-3xl">
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  filter === cat
                    ? "bg-brand-primary text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="rounded-2xl border border-border bg-[#fafbfd] p-8 text-center text-sm text-muted">
              No notifications yet. Check back soon.
            </p>
          ) : (
            <ul className="space-y-3">
              {filtered.map((item) => {
                const meta =
                  CATEGORY_META[item.category] || CATEGORY_META.General;
                const Icon = meta.icon;
                const showNew = isNewNotification(item);
                const href = item.externalLink
                  ? item.externalLink
                  : `/notifications/${item.id}`;

                const content = (
                  <div className="flex items-start gap-3.5">
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.color}`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.1} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-bold text-[var(--brand-navy)]">
                          {item.title}
                        </h2>
                        {showNew ? (
                          <span className="rounded bg-brand-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                            New
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {item.category || "General"}
                        {item.publishedAt
                          ? ` · ${formatDate(item.publishedAt)}`
                          : ""}
                      </p>
                      {item.summary ? (
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                          {item.summary}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );

                return (
                  <li key={item.id}>
                    {item.externalLink ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-2xl border border-border bg-[#fafbfd] p-4 shadow-sm transition hover:border-brand-primary/30 hover:shadow-md"
                      >
                        {content}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="block rounded-2xl border border-border bg-[#fafbfd] p-4 shadow-sm transition hover:border-brand-primary/30 hover:shadow-md"
                      >
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
