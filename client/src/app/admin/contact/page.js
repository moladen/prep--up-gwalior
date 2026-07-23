"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import TableSkeleton from "@/components/admin/TableSkeleton";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

const emptyContact = {
  email: "",
  phones: "",
  address: "",
  googleMapsLink: "",
  social: {
    facebook: "",
    instagram: "",
    youtube: "",
    twitter: "",
  },
};

export default function ContactPage() {
  const { showToast } = useToast();
  const [contact, setContact] = useState(emptyContact);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getContactInfo()
      .then((data) => {
        const c = data.contact || {};
        setContact({
          email: c.email || "",
          phones: (c.phones || []).join(", "),
          address: c.address || "",
          googleMapsLink: c.googleMapsLink || "",
          social: {
            facebook: c.social?.facebook || "",
            instagram: c.social?.instagram || "",
            youtube: c.social?.youtube || "",
            twitter: c.social?.twitter || "",
          },
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
        email: contact.email,
        phones: contact.phones
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
        address: contact.address,
        googleMapsLink: contact.googleMapsLink,
        social: contact.social,
      });
      showToast("Contact info saved successfully");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <TableSkeleton rows={6} cols={1} />;

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Contact Details</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Phone Numbers <span className="text-slate-400">(comma separated)</span>
            </label>
            <input
              value={contact.phones}
              onChange={(e) => setContact({ ...contact, phones: e.target.value })}
              placeholder="7773090664, 8878868530"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Address</label>
            <textarea
              rows={3}
              value={contact.address}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Google Maps Link</label>
            <input
              type="url"
              value={contact.googleMapsLink}
              onChange={(e) => setContact({ ...contact, googleMapsLink: e.target.value })}
              placeholder="https://maps.google.com/..."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Social Links</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { key: "facebook", label: "Facebook" },
            { key: "instagram", label: "Instagram" },
            { key: "youtube", label: "YouTube" },
            { key: "twitter", label: "Twitter / X" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="mb-1 block text-sm font-medium">{label}</label>
              <input
                type="url"
                value={contact.social[key]}
                onChange={(e) =>
                  setContact({
                    ...contact,
                    social: { ...contact.social, [key]: e.target.value },
                  })
                }
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Contact Info"}
      </button>
    </form>
  );
}
