"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/admin/ConfirmModal";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

function SimpleList({ title, items, fields, onSave, onDelete, emptyForm }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await onSave(editing._id || editing.id, form, true);
        showToast(`${title} updated`);
      } else {
        await onSave(null, form, false);
        showToast(`${title} created`);
      }
      setForm(emptyForm);
      setEditing(null);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-lg font-bold text-slate-900">{title}</h3>
      <form onSubmit={submit} className="mb-6 grid gap-3 sm:grid-cols-2">
        {fields.map(({ key, label, type = "text", span = 1 }) => (
          <div key={key} className={span === 2 ? "sm:col-span-2" : ""}>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              {label}
            </label>
            {type === "textarea" ? (
              <textarea
                rows={3}
                value={form[key] || ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className={inputClass}
              />
            ) : (
              <input
                type={type}
                value={form[key] || ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className={inputClass}
              />
            )}
          </div>
        ))}
        <div className="flex gap-2 sm:col-span-2">
          <button type="submit" className="btn-primary px-4 py-2 text-sm">
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(emptyForm);
              }}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 p-3"
          >
            <button
              type="button"
              onClick={() => {
                setEditing(item);
                setForm(
                  fields.reduce(
                    (acc, { key }) => ({ ...acc, [key]: item[key] ?? "" }),
                    {}
                  )
                );
              }}
              className="min-w-0 flex-1 text-left text-sm text-slate-700 hover:text-brand-primary"
            >
              {item.message || item.label || item.question || item.title || item.name}
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(item)}
              className="text-slate-400 hover:text-red-600"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete item?"
        message="This action cannot be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          try {
            await onDelete(deleteTarget._id || deleteTarget.id);
            showToast("Deleted");
          } catch (err) {
            showToast(err.message, "error");
          } finally {
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

export default function MarketingAdminPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [heroHighlights, setHeroHighlights] = useState([]);

  const load = useCallback(async () => {
    const [a, h] = await Promise.all([
      api.getAnnouncements(),
      api.getHeroHighlights(),
    ]);
    setAnnouncements(a.announcements || []);
    setHeroHighlights(h.heroHighlights || []);
  }, []);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Marketing</h1>
        <p className="text-sm text-slate-500">
          Manage announcements and auto-changing hero highlights.
        </p>
      </div>

      <SimpleList
        title="Announcements"
        items={announcements}
        emptyForm={{ message: "", link: "", linkText: "Learn More", status: "Published" }}
        fields={[
          { key: "message", label: "Message", span: 2 },
          { key: "link", label: "Link URL" },
          { key: "linkText", label: "Link Text" },
        ]}
        onSave={async (id, form, isEdit) => {
          if (isEdit) await api.updateAnnouncement(id, form);
          else await api.createAnnouncement(form);
          await load();
        }}
        onDelete={async (id) => {
          await api.deleteAnnouncement(id);
          await load();
        }}
      />

      <SimpleList
        title="Hero Highlights"
        items={heroHighlights}
        emptyForm={{
          label: "",
          description: "",
          link: "",
          section: "",
          status: "Published",
        }}
        fields={[
          { key: "label", label: "Label" },
          { key: "section", label: "Section ID (ug, pg, govt-jobs)" },
          { key: "description", label: "Description", span: 2 },
          { key: "link", label: "Link URL", span: 2 },
        ]}
        onSave={async (id, form, isEdit) => {
          if (isEdit) await api.updateHeroHighlight(id, form);
          else await api.createHeroHighlight(form);
          await load();
        }}
        onDelete={async (id) => {
          await api.deleteHeroHighlight(id);
          await load();
        }}
      />
    </div>
  );
}
