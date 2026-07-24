"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import Container from "@/components/ui/Container";
import BrandMark from "@/components/ui/BrandMark";
import { useContact } from "@/context/ContactContext";
import { siteInfo } from "@/data/content";

const QUICK = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/results", label: "Results" },
  { href: "/faculty", label: "Faculty" },
];

const RESOURCES = [
  { href: "/notifications", label: "Notifications" },
  { href: "/student/login", label: "Study Material" },
  { href: "/contact", label: "Downloads" },
];

const PORTAL = [
  { href: "/student/login", label: "Login" },
  { href: "/student/dashboard", label: "Dashboard" },
  { href: "/courses", label: "My Courses" },
  { href: "/contact", label: "My Tests" },
];

export default function Footer() {
  const contact = useContact();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[var(--brand-navy)] text-slate-300">
      <div className="border-b border-white/10 bg-[#132a4d]">
        <Container className="flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-xl font-bold text-white sm:text-2xl">
              Have Questions? We&apos;re here to help!
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Talk to our counselors about batches, fees, and admissions.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-6 py-3 text-sm font-bold text-[var(--brand-navy)] transition hover:brightness-105"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Container>
      </div>

      <Container className="py-12 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 inline-flex items-center gap-2.5">
              <span className="overflow-hidden rounded-lg">
                <BrandMark className="h-12 w-12" alt="" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-extrabold tracking-tight text-white">
                  PREP UP
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-brand-accent">
                  Gwalior
                </span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {siteInfo.description}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {RESOURCES.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Student Portal
            </h3>
            <ul className="space-y-2.5">
              {PORTAL.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Contact Us
            </h3>
            <address className="space-y-3 text-sm not-italic">
              {contact.address ? (
                <p className="flex gap-2 text-slate-400">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                  {contact.address}
                </p>
              ) : null}
              {(contact.phones || []).slice(0, 2).map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 text-slate-400 transition hover:text-white"
                >
                  <Phone className="h-4 w-4 text-brand-accent" />
                  {phone}
                </a>
              ))}
              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-slate-400 transition hover:text-white"
                >
                  <Mail className="h-4 w-4 text-brand-accent" />
                  {contact.email}
                </a>
              ) : null}
              {(contact.social?.instagram || contact.social?.facebook) && (
                <div className="flex gap-2 pt-2">
                  {contact.social?.instagram ? (
                    <a
                      href={contact.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="h-4 w-4" />
                    </a>
                  ) : null}
                  {contact.social?.facebook ? (
                    <a
                      href={contact.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                      aria-label="Facebook"
                    >
                      <FacebookIcon className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              )}
            </address>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {currentYear} {siteInfo.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
