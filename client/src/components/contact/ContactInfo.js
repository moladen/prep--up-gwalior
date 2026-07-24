"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useContact } from "@/context/ContactContext";

const iconStyles = ["icon-box-blue", "icon-box-emerald", "icon-box-gold", "icon-box-blue"];

export default function ContactInfo({ unified = false }) {
  const contact = useContact();

  const items = [
    { icon: MapPin, title: "Visit Us", content: contact.address, href: null },
    { icon: Phone, title: "Call Us", content: contact.phones, href: "tel" },
    { icon: Mail, title: "Email Us", content: contact.email, href: "mailto" },
    {
      icon: Clock,
      title: "Office Hours",
      content: "Mon – Sat: 9:00 AM – 7:00 PM",
      href: null,
    },
  ].filter((item) => {
    if (Array.isArray(item.content)) return item.content.length > 0;
    return Boolean(item.content);
  });

  if (!items.length) {
    return (
      <div className="premium-card p-7 text-sm text-muted sm:p-8">
        Contact details will appear here once updated in admin settings.
      </div>
    );
  }

  if (unified) {
    return (
      <div className="premium-card flex h-full flex-col p-7 sm:p-8">
        <h3 className="mb-7 text-lg font-bold text-primary-dark">
          Contact Details
        </h3>
        <div className="space-y-5">
          {items.map(({ icon: Icon, title, content, href }, index) => (
            <div
              key={title}
              className={`flex gap-4 ${
                index < items.length - 1 ? "border-b border-border/60 pb-5" : ""
              }`}
            >
              <span className={`h-10 w-10 shrink-0 ${iconStyles[index]}`}>
                <Icon className="mx-auto h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h4 className="mb-1 text-sm font-semibold text-primary-dark">
                  {title}
                </h4>
                {Array.isArray(content) ? (
                  <div className="space-y-1">
                    {content.map((item) => (
                      <p key={item}>
                        <a
                          href={`${href}:${item}`}
                          className="text-sm text-muted transition-colors hover:text-brand-blue"
                        >
                          {item}
                        </a>
                      </p>
                    ))}
                  </div>
                ) : href ? (
                  <a
                    href={`${href}:${content}`}
                    className="text-sm text-muted transition-colors hover:text-brand-blue"
                  >
                    {content}
                  </a>
                ) : (
                  <p className="text-sm leading-relaxed text-muted">{content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.slice(0, 3).map(({ icon: Icon, title, content, href }, index) => (
        <div key={title} className="premium-card p-5">
          <span className={`mb-3 h-10 w-10 ${iconStyles[index]}`}>
            <Icon className="mx-auto h-4 w-4" />
          </span>
          <h3 className="mb-1 font-semibold text-primary-dark">{title}</h3>
          {Array.isArray(content) ? (
            <div className="space-y-1">
              {content.map((item) => (
                <p key={item}>
                  <a
                    href={`${href}:${item}`}
                    className="text-sm text-muted hover:text-brand-blue"
                  >
                    {item}
                  </a>
                </p>
              ))}
            </div>
          ) : href ? (
            <a
              href={`${href}:${content}`}
              className="text-sm text-muted hover:text-brand-blue"
            >
              {content}
            </a>
          ) : (
            <p className="text-sm text-muted">{content}</p>
          )}
        </div>
      ))}
    </div>
  );
}
