"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Pagination from "@/components/admin/Pagination";
import EmptyState from "@/components/admin/EmptyState";
import TableSkeleton from "@/components/admin/TableSkeleton";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

const emptyForm = {
  studentName: "",
  exam: "",
  score: "",
  year: "",
  status: "Published",
};

export default function ResultsPage() {
  const { showToast } = useToast();
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchResults = useCallback(
    async (page = 1, q = search) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit: 10 });
        if (q) params.set("search", q);
        const data = await api.getResults(params.toString());
        setResults(data.results || []);
        setPagination(data.pagination || { page: 1, pages: 1 });
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    },
    [search, showToast]
  );

  useEffect(() => {
    const timer = setTimeout(() => fetchResults(1), 300);
    return () => clearTimeout(timer);
  }, [search, fetchResults]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImage(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      studentName: item.studentName || "",
      exam: item.exam || "",
      score: item.score || "",
      year: item.year || "",
      status: item.status || "Published",
    });
    setImage(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);

      if (editing) {
        await api.updateResult(editing._id, fd);
        showToast("Result updated successfully");
      } else {
        await api.createResult(fd);
        showToast("Result created successfully");
      }
      setModalOpen(false);
      fetchResults(pagination.page);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteResult(deleteTarget._id);
      showToast("Result deleted");
      setDeleteTarget(null);
      fetchResults(pagination.page);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search by student or exam..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-10`}
          />
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover"
        >
          <Plus className="h-4 w-4" />
          Add Result
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-5">
            <TableSkeleton rows={5} cols={6} />
          </div>
        ) : results.length === 0 ? (
          <EmptyState title="No results found" description="Add student results to showcase achievements." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-700">Student</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Exam</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Score</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Year</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Status</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {item.image?.url && (
                          <Image
                            src={item.image.url}
                            alt={item.studentName}
                            width={36}
                            height={36}
                            className="h-9 w-9 rounded-lg object-cover"
                          />
                        )}
                        <span className="font-medium text-slate-900">{item.studentName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{item.exam}</td>
                    <td className="px-5 py-3 text-slate-600">{item.score || "—"}</td>
                    <td className="px-5 py-3 text-slate-600">{item.year || "—"}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-brand-primary"
                          aria-label="Edit result"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="rounded-lg p-2 text-slate-600 hover:bg-brand-primary-light hover:text-brand-primary"
                          aria-label="Delete result"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && results.length > 0 && (
          <div className="border-t border-slate-200 p-4">
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              onPageChange={(p) => fetchResults(p)}
            />
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editing ? "Edit Result" : "Add Result"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-sm text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Student Name</label>
                <input
                  required
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Exam</label>
                <input
                  required
                  value={form.exam}
                  onChange={(e) => setForm({ ...form, exam: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Score</label>
                  <input
                    value={form.score}
                    onChange={(e) => setForm({ ...form, score: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Year</label>
                  <input
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className={inputClass}
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Photo</label>
                {editing?.image?.url && !image && (
                  <Image
                    src={editing.image.url}
                    alt="Current"
                    width={64}
                    height={64}
                    className="mb-2 h-16 w-16 rounded-lg object-cover"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="w-full text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Result"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Result"
        message={`Delete result for "${deleteTarget?.studentName}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
