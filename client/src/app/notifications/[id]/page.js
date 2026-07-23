"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import Container from "@/components/ui/Container";
import PageBanner from "@/components/ui/PageBanner";
import { getPublicNotification } from "@/lib/publicApi";

export default function NotificationDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    if (!id) return;
    getPublicNotification(id)
      .then((data) => {
        if (!active) return;
        if (!data) setError("Notification not found.");
        else setItem(data);
      })
      .catch(() => {
        if (active) setError("Unable to load notification.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const pdfUrl = item?.pdf?.url || item?.pdfUrl || "";
  const published = item?.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <>
      <PageBanner
        title={item?.title || "Notification"}
        subtitle={item ? `${item.category || "General"} · ${published}` : "Latest updates"}
      />
      <section className="section-padding">
        <Container className="max-w-3xl">
          <Link
            href="/notifications"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to notifications
          </Link>

          {loading ? (
            <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
          ) : error ? (
            <p className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
              {error}
            </p>
          ) : (
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-primary-light px-3 py-1 text-xs font-semibold text-brand-primary">
                  {item.category || "General"}
                </span>
                {item.isImportant && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Important
                  </span>
                )}
                {published && (
                  <span className="text-xs text-slate-500">{published}</span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{item.title}</h1>
              {item.summary && (
                <p className="mt-3 text-base text-slate-600">{item.summary}</p>
              )}
              {item.content && (
                <div className="prose prose-slate mt-6 max-w-none whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {item.content}
                </div>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </a>
                )}
                {item.externalLink && (
                  <a
                    href={item.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open link
                  </a>
                )}
              </div>
            </article>
          )}
        </Container>
      </section>
    </>
  );
}
