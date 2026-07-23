"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/admin/ConfirmModal";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

export default function SeoAdminPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    homeTitle: "",
    homeDescription: "",
    homeKeywords: "",
    ogImageUrl: "",
    googleRating: 4.8,
    googleReviewCount: 0,
    googlePlaceId: "",
    googleReviewsUrl: "",
    googleEmbedHtml: "",
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await api.getSeo();
    if (data.seo) setForm({ ...form, ...data.seo });
  }, []);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSeo(form);
      showToast("SEO settings saved");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">SEO & Reviews</h1>
        <p className="text-sm text-slate-500">Manage homepage SEO and Google review summary.</p>
      </div>
      <form onSubmit={save} className="max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        {[
          ["homeTitle", "Homepage Title"],
          ["homeDescription", "Homepage Description", "textarea"],
          ["homeKeywords", "Keywords"],
          ["ogImageUrl", "OG Image URL"],
          ["googlePlaceId", "Google Place ID"],
          ["googleReviewsUrl", "Google Reviews URL"],
          ["googleEmbedHtml", "Google Embed HTML", "textarea"],
        ].map(([key, label, type]) => (
          <div key={key}>
            <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
            {type === "textarea" ? (
              <textarea
                rows={3}
                value={form[key] || ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className={inputClass}
              />
            ) : (
              <input
                value={form[key] || ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className={inputClass}
              />
            )}
          </div>
        ))}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Google Rating</label>
            <input
              type="number"
              step="0.1"
              value={form.googleRating}
              onChange={(e) => setForm({ ...form, googleRating: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Review Count</label>
            <input
              type="number"
              value={form.googleReviewCount}
              onChange={(e) => setForm({ ...form, googleReviewCount: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary px-5 py-2.5 text-sm">
          {saving ? "Saving..." : "Save SEO Settings"}
        </button>
      </form>
    </div>
  );
}
