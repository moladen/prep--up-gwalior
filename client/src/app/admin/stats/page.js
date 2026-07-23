"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/admin/ConfirmModal";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

const emptyForm = {
  key: "",
  label: "",
  value: "0",
  suffix: "+",
  prefix: "",
  icon: "Users",
  sortOrder: "0",
  status: "Published",
};

export default function StatsAdminPage() {
  const { showToast } = useToast();
  const [stats, setStats] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getStats();
      setStats(data.stats || []);
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
    setForm(emptyForm);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      key: item.key || "",
      label: item.label || "",
      value: String(item.value ?? 0),
      suffix: item.suffix ?? "+",
      prefix: item.prefix || "",
      icon: item.icon || "Users",
      sortOrder: String(item.sortOrder ?? 0),
      status: item.status || "Published",
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        ...form,
        value: Number(form.value),
        sortOrder: Number(form.sortOrder),
      };
      if (editing) {
        await api.updateStat(editing._id || editing.id, body);
        showToast("Stat updated");
      } else {
        await api.createStat(body);
        showToast("Stat created");
      }
      setForm(emptyForm);
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
          <h1 className="text-2xl font-bold text-slate-900">Site Stats</h1>
          <p className="text-sm text-slate-500">Manage homepage counter statistics.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover"
        >
          <Plus className="h-4 w-4" />
          Add Stat
        </button>
      </div>

      <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">
          {editing ? "Edit Stat" : "New Stat"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["key", "Key"],
            ["label", "Label"],
            ["value", "Value"],
            ["prefix", "Prefix"],
            ["suffix", "Suffix"],
            ["icon", "Icon (lucide name)"],
            ["sortOrder", "Sort Order"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
              <input
                type={key === "value" || key === "sortOrder" ? "number" : "text"}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className={inputClass}
              />
            </div>
          ))}
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
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover disabled:opacity-60"
        >
          {saving ? "Saving..." : editing ? "Update Stat" : "Create Stat"}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : (
        <ul className="space-y-2">
          {stats.map((item) => (
            <li
              key={item._id || item.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">
                  {item.prefix}
                  {item.value}
                  {item.suffix} · Order: {item.sortOrder ?? 0} · {item.status}
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
        title="Delete stat?"
        message="This cannot be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          try {
            await api.deleteStat(deleteTarget._id || deleteTarget.id);
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
