"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import TableSkeleton from "@/components/admin/TableSkeleton";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [websiteName, setWebsiteName] = useState("");
  const [footerContent, setFooterContent] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [enquiryLink, setEnquiryLink] = useState("");
  const [enquiryMode, setEnquiryMode] = useState("panel");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getSettings()
      .then((data) => {
        const s = data.settings || {};
        setWebsiteName(s.websiteName || "");
        setFooterContent(s.footerContent || "");
        setLogoUrl(s.logo?.url || "");
        setFaviconUrl(s.favicon?.url || "");
        setEnquiryLink(s.enquiryLink || "");
        setEnquiryMode(s.enquiryMode || "panel");
      })
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("websiteName", websiteName);
      fd.append("footerContent", footerContent);
      fd.append("enquiryLink", enquiryLink);
      fd.append("enquiryMode", enquiryMode);

      if (logoFile) {
        fd.append("imageField", "logo");
        fd.append("file", logoFile);
        await api.updateSettings(fd);
      }

      if (faviconFile) {
        const favFd = new FormData();
        favFd.append("websiteName", websiteName);
        favFd.append("footerContent", footerContent);
        favFd.append("enquiryLink", enquiryLink);
        favFd.append("enquiryMode", enquiryMode);
        favFd.append("imageField", "favicon");
        favFd.append("file", faviconFile);
        await api.updateSettings(favFd);
      }

      if (!logoFile && !faviconFile) {
        await api.updateSettings(fd);
      }

      const data = await api.getSettings();
      const s = data.settings || {};
      setLogoUrl(s.logo?.url || "");
      setFaviconUrl(s.favicon?.url || "");
      setLogoFile(null);
      setFaviconFile(null);
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
        <h2 className="text-lg font-bold text-slate-900">General Settings</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Website Name</label>
            <input
              required
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Footer Content</label>
            <textarea
              rows={4}
              value={footerContent}
              onChange={(e) => setFooterContent(e.target.value)}
              className={inputClass}
              placeholder="Copyright text or footer description..."
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Enquiry Settings</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Enquiry Mode</label>
            <select
              value={enquiryMode}
              onChange={(e) => setEnquiryMode(e.target.value)}
              className={inputClass}
            >
              <option value="panel">Panel (on-site form)</option>
              <option value="link">External link</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Enquiry Link</label>
            <input
              value={enquiryLink}
              onChange={(e) => setEnquiryLink(e.target.value)}
              className={inputClass}
              placeholder="https://forms.google.com/..."
            />
            <p className="mt-1 text-xs text-slate-500">
              Used when enquiry mode is set to external link.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Branding</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Logo</label>
            {(logoUrl || logoFile) && (
              <div className="mb-3 flex h-20 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2">
                {logoFile ? (
                  <img
                    src={URL.createObjectURL(logoFile)}
                    alt="Logo preview"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <Image
                    src={logoUrl}
                    alt="Current logo"
                    width={120}
                    height={60}
                    className="max-h-16 w-auto object-contain"
                  />
                )}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Favicon</label>
            {(faviconUrl || faviconFile) && (
              <div className="mb-3 flex h-20 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2">
                {faviconFile ? (
                  <img
                    src={URL.createObjectURL(faviconFile)}
                    alt="Favicon preview"
                    className="h-12 w-12 object-contain"
                  />
                ) : (
                  <Image
                    src={faviconUrl}
                    alt="Current favicon"
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                )}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFaviconFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
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
