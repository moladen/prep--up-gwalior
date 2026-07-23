import Link from "next/link";
import BrandMark from "@/components/ui/BrandMark";

export default function NavbarBrand() {
  return (
    <Link
      href="/"
      className="nav-brand group flex shrink-0 items-center gap-2.5 py-1 transition-opacity duration-300 hover:opacity-90"
      aria-label="Prep Up Gwalior"
    >
      <span
        className="overflow-hidden rounded-2xl"
        suppressHydrationWarning
      >
        <BrandMark className="h-11 w-11 sm:h-12 sm:w-12" alt="Prep Up" />
      </span>
      <span className="nav-brand__text">
        <span className="nav-brand__title">PREP UP</span>
        <span className="nav-brand__subtitle">GWALIOR</span>
        <span className="mt-0.5 hidden text-[9px] font-medium tracking-wide text-slate-500 sm:block">
          Education For Everyone
        </span>
      </span>
    </Link>
  );
}
