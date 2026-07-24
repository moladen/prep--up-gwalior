"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { getPublicNotifications } from "@/lib/publicApi";
import { useContact } from "@/context/ContactContext";

const FALLBACK = [
  { id: "1", title: "CAT 2026 Admissions Open" },
  { id: "2", title: "Scholarship Test — Register Now" },
  { id: "3", title: "CLAT Mock Test Series" },
  { id: "4", title: "SSC & Banking New Batches" },
];

export default function NewsUpdatesBar() {
  const [items, setItems] = useState(FALLBACK);
  const contact = useContact();

  useEffect(() => {
    let active = true;
    getPublicNotifications("limit=8")
      .then((data) => {
        if (!active || !Array.isArray(data) || !data.length) return;
        const unique = [];
        const seen = new Set();
        for (const item of data) {
          const key = (item.title || "").trim().toLowerCase();
          if (!key || seen.has(key)) continue;
          seen.add(key);
          unique.push(item);
        }
        if (unique.length) setItems(unique);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const loop = useMemo(() => [...items, ...items], [items]);

  return (
    <div className="bg-[var(--brand-navy)] text-white">
      <div className="site-container flex items-center gap-3 py-2">
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-brand-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] sm:text-[11px]">
          <Bell className="h-3 w-3 text-brand-accent" />
          News &amp; Updates
        </span>

        <div className="notification-marquee-track relative min-w-0 flex-1 overflow-hidden">
          <div className="notification-marquee-inner flex w-max items-center gap-8">
            {loop.map((item, i) => (
              <span
                key={`${item.id}-${i}`}
                className="inline-flex shrink-0 items-center gap-2 text-[13px] text-white/90"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                {item.title}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {contact.social?.instagram ? (
            <a
              href={contact.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-brand-accent"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          ) : null}
          {contact.social?.facebook ? (
            <a
              href={contact.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-brand-accent"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
          ) : null}
          {(contact.social?.instagram || contact.social?.facebook) && (
            <span className="mx-0.5 h-4 w-px bg-white/20" aria-hidden />
          )}
          <Link
            href="/notifications"
            className="inline-flex items-center gap-1 pr-5 text-[11px] font-semibold text-white/90 transition hover:text-brand-accent"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
