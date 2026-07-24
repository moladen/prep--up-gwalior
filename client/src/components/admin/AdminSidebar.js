"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Trophy,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  Megaphone,
  GraduationCap,
  Sparkles,
  Images,
  BarChart3,
  Bell,
  FolderOpen,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import BrandMark from "@/components/ui/BrandMark";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/faculty", label: "Faculty", icon: GraduationCap },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/results", label: "Results", icon: Trophy },
  { href: "/admin/slides", label: "Achievers", icon: Images },
  { href: "/admin/stats", label: "Stats", icon: BarChart3 },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/students", label: "Students", icon: GraduationCap },
  { href: "/admin/tests", label: "Mock Tests", icon: ClipboardList },
  { href: "/admin/materials", label: "Study Materials", icon: FolderOpen },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
  { href: "/admin/seo", label: "SEO", icon: Sparkles },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ open, onClose }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/80 bg-white shadow-sm transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2.5 border-b border-slate-200/80 px-4 py-4">
          <BrandMark className="h-10 w-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-brand-primary">Prep Up</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-800">
              Gwalior
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-primary">
              Admin Panel
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-primary-light text-brand-primary"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200/80 p-3">
          <Link
            href="/"
            onClick={onClose}
            className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          >
            View Website
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
