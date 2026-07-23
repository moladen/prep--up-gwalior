"use client";

import { useEffect, useState } from "react";
import { UserPlus, Download, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { useEnrollPanel } from "@/context/EnrollPanelContext";
import { useContact } from "@/context/ContactContext";
import { openWhatsAppEnquiry } from "@/lib/whatsapp";

export default function StickyApplyBar({ courseName, brochureUrl }) {
  const { openEnroll } = useEnrollPanel();
  const contact = useContact();
  const phone = contact.phones?.[0];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="course-sticky-cta fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
        <p className="mr-auto hidden min-w-0 truncate text-sm font-semibold text-primary-dark sm:block">
          {courseName}
        </p>
        {phone && (
          <Button
            type="button"
            variant="ghostLight"
            onClick={() =>
              openWhatsAppEnquiry(
                {
                  name: "",
                  phone: "",
                  email: "",
                  course: courseName,
                  message: `Hi, I want to enroll in ${courseName}.`,
                },
                phone
              )
            }
            className="hidden px-4 py-2.5 text-sm sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
        )}
        {brochureUrl && (
          <Button
            href={brochureUrl}
            variant="secondary"
            className="hidden px-4 py-2.5 text-sm md:inline-flex"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="h-4 w-4" />
            Brochure
          </Button>
        )}
        <Button
          onClick={() => openEnroll(courseName)}
          className="flex-1 px-4 py-2.5 text-sm sm:flex-none"
        >
          <UserPlus className="h-4 w-4" />
          Enquiry Now
        </Button>
      </div>
    </div>
  );
}
