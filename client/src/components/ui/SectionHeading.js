export default function SectionHeading({
  label,
  title,
  description,
  align = "center",
  light = false,
  className = "",
  compact = false,
}) {
  const alignClass =
    align === "center" ? "text-center mx-auto" : "text-left";
  const spacing = compact
    ? "mb-8 max-w-2xl lg:mb-10"
    : "mb-12 max-w-2xl lg:mb-14";

  return (
    <div className={`${spacing} ${alignClass} ${className}`.trim()}>
      {label && (
        <span
          className={`inline-block ${
            light
              ? compact
                ? "badge-dark mb-3"
                : "badge-dark mb-4"
              : compact
                ? "badge-neutral mb-3"
                : "badge-neutral mb-4"
          }`}
        >
          {label}
        </span>
      )}
      <h2
        className={`${
          compact
            ? "text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-[2.125rem] lg:leading-[1.15]"
            : "text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.625rem] lg:leading-[1.12]"
        } ${light ? "text-white" : "text-primary-dark"}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`${
            compact ? "mt-3 text-sm sm:text-base" : "mt-4 text-base sm:text-lg"
          } max-w-xl leading-relaxed ${align === "center" ? "mx-auto" : ""} ${
            light ? "text-slate-400" : "text-muted"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
