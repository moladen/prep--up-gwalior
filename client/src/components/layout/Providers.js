"use client";

import { EnrollPanelProvider } from "@/context/EnrollPanelContext";
import { ContactProvider } from "@/context/ContactContext";
import { PlatformProvider } from "@/context/PlatformContext";
import { StudentAuthProvider } from "@/context/StudentAuthContext";
import { ToastProvider } from "@/context/ToastContext";
import AppShell from "@/components/layout/AppShell";
import StudentLoginModal from "@/components/auth/StudentLoginModal";

export default function Providers({ children }) {
  return (
    <ToastProvider>
      <ContactProvider>
        <PlatformProvider>
          <StudentAuthProvider>
            <EnrollPanelProvider>
              <AppShell>{children}</AppShell>
              <StudentLoginModal />
            </EnrollPanelProvider>
          </StudentAuthProvider>
        </PlatformProvider>
      </ContactProvider>
    </ToastProvider>
  );
}
