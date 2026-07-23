"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToHash(hash) {
  if (!hash || hash === "#") return;
  const id = hash.replace("#", "");
  const target = document.getElementById(id);
  if (!target) return;
  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const run = () => scrollToHash(window.location.hash);
    // Wait a tick so section is in the DOM after navigation
    const t = window.setTimeout(run, 80);

    const onHashChange = () => scrollToHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);

  return null;
}
