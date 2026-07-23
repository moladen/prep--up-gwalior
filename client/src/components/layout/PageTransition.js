"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function PageTransition({ children }) {
  const pathname = usePathname() || "";
  const skipMotion =
    pathname.startsWith("/student") || pathname.startsWith("/admin");

  if (skipMotion) {
    return <div className="min-h-full">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
