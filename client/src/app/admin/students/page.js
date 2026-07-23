"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, KeyRound, UserCheck, UserX } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/admin/ConfirmModal";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  course: "",
  batch: "",
  status: "Active",
  courseIds: [],
};

function StudentsAdminInner() {
  const { showToast } = useToast();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, courseData] = await Promise.all([
        api.getStudents(q ? `q=${encodeURIComponent(q)}` : ""),
        api.getCourses("limit=200"),
      ]);
      setStudents(data.students || []);
      setCourses(courseData.courses || []);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [q, showToast]);

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
      name: item.name || "",
      email: item.email || "",
      phone: item.phone || "",
      password: "",
      course: item.course || "",
      batch: item.batch || "",
      status: item.status || "Active",
      courseIds: item.courseIds || (item.enrollments || []).map((e) => e.courseId),
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form };
      if (!body.password) delete body.password;
      if (editing) {
        await api.updateStudent(editing.id || editing._id, JSON.stringify(body));
        showToast("Student updated");
      } else {
        const data = await api.createStudent(JSON.stringify(body));
        showToast(
          data.tempPassword
            ? `Student created. Temp password: ${data.tempPassword}`
            : "Student created"
        );
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

  const toggleStatus = async (item) => {
    const next = item.status === "Active" ? "Inactive" : "Active";
    try {
      await api.updateStudentStatus(item.id || item._id, next);
      showToast(`Student ${next.toLowerCase()}`);
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const resetPassword = async (item) => {
    try {
      const data = await api.resetStudentPassword(item.id || item._id);
      showToast(
        data.tempPassword
          ? `Password reset to: ${data.tempPassword}`
          : "Password reset"
      );
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Students</h1>
          <p className="text-sm text-slate-500">
            Add, edit, activate, and reset student accounts.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover"
        >
          <Plus className="h-4 w-4" />
          Add Student
        </button>
      </div>

      <div className="flex gap-2">
        <input
          className={inputClass}
          placeholder="Search name, email, phone, ID..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          type="button"
          onClick={load}
          className="rounded-xl border border-slate-200 px-4 text-sm font-medium hover:bg-slate-50"
        >
          Search
        </button>
      </div>

      <form
        onSubmit={submit}
        className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <h2 className="sm:col-span-2 lg:col-span-3 text-sm font-semibold text-slate-700">
          {editing ? "Edit Student" : "New Student"}
        </h2>
        {["name", "email", "phone", "course", "batch", "password"].map((key) => (
          <input
            key={key}
            className={inputClass}
            type={key === "password" ? "password" : "text"}
            placeholder={
              key === "password"
                ? editing
                  ? "Leave blank to keep password"
                  : "Password (optional)"
                : key.charAt(0).toUpperCase() + key.slice(1)
            }
            required={key === "name" || key === "email"}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        ))}
        <select
          className={inputClass}
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Assign Courses
          </label>
          <div className="grid max-h-40 gap-2 overflow-y-auto rounded-xl border border-slate-200 p-3 sm:grid-cols-2">
            {courses.length === 0 ? (
              <p className="text-xs text-muted">No courses found.</p>
            ) : (
              courses.map((c) => {
                const checked = (form.courseIds || []).includes(c.id);
                return (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setForm((f) => {
                          const ids = new Set(f.courseIds || []);
                          if (ids.has(c.id)) ids.delete(c.id);
                          else ids.add(c.id);
                          return { ...f, courseIds: [...ids] };
                        });
                      }}
                    />
                    {c.name}
                  </label>
                );
              })
            )}
          </div>
        </div>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover disabled:opacity-60"
          >
            {saving ? "Saving..." : editing ? "Update" : "Create"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={openCreate}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Course / Batch</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id || s._id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.email}</p>
                    <p className="text-xs text-slate-400">
                      {s.phone} · {s.studentId}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {s.course || "—"}
                    <br />
                    <span className="text-xs text-slate-400">{s.batch || ""}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        s.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(s)}
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(s)}
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                        title="Activate/Deactivate"
                      >
                        {s.status === "Active" ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => resetPassword(s)}
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                        title="Reset password"
                      >
                        <KeyRound className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(s)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete student?"
        message={`Remove ${deleteTarget?.name}? This cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          try {
            await api.deleteStudent(deleteTarget.id || deleteTarget._id);
            showToast("Student deleted");
            setDeleteTarget(null);
            load();
          } catch (err) {
            showToast(err.message, "error");
          }
        }}
      />
    </div>
  );
}

export default function StudentsAdminPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading...</p>}>
      <StudentsAdminInner />
    </Suspense>
  );
}
