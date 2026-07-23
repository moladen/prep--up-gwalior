"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import TableSkeleton from "@/components/admin/TableSkeleton";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

const emptyContent = {
  about: { title: "", paragraphs: [""] },
  vision: { title: "", text: "" },
  mission: { title: "", items: [""] },
  whyChooseUs: { title: "", items: [""] },
  siteInfo: { name: "", description: "" },
};

function ListEditor({ label, items, onChange, multiline = false }) {
  const Field = multiline ? "textarea" : "input";
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Field
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              rows={multiline ? 3 : undefined}
              className={inputClass}
              placeholder={`Item ${i + 1}`}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="shrink-0 rounded-xl border border-slate-200 px-3 text-sm text-slate-600 hover:bg-brand-primary-light hover:text-brand-primary"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="text-sm font-medium text-brand-primary hover:text-brand-primary-hover"
        >
          + Add item
        </button>
      </div>
    </div>
  );
}

export default function ContentPage() {
  const { showToast } = useToast();
  const [content, setContent] = useState(emptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getContent()
      .then((data) => {
        const c = data.content || {};
        setContent({
          about: {
            title: c.about?.title || "",
            paragraphs: c.about?.paragraphs?.length ? c.about.paragraphs : [""],
          },
          vision: {
            title: c.vision?.title || "",
            text: c.vision?.text || "",
          },
          mission: {
            title: c.mission?.title || "",
            items: c.mission?.items?.length ? c.mission.items : [""],
          },
          whyChooseUs: {
            title: c.whyChooseUs?.title || "",
            items: c.whyChooseUs?.items?.length ? c.whyChooseUs.items : [""],
          },
          siteInfo: {
            name: c.siteInfo?.name || "",
            description: c.siteInfo?.description || "",
          },
        });
      })
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        about: {
          title: content.about.title,
          paragraphs: content.about.paragraphs.filter(Boolean),
        },
        vision: content.vision,
        mission: {
          title: content.mission.title,
          items: content.mission.items.filter(Boolean),
        },
        whyChooseUs: {
          title: content.whyChooseUs.title,
          items: content.whyChooseUs.items.filter(Boolean),
        },
        siteInfo: content.siteInfo,
      };
      await api.updateContent(payload);
      showToast("Content saved successfully");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <TableSkeleton rows={6} cols={1} />;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Site Info</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Website Name</label>
            <input
              value={content.siteInfo.name}
              onChange={(e) =>
                setContent((p) => ({
                  ...p,
                  siteInfo: { ...p.siteInfo, name: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              rows={3}
              value={content.siteInfo.description}
              onChange={(e) =>
                setContent((p) => ({
                  ...p,
                  siteInfo: { ...p.siteInfo, description: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">About</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              value={content.about.title}
              onChange={(e) =>
                setContent((p) => ({
                  ...p,
                  about: { ...p.about, title: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
          <ListEditor
            label="Paragraphs"
            multiline
            items={content.about.paragraphs}
            onChange={(paragraphs) =>
              setContent((p) => ({ ...p, about: { ...p.about, paragraphs } }))
            }
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Vision</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              value={content.vision.title}
              onChange={(e) =>
                setContent((p) => ({
                  ...p,
                  vision: { ...p.vision, title: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Text</label>
            <textarea
              rows={4}
              value={content.vision.text}
              onChange={(e) =>
                setContent((p) => ({
                  ...p,
                  vision: { ...p.vision, text: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Mission</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              value={content.mission.title}
              onChange={(e) =>
                setContent((p) => ({
                  ...p,
                  mission: { ...p.mission, title: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
          <ListEditor
            label="Mission Items"
            items={content.mission.items}
            onChange={(items) =>
              setContent((p) => ({ ...p, mission: { ...p.mission, items } }))
            }
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Why Choose Us</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              value={content.whyChooseUs.title}
              onChange={(e) =>
                setContent((p) => ({
                  ...p,
                  whyChooseUs: { ...p.whyChooseUs, title: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
          <ListEditor
            label="Items"
            items={content.whyChooseUs.items}
            onChange={(items) =>
              setContent((p) => ({ ...p, whyChooseUs: { ...p.whyChooseUs, items } }))
            }
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Content"}
      </button>
    </form>
  );
}
