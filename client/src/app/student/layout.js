"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Bell,
  BookOpen,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Trophy,
  User,
} from "lucide-react";
import { useStudentAuth } from "@/context/StudentAuthContext";
import BrandMark from "@/components/ui/BrandMark";

const nav = [
  { href: "/student/dashboard", tab: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/dashboard?tab=courses", tab: "courses", label: "My Courses", icon: BookOpen },
  { href: "/student/dashboard?tab=materials", tab: "materials", label: "Study Materials", icon: FileText },
  { href: "/student/dashboard?tab=tests", tab: "tests", label: "My Tests", icon: ClipboardList },
  { href: "/student/dashboard?tab=results", tab: "results", label: "Results", icon: Trophy },
  {
    href: "/student/dashboard?tab=notifications",
    tab: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  { href: "/student/dashboard?tab=profile", tab: "profile", label: "My Profile", icon: User },
];

function PortalChrome({ children }) {
  const { student, logout } = useStudentAuth();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <BrandMark className="h-9 w-9" />
            <div>
              <p className="text-sm font-bold text-brand-primary">Prep Up</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Student Portal
              </p>
            </div>
          </Link>
          {student ? (
            <div className="flex items-center gap-3">
              <p className="hidden text-sm text-slate-600 sm:block">
                Hi,{" "}
                <span className="font-semibold text-primary-dark">
                  {student.name}
                </span>
              </p>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl border border-brand-primary/20 px-3 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary-light"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr]">
        {student ? (
          <aside className="h-fit rounded-2xl border border-border bg-white p-3 shadow-sm">
            <nav className="space-y-1">
              {nav.map(({ href, tab, label, icon: Icon }) => {
                const active =
                  tab === "dashboard"
                    ? activeTab === "dashboard"
                    : activeTab === tab;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-brand-primary-light text-brand-primary"
                        : "text-slate-600 hover:bg-brand-primary-light hover:text-brand-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        ) : null}
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

export default function StudentLayout({ children }) {
  const pathname = usePathname() || "";
  const isAuthPage =
    pathname.includes("/login") ||
    pathname.includes("/register") ||
    pathname.includes("/forgot-password") ||
    pathname.includes("/reset-password");

  // Auth pages: no sidebar / no useSearchParams — avoids remount loops
  if (isAuthPage) {
    return <div className="min-h-screen bg-[#f5f7fb]">{children}</div>;
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
        </div>
      }
    >
      <PortalChrome>{children}</PortalChrome>
    </Suspense>
  );
}
