"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Contact moved into Settings — keep old URL working */
export default function ContactRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/settings");
  }, [router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
      Redirecting to Settings...
    </div>
  );
}
