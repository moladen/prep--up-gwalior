"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  UserPlus,
  UserRound,
  Search,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/ui/Container";
import NavbarBrand from "@/components/layout/NavbarBrand";
import { navLinks } from "@/data/content";
import { useEnrollPanel } from "@/context/EnrollPanelContext";
import { useStudentAuth } from "@/context/StudentAuthContext";

const ACTION_H = "h-9";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { openEnroll } = useEnrollPanel();
  const { student, openLogin, logout } = useStudentAuth();
  const isHome = pathname === "/";
  const homeSections = ["courses", "results", "about", "testimonials", "contact"];
  const activeHomeSection = useScrollSpy(isHome ? homeSections : [], 140);

  useEffect(() => {
    let active = true;
    const onScroll = () => {
      if (active) setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(onScroll);
    return () => {
      active = false;
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/" && !activeHomeSection;
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (pathname === "/" && activeHomeSection === id) return true;
      if (pathname === "/about" && id === "about") return true;
      return false;
    }
    return pathname.startsWith(href);
  };

  return (
    <div
      className={`relative h-[var(--nav-height)] border-b border-border/80 bg-white transition-shadow ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <Container className="h-full">
        <nav className="flex h-full items-center justify-between gap-4 xl:gap-5">
          <NavbarBrand />

          <ul className="hidden h-full flex-1 items-center justify-center gap-0 xl:flex">
            {navLinks.map((link) => (
              <li key={link.href} className="flex h-full items-center">
                <Link
                  href={link.href}
                  className={`nav-link-elegant ${
                    isActive(link.href) ? "nav-link-elegant-active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden h-full items-center gap-5 lg:flex">
            <Link
              href="/courses"
              className={`inline-flex ${ACTION_H} w-9 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-500 shadow-[0_1px_3px_rgba(15,36,68,0.06)] transition duration-300 hover:border-brand-primary/30 hover:bg-brand-primary-light hover:text-brand-primary`}
              aria-label="Search courses"
            >
              <Search className="h-[17px] w-[17px]" strokeWidth={1.75} />
            </Link>

            {student ? (
              <>
                <Link
                  href="/student/dashboard"
                  className={`inline-flex ${ACTION_H} items-center gap-1.5 rounded-full border border-brand-primary/35 px-3.5 text-sm font-semibold leading-none text-brand-primary transition duration-300 hover:bg-brand-primary-light`}
                >
                  <UserRound className="h-4 w-4" strokeWidth={1.75} />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className={`inline-flex ${ACTION_H} items-center rounded-full px-3 text-sm font-medium leading-none text-slate-600 transition hover:bg-slate-50`}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={openLogin}
                className={`inline-flex ${ACTION_H} items-center gap-1.5 rounded-full border border-brand-primary px-3.5 text-sm font-semibold leading-none text-brand-primary transition duration-300 hover:bg-brand-primary-light`}
              >
                <UserRound className="h-4 w-4" strokeWidth={1.75} />
                Login
              </button>
            )}

            <button
              type="button"
              onClick={() => openEnroll()}
              className={`inline-flex ${ACTION_H} items-center gap-1.5 rounded-full bg-gradient-to-r from-[#1e4b9c] to-[#2a6bb5] px-4 text-sm font-semibold leading-none text-white shadow-[0_6px_16px_-8px_rgba(30,75,156,0.5)] transition duration-300 hover:brightness-105`}
            >
              Enquiry Now
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                <ArrowRight className="h-3 w-3" strokeWidth={2.25} />
              </span>
            </button>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-white p-2.5 text-primary-dark lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </Container>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-0 top-full z-50 overflow-hidden border-b border-border bg-white shadow-lg lg:hidden"
          >
            <Container>
              <ul className="flex flex-col gap-1 py-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium ${
                        isActive(link.href)
                          ? "bg-brand-primary-light text-brand-primary"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="px-3 pt-2">
                  {student ? (
                    <Link
                      href="/student/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-brand-primary"
                    >
                      <UserRound className="h-4 w-4" />
                      Dashboard
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        openLogin();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-brand-primary"
                    >
                      <UserRound className="h-4 w-4" />
                      Login
                    </button>
                  )}
                </li>
                <li className="px-3 pb-1 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      openEnroll();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-4 py-3 text-sm font-semibold text-white"
                  >
                    <UserPlus className="h-4 w-4" />
                    Enquiry Now
                  </button>
                </li>
              </ul>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
