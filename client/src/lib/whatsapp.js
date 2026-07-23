import { contact } from "@/data/content";

function formatWhatsAppNumber(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith("91") && digits.length === 12) return digits;
  return digits;
}

export function buildEnquiryWhatsAppMessage(form) {
  const lines = [
    "Hi Prep Up Gwalior,",
    "I want to enroll / enquire.",
    "",
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
    `Email: ${form.email}`,
  ];

  if (form.course?.trim()) {
    lines.push(`Course: ${form.course.trim()}`);
  }

  if (form.message?.trim()) {
    lines.push(`Message: ${form.message.trim()}`);
  }

  return lines.join("\n");
}

export function openWhatsAppEnquiry(form, phone = contact.phones[0]) {
  const whatsappNumber = formatWhatsAppNumber(phone);
  const text = buildEnquiryWhatsAppMessage(form);
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}
