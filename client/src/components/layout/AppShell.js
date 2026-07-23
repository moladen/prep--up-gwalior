"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SiteEnhancements from "@/components/layout/SiteEnhancements";
import NewsUpdatesBar from "@/components/layout/NewsUpdatesBar";
import EnrollPanel from "@/components/enroll/EnrollPanel";

export default function AppShell({ children }) {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin");
  const isStudentPortal = pathname.startsWith("/student");

  if (isAdmin || isStudentPortal) {
    return <div className="min-h-full">{children}</div>;
  }

  return (
    <>
      <SiteEnhancements />
      <div className="site-topbar fixed inset-x-0 top-0 z-50">
        <NewsUpdatesBar />
        <Navbar />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
      <EnrollPanel />
    </>
  );
}
