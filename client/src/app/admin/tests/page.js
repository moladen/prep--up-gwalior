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
  description: "",
  courseId: "",
  testDate: "",
  durationMin: "60",
  totalMarks: "100",
  status: "Upcoming",
  externalUrl: "",
};

const resultFormEmpty = {
  studentId: "",
  score: "",
  maxScore: "",
  rank: "",
  percentile: "",
  status: "Completed",
  remarks: "",
};

export default function AdminMockTestsPage() {
  const { showToast } = useToast();
  const [tests, setTests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resultTest, setResultTest] = useState(null);
  const [results, setResults] = useState([]);
  const [resultForm, setResultForm] = useState(resultFormEmpty);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, c, s] = await Promise.all([
        api.getMockTests(),
        api.getCourses("status=Published&limit=200"),
        api.getStudents(""),
      ]);
      setTests(t.tests || []);
      setCourses(c.courses || c || []);
      setStudents(s.students || []);
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
      title: item.title || "",
      description: item.description || "",
      courseId: item.courseId || "",
      testDate: item.testDate
        ? new Date(item.testDate).toISOString().slice(0, 16)
        : "",
      durationMin: String(item.durationMin || 60),
      totalMarks: String(item.totalMarks || 100),
      status: item.status || "Upcoming",
      externalUrl: item.externalUrl || "",
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        ...form,
        durationMin: Number(form.durationMin),
        totalMarks: Number(form.totalMarks),
      };
      if (editing) {
        await api.updateMockTest(editing.id, body);
        showToast("Test updated");
      } else {
        await api.createMockTest(body);
        showToast("Test created");
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

  const openResults = async (test) => {
    setResultTest(test);
    setResultForm({ ...resultFormEmpty, maxScore: String(test.totalMarks || 100) });
    try {
      const data = await api.getMockTestResults(test.id);
      setResults(data.results || []);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const saveResult = async (e) => {
    e.preventDefault();
    if (!resultTest) return;
    setSaving(true);
    try {
      await api.upsertMockTestResult(resultTest.id, {
        studentId: resultForm.studentId,
        score: resultForm.score === "" ? null : Number(resultForm.score),
        maxScore:
          resultForm.maxScore === "" ? null : Number(resultForm.maxScore),
        rank: resultForm.rank === "" ? null : Number(resultForm.rank),
        percentile:
          resultForm.percentile === ""
            ? null
            : Number(resultForm.percentile),
        status: resultForm.status,
        remarks: resultForm.remarks,
      });
      showToast("Result saved");
      openResults(resultTest);
      setResultForm({
        ...resultFormEmpty,
        maxScore: String(resultTest.totalMarks || 100),
      });
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--brand-navy)]">
            Mock Tests
          </h1>
          <p className="text-sm text-muted">
            Create tests and publish student scores
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> New Test
        </button>
      </div>

      <form
        onSubmit={submit}
        className="grid gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm sm:grid-cols-2"
      >
        <input
          className={inputClass}
          placeholder="Test title"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <select
          className={inputClass}
          value={form.courseId}
          onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
        >
          <option value="">All enrolled students</option>
          {(Array.isArray(courses) ? courses : []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          className={`${inputClass} sm:col-span-2`}
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
        <input
          type="datetime-local"
          className={inputClass}
          value={form.testDate}
          onChange={(e) => setForm((f) => ({ ...f, testDate: e.target.value }))}
        />
        <select
          className={inputClass}
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
        >
          {["Draft", "Upcoming", "Available", "Ongoing", "Closed"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          className={inputClass}
          placeholder="Duration (min)"
          value={form.durationMin}
          onChange={(e) =>
            setForm((f) => ({ ...f, durationMin: e.target.value }))
          }
        />
        <input
          className={inputClass}
          placeholder="Total marks"
          value={form.totalMarks}
          onChange={(e) =>
            setForm((f) => ({ ...f, totalMarks: e.target.value }))
          }
        />
        <input
          className={`${inputClass} sm:col-span-2`}
          placeholder="External test URL (optional)"
          value={form.externalUrl}
          onChange={(e) =>
            setForm((f) => ({ ...f, externalUrl: e.target.value }))
          }
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-2"
        >
          {editing ? "Update Test" : "Create Test"}
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-muted">Loading...</p>
        ) : tests.length === 0 ? (
          <p className="p-6 text-sm text-muted">No tests yet.</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Results</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{t.title}</td>
                  <td className="px-4 py-3 text-muted">
                    {t.testDate
                      ? new Date(t.testDate).toLocaleString("en-IN")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{t.status}</td>
                  <td className="px-4 py-3">{t.resultsCount ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(t)}
                        className="rounded-lg border px-2 py-1 text-xs"
                      >
                        <Pencil className="inline h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => openResults(t)}
                        className="rounded-lg border px-2 py-1 text-xs text-brand-primary"
                      >
                        Scores
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(t)}
                        className="rounded-lg border px-2 py-1 text-xs text-red-600"
                      >
                        <Trash2 className="inline h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {resultTest ? (
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-[var(--brand-navy)]">
              Results — {resultTest.title}
            </h2>
            <button
              type="button"
              className="text-sm text-muted"
              onClick={() => setResultTest(null)}
            >
              Close
            </button>
          </div>
          <form
            onSubmit={saveResult}
            className="mb-4 grid gap-3 sm:grid-cols-3"
          >
            <select
              required
              className={inputClass}
              value={resultForm.studentId}
              onChange={(e) =>
                setResultForm((f) => ({ ...f, studentId: e.target.value }))
              }
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
            <input
              className={inputClass}
              placeholder="Score"
              value={resultForm.score}
              onChange={(e) =>
                setResultForm((f) => ({ ...f, score: e.target.value }))
              }
            />
            <input
              className={inputClass}
              placeholder="Max score"
              value={resultForm.maxScore}
              onChange={(e) =>
                setResultForm((f) => ({ ...f, maxScore: e.target.value }))
              }
            />
            <input
              className={inputClass}
              placeholder="Rank"
              value={resultForm.rank}
              onChange={(e) =>
                setResultForm((f) => ({ ...f, rank: e.target.value }))
              }
            />
            <input
              className={inputClass}
              placeholder="Percentile"
              value={resultForm.percentile}
              onChange={(e) =>
                setResultForm((f) => ({ ...f, percentile: e.target.value }))
              }
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Save Result
            </button>
          </form>
          <ul className="space-y-2 text-sm">
            {results.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-slate-100 px-3 py-2"
              >
                <span className="font-semibold">
                  {r.student?.name || "Student"}
                </span>{" "}
                — Score {r.score ?? "—"}/{r.maxScore ?? "—"} · Rank{" "}
                {r.rank ?? "—"} · {r.percentile ?? "—"}%ile
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete test?"
        message={`Delete "${deleteTarget?.title}" and all its results?`}
        onConfirm={async () => {
          try {
            await api.deleteMockTest(deleteTarget.id);
            showToast("Test deleted");
            setDeleteTarget(null);
            load();
          } catch (err) {
            showToast(err.message, "error");
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
