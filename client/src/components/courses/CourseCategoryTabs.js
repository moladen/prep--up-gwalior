"use client";

export default function CourseCategoryTabs({
  categories,
  activeId,
  onChange,
  className = "",
}) {
  return (
    <div
      className={`flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      role="tablist"
      aria-label="Course categories"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeId === "all"}
        onClick={() => onChange("all")}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
          activeId === "all"
            ? "bg-brand-primary text-white shadow-sm"
            : "border border-slate-200 bg-white text-slate-600 hover:border-brand-primary/40 hover:text-brand-primary"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          role="tab"
          aria-selected={activeId === cat.id}
          onClick={() => onChange(cat.id)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeId === cat.id
              ? "bg-brand-primary text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600 hover:border-brand-primary/40 hover:text-brand-primary"
          }`}
        >
          {cat.tabLabel}
        </button>
      ))}
    </div>
  );
}
