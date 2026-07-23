"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle, Search, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Pagination from "@/components/admin/Pagination";
import EmptyState from "@/components/admin/EmptyState";
import TableSkeleton from "@/components/admin/TableSkeleton";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

export default function EnquiriesPage() {
  const { showToast } = useToast();
  const [enquiries, setEnquiries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchEnquiries = useCallback(
    async (page = 1, q = search) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit: 10 });
        if (q) params.set("search", q);
        const data = await api.getEnquiries(params.toString());
        setEnquiries(data.enquiries || []);
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
    const timer = setTimeout(() => fetchEnquiries(1), 300);
    return () => clearTimeout(timer);
  }, [search, fetchEnquiries]);

  const markContacted = async (id) => {
    setUpdatingId(id);
    try {
      await api.updateEnquiryStatus(id, "Contacted");
      showToast("Marked as contacted");
      fetchEnquiries(pagination.page);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteEnquiry(deleteTarget._id);
      showToast("Enquiry deleted");
      setDeleteTarget(null);
      fetchEnquiries(pagination.page);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search enquiries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} pl-10`}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-5">
            <TableSkeleton rows={5} cols={6} />
          </div>
        ) : enquiries.length === 0 ? (
          <EmptyState title="No enquiries found" description="New form submissions will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-700">Name</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Contact</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Course</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Message</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Status</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-5 py-3 text-slate-600">
                      <div>{item.email}</div>
                      <div className="text-xs text-slate-500">{item.phone}</div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{item.course || "—"}</td>
                    <td className="max-w-xs truncate px-5 py-3 text-slate-600">
                      {item.message || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.status === "Contacted"
                            ? "bg-green-100 text-green-700"
                            : "bg-brand-primary-light text-brand-primary"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        {item.status !== "Contacted" && (
                          <button
                            type="button"
                            onClick={() => markContacted(item._id)}
                            disabled={updatingId === item._id}
                            className="inline-flex items-center gap-1 rounded-lg bg-brand-primary-light px-3 py-1.5 text-xs font-medium text-brand-primary hover:bg-brand-primary-light disabled:opacity-60"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            {updatingId === item._id ? "..." : "Contacted"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="rounded-lg p-2 text-slate-600 hover:bg-brand-primary-light hover:text-brand-primary"
                          aria-label="Delete enquiry"
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
        {!loading && enquiries.length > 0 && (
          <div className="border-t border-slate-200 p-4">
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              onPageChange={(p) => fetchEnquiries(p)}
            />
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Enquiry"
        message={`Delete enquiry from "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
