"use client";

import Link from "next/link";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline-dark",
  ghostLight: "btn-ghost-light",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-slate-600 transition-all duration-300 hover:bg-brand-primary-light hover:text-brand-primary",
};

function setRipplePosition(event) {
  const target = event.currentTarget;
  if (!target?.classList?.contains("btn-primary")) return;
  const rect = target.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  target.style.setProperty("--ripple-x", `${x}%`);
  target.style.setProperty("--ripple-y", `${y}%`);
}

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const baseClass = "inline-flex items-center justify-center gap-2";
  const classes = `${baseClass} ${variants[variant]} ${className}`;
  const rippleProps =
    variant === "primary"
      ? { onMouseMove: setRipplePosition, onMouseEnter: setRipplePosition }
      : {};

  if (href) {
    const isHashLink = href.startsWith("#") || href.includes("#");

    if (isHashLink) {
      return (
        <a href={href} className={classes} suppressHydrationWarning {...rippleProps} {...props}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} suppressHydrationWarning {...rippleProps} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} suppressHydrationWarning {...rippleProps} {...props}>
      {children}
    </button>
  );
}
