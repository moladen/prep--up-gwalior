"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useContact } from "@/context/ContactContext";
import { openWhatsAppEnquiry } from "@/lib/whatsapp";
import Button from "@/components/ui/Button";
import CourseDetailSection from "./CourseDetailSection";

export default function CourseWhatsAppCTA({ courseName }) {
  const contact = useContact();
  const phone = contact.phones?.[0];

  if (!phone) return null;

  return (
    <CourseDetailSection
      id="whatsapp"
      label="Quick Enquiry"
      title="Have Questions? Chat With Us"
      description="Get instant answers about batches, fees, and enrollment via WhatsApp."
    >
      <div className="premium-card-layered flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#25D366]/15 text-[#25D366]">
            <MessageCircle className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold text-primary-dark">WhatsApp Quick Enquiry</p>
            <p className="mt-1 text-sm text-muted">
              Ask about <span className="font-medium text-slate-700">{courseName}</span> — we
              typically reply within minutes during office hours.
            </p>
            <a
              href={`tel:${phone}`}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:underline"
            >
              <Phone className="h-3.5 w-3.5" />
              {phone}
            </a>
          </div>
        </div>
        <Button
          type="button"
          onClick={() =>
            openWhatsAppEnquiry(
              {
                name: "",
                phone: "",
                email: "",
                course: courseName,
                message: `Hi, I want to know more about ${courseName}.`,
              },
              phone
            )
          }
          className="shrink-0 bg-[#25D366] hover:bg-[#1ebe57]"
        >
          <MessageCircle className="h-4 w-4" />
          Chat on WhatsApp
        </Button>
      </div>
    </CourseDetailSection>
  );
}
