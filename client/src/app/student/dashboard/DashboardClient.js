"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  BookOpen,
  ClipboardList,
  Download,
  ExternalLink,
  FileText,
  Play,
  Trophy,
  User,
} from "lucide-react";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { studentApi } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Empty({ message }) {
  return (
    <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-muted">
      {message}
    </p>
  );
}

function Card({ title, children, action }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-brand-primary">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function StudentDashboardClient() {
  const { student, loading, checkAuth, logout } = useStudentAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";
  const { showToast } = useToast();

  const [fetching, setFetching] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [tests, setTests] = useState([]);
  const [resultsData, setResultsData] = useState({ results: [], overview: {} });
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [photo, setPhoto] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!loading && !student) {
      router.replace("/student/login");
    }
  }, [student, loading, router]);

  const studentId = student?.id || student?._id;

  useEffect(() => {
    if (!studentId) return;
    let cancelled = false;
    setFetching(true);
    Promise.all([
      studentApi.getDashboard().catch(() => null),
      studentApi.getCourses().catch(() => ({ enrollments: [] })),
      studentApi.getMaterials().catch(() => ({ materials: [] })),
      studentApi.getTests().catch(() => ({ tests: [] })),
      studentApi.getResults().catch(() => ({ results: [], overview: {} })),
      studentApi.getNotifications().catch(() => ({ notifications: [] })),
    ])
      .then(([dash, c, m, t, r, n]) => {
        if (cancelled) return;
        setDashboard(dash?.dashboard || null);
        setCourses(c.enrollments || []);
        setMaterials(m.materials || []);
        setTests(t.tests || []);
        setResultsData({ results: r.results || [], overview: r.overview || {} });
        setNotifications(n.notifications || []);
      })
      .finally(() => {
        if (!cancelled) setFetching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  useEffect(() => {
    if (!student) return;
    setProfile({ name: student.name || "", phone: student.phone || "" });
  }, [student]);

  const materialsByCourse = useMemo(() => {
    const map = {};
    for (const m of materials) {
      const key = m.courseId || "General";
      if (!map[key]) map[key] = [];
      map[key].push(m);
    }
    return map;
  }, [materials]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (photo) {
        const fd = new FormData();
        fd.append("name", profile.name);
        fd.append("phone", profile.phone);
        fd.append("photo", photo);
        await studentApi.updateProfile(fd);
      } else {
        await studentApi.updateProfile(profile);
      }
      setPhoto(null);
      await checkAuth();
      showToast("Profile updated", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await studentApi.changePassword(passwords);
      setPasswords({ currentPassword: "", newPassword: "" });
      showToast("Password changed", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const startTest = async (test) => {
    try {
      const data = await studentApi.startTest(test.id);
      showToast("Test started", "success");
      if (data.externalUrl) {
        window.open(data.externalUrl, "_blank", "noopener,noreferrer");
      }
      const refreshed = await studentApi.getTests();
      setTests(refreshed.tests || []);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const openNotification = async (id) => {
    try {
      const data = await studentApi.getNotification(id);
      setSelectedNotification(data.notification);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (loading || !student) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
      </div>
    );
  }

  const stats = dashboard?.stats || {};
  const quickLinks = [
    { tab: "courses", label: "My Courses", icon: BookOpen, value: stats.courses ?? courses.length },
    { tab: "materials", label: "Materials", icon: FileText, value: stats.materials ?? materials.length },
    { tab: "tests", label: "Upcoming Tests", icon: ClipboardList, value: stats.upcomingTests ?? 0 },
    { tab: "results", label: "Results", icon: Trophy, value: stats.results ?? 0 },
  ];

  return (
    <div className="space-y-6">
      {tab === "dashboard" && (
        <>
          <div className="rounded-2xl border border-border bg-gradient-to-r from-[#14366f] via-[#1e4b9c] to-[#2a6bb5] p-6 text-white shadow-sm">
            <p className="text-sm text-white/80">Welcome back</p>
            <h1 className="mt-1 text-2xl font-extrabold">{student.name}</h1>
            <p className="mt-2 text-sm text-white/85">
              {student.course
                ? `Enrolled: ${student.course}`
                : "No course assigned yet — contact the institute."}
              {student.batch ? ` · Batch: ${student.batch}` : ""}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map(({ tab: t, label, icon: Icon, value }) => (
              <Link
                key={t}
                href={`/student/dashboard?tab=${t}`}
                className="rounded-2xl border border-border bg-white p-4 shadow-sm transition hover:border-brand-primary/30"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-brand-primary" />
                  <span className="text-2xl font-extrabold text-[var(--brand-navy)]">
                    {fetching ? "—" : value}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-600">{label}</p>
              </Link>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card
              title="Upcoming Tests"
              action={
                <Link href="/student/dashboard?tab=tests" className="text-xs font-semibold text-brand-primary">
                  View all
                </Link>
              }
            >
              {(dashboard?.upcomingTests || []).length === 0 ? (
                <Empty message="No upcoming tests right now." />
              ) : (
                <ul className="space-y-2">
                  {(dashboard?.upcomingTests || []).map((t) => (
                    <li
                      key={t.id}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                    >
                      <p className="text-sm font-semibold text-[var(--brand-navy)]">
                        {t.title}
                      </p>
                      <p className="text-xs text-muted">
                        {t.status} · {formatDate(t.testDate)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card
              title="Recent Results"
              action={
                <Link href="/student/dashboard?tab=results" className="text-xs font-semibold text-brand-primary">
                  View all
                </Link>
              }
            >
              {(dashboard?.recentResults || []).length === 0 ? (
                <Empty message="No results published yet." />
              ) : (
                <ul className="space-y-2">
                  {(dashboard?.recentResults || []).map((r) => (
                    <li
                      key={r.id}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                    >
                      <p className="text-sm font-semibold text-[var(--brand-navy)]">
                        {r.test?.title || "Test"}
                      </p>
                      <p className="text-xs text-muted">
                        Score: {r.score ?? "—"}
                        {r.maxScore ? ` / ${r.maxScore}` : ""}
                        {r.percentile != null ? ` · ${r.percentile}%ile` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card
              title="Latest Notifications"
              action={
                <Link
                  href="/student/dashboard?tab=notifications"
                  className="text-xs font-semibold text-brand-primary"
                >
                  View all
                </Link>
              }
            >
              {(dashboard?.notifications || []).length === 0 ? (
                <Empty message="No announcements." />
              ) : (
                <ul className="space-y-2">
                  {(dashboard?.notifications || []).slice(0, 4).map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => {
                          router.push("/student/dashboard?tab=notifications");
                          openNotification(n.id);
                        }}
                        className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-left hover:border-brand-primary/30"
                      >
                        <p className="text-sm font-semibold text-[var(--brand-navy)]">
                          {n.title}
                        </p>
                        <p className="text-xs text-muted">{formatDate(n.publishedAt)}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="Quick Access">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { tab: "materials", label: "Materials", icon: FileText },
                  { tab: "tests", label: "Tests", icon: ClipboardList },
                  { tab: "profile", label: "Profile", icon: User },
                  { tab: "notifications", label: "Alerts", icon: Bell },
                ].map(({ tab: t, label, icon: Icon }) => (
                  <Link
                    key={t}
                    href={`/student/dashboard?tab=${t}`}
                    className="flex items-center gap-2 rounded-xl border border-border px-3 py-3 text-sm font-medium text-slate-700 hover:bg-brand-primary-light hover:text-brand-primary"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === "courses" && (
        <Card title="My Courses">
          {courses.length === 0 ? (
            <Empty message="No courses enrolled yet. Ask admin to assign a course." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {courses.map((e) => (
                <article
                  key={e.id}
                  className="rounded-2xl border border-border bg-[#fafbfd] p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-primary">
                    {e.course?.category || "Course"}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-[var(--brand-navy)]">
                    {e.course?.name || e.courseName}
                  </h3>
                  {e.course?.tagline ? (
                    <p className="mt-1 text-sm text-muted">{e.course.tagline}</p>
                  ) : null}
                  <p className="mt-3 text-xs text-muted">
                    Enrolled {formatDate(e.enrolledAt)}
                  </p>
                  {e.course?.slug ? (
                    <Link
                      href={`/courses/${e.course.slug}`}
                      className="mt-3 inline-flex text-sm font-semibold text-brand-primary hover:underline"
                    >
                      View course content
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "materials" && (
        <Card title="Study Materials">
          {materials.length === 0 ? (
            <Empty message="No study materials available for your courses." />
          ) : (
            <div className="space-y-5">
              {Object.entries(materialsByCourse).map(([courseKey, list]) => (
                <div key={courseKey}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                    {courseKey === "General"
                      ? "General"
                      : list[0]?.category || "Course materials"}
                    {list[0]?.subject ? ` · ${list[0].subject}` : ""}
                  </p>
                  <ul className="space-y-2">
                    {list.map((m) => {
                      const url = m.file?.url || m.externalLink;
                      return (
                        <li
                          key={m.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-3 py-3"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-[var(--brand-navy)]">
                              {m.title}
                            </p>
                            <p className="text-xs text-muted">
                              {m.materialType || m.category || "Resource"}
                              {m.subject ? ` · ${m.subject}` : ""}
                            </p>
                          </div>
                          {url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white"
                            >
                              {m.externalLink && !m.file?.url ? (
                                <ExternalLink className="h-3.5 w-3.5" />
                              ) : (
                                <Download className="h-3.5 w-3.5" />
                              )}
                              Open
                            </a>
                          ) : (
                            <span className="text-xs text-muted">Unavailable</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "tests" && (
        <Card title="Mock Tests / My Tests">
          {tests.length === 0 ? (
            <Empty message="No tests assigned yet." />
          ) : (
            <ul className="space-y-3">
              {tests.map((t) => {
                const canStart =
                  t.status === "Available" || t.status === "Ongoing";
                return (
                  <li
                    key={t.id}
                    className="rounded-2xl border border-border bg-[#fafbfd] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-[var(--brand-navy)]">
                          {t.title}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {t.courseName || "All courses"} · {formatDate(t.testDate)} ·{" "}
                          {t.durationMin} min · {t.totalMarks} marks
                        </p>
                        <p className="mt-2 text-xs font-semibold text-brand-primary">
                          Status: {t.status}
                          {t.myResult
                            ? ` · Your status: ${t.myResult.status}`
                            : ""}
                        </p>
                      </div>
                      {canStart ? (
                        <button
                          type="button"
                          onClick={() => startTest(t)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
                        >
                          <Play className="h-4 w-4" />
                          Start Test
                        </button>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          {t.status}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      )}

      {tab === "results" && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Completed",
                value: resultsData.overview?.completed ?? 0,
              },
              {
                label: "Average Score",
                value: resultsData.overview?.averageScore ?? "—",
              },
              {
                label: "Best Percentile",
                value:
                  resultsData.overview?.bestPercentile != null
                    ? resultsData.overview.bestPercentile
                    : "—",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {s.label}
                </p>
                <p className="mt-1 text-2xl font-extrabold text-[var(--brand-navy)]">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
          <Card title="Results & Performance">
            {resultsData.results.length === 0 ? (
              <Empty message="No test results yet." />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="py-2 pr-3">Test</th>
                      <th className="py-2 pr-3">Score</th>
                      <th className="py-2 pr-3">Rank</th>
                      <th className="py-2 pr-3">%ile</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsData.results.map((r) => (
                      <tr key={r.id} className="border-b border-slate-100">
                        <td className="py-2.5 pr-3 font-medium text-[var(--brand-navy)]">
                          {r.test?.title || "Test"}
                        </td>
                        <td className="py-2.5 pr-3">
                          {r.score ?? "—"}
                          {r.maxScore ? ` / ${r.maxScore}` : ""}
                        </td>
                        <td className="py-2.5 pr-3">{r.rank ?? "—"}</td>
                        <td className="py-2.5 pr-3">
                          {r.percentile != null ? r.percentile : "—"}
                        </td>
                        <td className="py-2.5">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {tab === "notifications" && (
        <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <Card title="Notifications">
            {notifications.length === 0 ? (
              <Empty message="No notifications." />
            ) : (
              <ul className="space-y-2">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => openNotification(n.id)}
                      className="w-full rounded-xl border border-border px-3 py-3 text-left hover:border-brand-primary/30"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-[var(--brand-navy)]">
                          {n.title}
                        </p>
                        {n.isImportant ? (
                          <span className="rounded bg-brand-primary px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                            New
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {n.category || "General"} · {formatDate(n.publishedAt)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Details">
            {!selectedNotification ? (
              <Empty message="Select a notification to read." />
            ) : (
              <article>
                <h3 className="text-lg font-bold text-[var(--brand-navy)]">
                  {selectedNotification.title}
                </h3>
                <p className="mt-1 text-xs text-muted">
                  {selectedNotification.category} ·{" "}
                  {formatDate(selectedNotification.publishedAt)}
                </p>
                {selectedNotification.summary ? (
                  <p className="mt-3 text-sm text-slate-700">
                    {selectedNotification.summary}
                  </p>
                ) : null}
                {selectedNotification.content ? (
                  <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">
                    {selectedNotification.content}
                  </p>
                ) : null}
                {selectedNotification.pdf?.url ? (
                  <a
                    href={selectedNotification.pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-primary"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                ) : null}
                {selectedNotification.externalLink ? (
                  <a
                    href={selectedNotification.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-1 text-sm font-semibold text-brand-primary"
                  >
                    <ExternalLink className="h-4 w-4" /> Open link
                  </a>
                ) : null}
              </article>
            )}
          </Card>
        </div>
      )}

      {tab === "profile" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card title="My Profile">
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-brand-primary-light">
                  {student.profilePhotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={student.profilePhotoUrl}
                      alt={student.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xl font-bold text-brand-primary">
                      {student.name?.charAt(0) || "S"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-[var(--brand-navy)]">{student.name}</p>
                  <p className="text-xs text-muted">ID: {student.studentId}</p>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  className="input-premium"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  className="input-premium bg-slate-50"
                  value={student.email}
                  disabled
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Phone</label>
                <input
                  className="input-premium"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, phone: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Enrolled Course
                </label>
                <input
                  className="input-premium bg-slate-50"
                  value={student.course || "Not assigned"}
                  disabled
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="block w-full text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </Card>

          <Card title="Account Security">
            <form onSubmit={savePassword} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Current Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-premium"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords((p) => ({
                      ...p,
                      currentPassword: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-premium"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords((p) => ({
                      ...p,
                      newPassword: e.target.value,
                    }))
                  }
                  required
                  minLength={6}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                Show passwords
              </label>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={logout}
                className="ml-2 rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
