"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import TableSkeleton from "@/components/admin/TableSkeleton";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    address: "",
    phones: "",
    facebook: "",
    instagram: "",
  });
  /** Keep other contact fields so save doesn't wipe them */
  const [extras, setExtras] = useState({
    email: "",
    googleMapsLink: "",
    youtube: "",
    twitter: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getContactInfo()
      .then((data) => {
        const c = data.contact || {};
        setForm({
          address: c.address || "",
          phones: (c.phones || []).join(", "),
          facebook: c.social?.facebook || "",
          instagram: c.social?.instagram || "",
        });
        setExtras({
          email: c.email || "",
          googleMapsLink: c.googleMapsLink || "",
          youtube: c.social?.youtube || "",
          twitter: c.social?.twitter || "",
        });
      })
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateContactInfo({
        email: extras.email,
        googleMapsLink: extras.googleMapsLink,
        address: form.address,
        phones: form.phones
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
        social: {
          facebook: form.facebook,
          instagram: form.instagram,
          youtube: extras.youtube,
          twitter: extras.twitter,
        },
      });
      showToast("Settings saved successfully");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <TableSkeleton rows={4} cols={1} />;

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Contact &amp; Social</h2>
        <p className="mt-1 text-sm text-slate-500">
          These details show on the website footer, contact page, and news bar.
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Address</label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Institute address..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Phone Number{" "}
              <span className="font-normal text-slate-400">
                (comma separated for multiple)
              </span>
            </label>
            <input
              value={form.phones}
              onChange={(e) => setForm({ ...form, phones: e.target.value })}
              placeholder="7773090664, 8878868530"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Facebook URL</label>
            <input
              type="url"
              value={form.facebook}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
              placeholder="https://facebook.com/..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Instagram URL</label>
            <input
              type="url"
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              placeholder="https://instagram.com/..."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
