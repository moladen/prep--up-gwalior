"use client";

import { useContact } from "@/context/ContactContext";

export default function GoogleMapsEmbed({ className = "" }) {
  const contact = useContact();
  const link = contact.googleMapsLink;

  if (!link) return null;

  const embedUrl = link.includes("/embed")
    ? link
    : link.replace("/maps/", "/maps/embed/").replace("?","/embed?");

  return (
    <div className={`overflow-hidden rounded-2xl ring-1 ring-border/50 ${className}`}>
      <iframe
        src={embedUrl}
        title="Prep Up Gwalior location"
        className="h-64 w-full sm:h-80"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
