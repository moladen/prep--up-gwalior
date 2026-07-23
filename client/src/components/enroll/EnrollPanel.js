"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import { useEnrollPanel } from "@/context/EnrollPanelContext";

export default function EnrollPanel() {
  const { isOpen, defaultCourse, closeEnroll } = useEnrollPanel();

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeEnroll();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeEnroll]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close enrollment form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEnroll}
            className="fixed inset-0 z-[60] bg-primary-dark/50 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="enroll-panel-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="premium-card fixed inset-x-4 top-[calc(var(--header-offset)+1rem)] z-[70] mx-auto max-h-[calc(100vh-var(--header-offset)-2rem)] max-w-lg overflow-y-auto sm:inset-x-auto sm:right-6 sm:top-[calc(var(--header-offset)+1rem)] sm:mx-0"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/80 bg-white px-5 py-4">
              <div>
                <p className="badge-neutral mb-1">Enquiry</p>
                <h2
                  id="enroll-panel-title"
                  className="text-lg font-bold text-primary-dark"
                >
                  Quick Enquiry
                </h2>
              </div>
              <button
                type="button"
                onClick={closeEnroll}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              <ContactForm
                key={defaultCourse}
                defaultCourse={defaultCourse}
                title="Enquiry Form"
                compact
                onSuccess={() => {
                  setTimeout(closeEnroll, 800);
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
