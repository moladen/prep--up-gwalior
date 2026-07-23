"use client";

import { Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminHeader({ title, breadcrumbs = [], onMenuClick }) {
  const { admin } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 transition-colors hover:bg-slate-50 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            {breadcrumbs.length > 0 && (
              <p className="text-xs font-medium text-slate-400">
                {breadcrumbs.join(" / ")}
              </p>
            )}
            <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
              {title}
            </h1>
          </div>
        </div>
        <div className="hidden text-right text-sm sm:block">
          <p className="font-semibold text-slate-900">{admin?.name || "Admin"}</p>
          <p className="text-slate-500">{admin?.email}</p>
        </div>
      </div>
    </header>
  );
}
