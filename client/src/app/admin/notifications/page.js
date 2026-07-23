"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/admin/ConfirmModal";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

const emptyForm = {
  title: "",
  category: "General",
  summary: "",
  content: "",
  externalLink: "",
  isImportant: false,
  publishedAt: "",
  sortOrder: "0",
  status: "Published",
};

function toDatetimeLocal(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function NotificationsAdminPage() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [pdf, setPdf] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications("limit=100");
      setNotifications(data.notifications || []);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, publishedAt: toDatetimeLocal(new Date()) });
    setPdf(null);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || "",
      category: item.category || "General",
      summary: item.summary || "",
      content: item.content || "",
      externalLink: item.externalLink || "",
      isImportant: Boolean(item.isImportant),
      publishedAt: toDatetimeLocal(item.publishedAt),
      sortOrder: String(item.sortOrder ?? 0),
      status: item.status || "Published",
    });
    setPdf(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "isImportant") {
          fd.append(k, v ? "true" : "false");
        } else {
          fd.append(k, v);
        }
      });
      if (pdf) fd.append("pdf", pdf);

      if (editing) {
        await api.updateNotification(editing._id || editing.id, fd);
        showToast("Notification updated");
      } else {
        await api.createNotification(fd);
        showToast("Notification created");
      }
      setForm(emptyForm);
      setPdf(null);
      setEditing(null);
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">Manage announcements and notices.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover"
        >
          <Plus className="h-4 w-4" />
          Add Notification
        </button>
      </div>

      <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">
          {editing ? "Edit Notification" : "New Notification"}
        </h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Published At</label>
            <input
              type="datetime-local"
              value={form.publishedAt}
              onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Summary</label>
          <textarea
            rows={2}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Content</label>
          <textarea
            rows={4}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">External Link</label>
          <input
            value={form.externalLink}
            onChange={(e) => setForm({ ...form, externalLink: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Sort Order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={inputClass}
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={form.isImportant}
            onChange={(e) => setForm({ ...form, isImportant: e.target.checked })}
            className="rounded border-slate-300"
          />
          Mark as important
        </label>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">PDF (optional)</label>
          {editing?.pdf?.url && !pdf && (
            <a
              href={editing.pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 block text-sm text-brand-primary hover:underline"
            >
              View current PDF
            </a>
          )}
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => setPdf(e.target.files?.[0] || null)}
            className="w-full text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover disabled:opacity-60"
        >
          {saving ? "Saving..." : editing ? "Update Notification" : "Create Notification"}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((item) => (
            <li
              key={item._id || item.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {item.title}
                  {item.isImportant && (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                      Important
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  {item.category} · {item.status}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-brand-primary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="rounded-lg p-2 text-slate-600 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete notification?"
        message="This cannot be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          try {
            await api.deleteNotification(deleteTarget._id || deleteTarget.id);
            showToast("Deleted");
            load();
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
