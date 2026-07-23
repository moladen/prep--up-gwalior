"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
    </div>
  );
}

function PanelShell({ children }) {
  const { admin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || loading) return;
    if (!admin) {
      router.replace("/admin/login");
    }
  }, [admin, loading, ready, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Keep server + first client paint identical to avoid hydration mismatch
  if (!ready || loading) {
    return <AdminLoading />;
  }

  if (!admin) {
    return <AdminLoading />;
  }

  const titleMap = {
    "/admin": "Dashboard",
    "/admin/courses": "Courses",
    "/admin/faculty": "Faculty",
    "/admin/marketing": "Marketing",
    "/admin/content": "Website Content",
    "/admin/results": "Results",
    "/admin/slides": "Hero Achievers",
    "/admin/stats": "Site Stats",
    "/admin/notifications": "Notifications",
    "/admin/students": "Students",
    "/admin/tests": "Mock Tests",
    "/admin/materials": "Study Materials",
    "/admin/testimonials": "Testimonials",
    "/admin/enquiries": "Enquiries",
    "/admin/contact": "Contact Management",
    "/admin/seo": "SEO",
    "/admin/settings": "Settings",
  };

  const title =
    Object.entries(titleMap).find(([path]) =>
      path === "/admin" ? pathname === "/admin" : pathname.startsWith(path)
    )?.[1] || "Admin";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          title={title}
          breadcrumbs={["Admin", title]}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  return (
    <ToastProvider>
      <AuthProvider>
        {isLogin ? (
          <div className="min-h-screen bg-slate-50">{children}</div>
        ) : (
          <PanelShell>{children}</PanelShell>
        )}
      </AuthProvider>
    </ToastProvider>
  );
}
