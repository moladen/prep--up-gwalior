"use client";

import { useState } from "react";

export function resolveImageSrc(url) {
  if (!url) return null;
  let src = url;
  if (!src.startsWith("http") && !src.startsWith("/")) {
    src = `/${src}`;
  }
  // Local assets were converted to WebP — rewrite stale jpg/png paths
  if (
    src.startsWith("/") &&
    !src.startsWith("//") &&
    /\.(jpe?g|png)$/i.test(src)
  ) {
    src = src.replace(/\.(jpe?g|png)$/i, ".webp");
  }
  return src;
}

const PLACEHOLDER_COLORS = [
  "bg-brand-primary-light text-brand-primary",
  "bg-brand-secondary-light text-brand-secondary",
  "bg-brand-accent-light text-brand-accent",
  "bg-sky-50 text-sky-700",
  "bg-indigo-50 text-indigo-700",
  "bg-amber-50 text-amber-700",
];

export function getImageUrl(item) {
  return resolveImageSrc(item?.image?.url || item?.imageUrl || "");
}

export default function PersonImage({
  name,
  imageUrl,
  className = "",
  colorIndex = 0,
  objectPosition = "center",
}) {
  const resolved = resolveImageSrc(imageUrl);
  const [failed, setFailed] = useState(false);
  const positionClass =
    objectPosition === "top"
      ? "object-top"
      : objectPosition === "bottom"
        ? "object-bottom"
        : "object-center";

  if (resolved && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={name || "Student"}
        className={`absolute inset-0 h-full w-full object-cover ${positionClass} ${className}`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }

  const initial = name?.charAt(0)?.toUpperCase() || "S";
  const color = PLACEHOLDER_COLORS[colorIndex % PLACEHOLDER_COLORS.length];

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${color} ${className}`}
      aria-label={name || "Student"}
    >
      {initial}
    </div>
  );
}
