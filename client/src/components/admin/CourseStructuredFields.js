"use client";

import { Plus, Trash2 } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

const btnClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50";

export function EligibilityEditor({ value = [], onChange }) {
  const items = value.length ? value : [""];

  const update = (index, text) => {
    const next = [...items];
    next[index] = text;
    onChange(next);
  };

  const add = () => onChange([...items, ""]);
  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => update(index, e.target.value)}
            placeholder="Eligibility point"
            className={inputClass}
          />
          <button type="button" onClick={() => remove(index)} className={btnClass}>
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className={btnClass}>
        <Plus className="h-3.5 w-3.5" />
        Add point
      </button>
    </div>
  );
}

export function ExamPatternEditor({ value = [], onChange }) {
  const rows = value.length ? value : [{ label: "", value: "" }];

  const update = (index, field, text) => {
    const next = rows.map((row, i) =>
      i === index ? { ...row, [field]: text } : row
    );
    onChange(next);
  };

  const add = () => onChange([...rows, { label: "", value: "" }]);
  const remove = (index) => onChange(rows.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
          <input
            value={row.label}
            onChange={(e) => update(index, "label", e.target.value)}
            placeholder="Label (e.g. Mode)"
            className={inputClass}
          />
          <input
            value={row.value}
            onChange={(e) => update(index, "value", e.target.value)}
            placeholder="Value (e.g. Online CBT)"
            className={inputClass}
          />
          <button type="button" onClick={() => remove(index)} className={btnClass}>
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className={btnClass}>
        <Plus className="h-3.5 w-3.5" />
        Add row
      </button>
    </div>
  );
}

export function SyllabusEditor({ value = [], onChange }) {
  const modules = value.length ? value : [{ title: "", topics: [] }];

  const updateTitle = (index, title) => {
    const next = modules.map((mod, i) => (i === index ? { ...mod, title } : mod));
    onChange(next);
  };

  const updateTopics = (index, text) => {
    const topics = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const next = modules.map((mod, i) => (i === index ? { ...mod, topics } : mod));
    onChange(next);
  };

  const add = () => onChange([...modules, { title: "", topics: [] }]);
  const remove = (index) => onChange(modules.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {modules.map((mod, index) => (
        <div key={index} className="rounded-xl border border-slate-200 p-3">
          <div className="mb-2 flex gap-2">
            <input
              value={mod.title}
              onChange={(e) => updateTitle(index, e.target.value)}
              placeholder="Module title"
              className={inputClass}
            />
            <button type="button" onClick={() => remove(index)} className={btnClass}>
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <textarea
            value={(mod.topics || []).join("\n")}
            onChange={(e) => updateTopics(index, e.target.value)}
            rows={3}
            placeholder="One topic per line"
            className={`${inputClass} resize-y`}
          />
        </div>
      ))}
      <button type="button" onClick={add} className={btnClass}>
        <Plus className="h-3.5 w-3.5" />
        Add module
      </button>
    </div>
  );
}

export function FaqEditor({ value = [], onChange }) {
  const items = value.length ? value : [{ question: "", answer: "" }];

  const update = (index, field, text) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [field]: text } : item
    );
    onChange(next);
  };

  const add = () => onChange([...items, { question: "", answer: "" }]);
  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-slate-200 p-3 space-y-2">
          <div className="flex gap-2">
            <input
              value={item.question}
              onChange={(e) => update(index, "question", e.target.value)}
              placeholder="Question"
              className={inputClass}
            />
            <button type="button" onClick={() => remove(index)} className={btnClass}>
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <textarea
            value={item.answer}
            onChange={(e) => update(index, "answer", e.target.value)}
            rows={2}
            placeholder="Answer"
            className={`${inputClass} resize-y`}
          />
        </div>
      ))}
      <button type="button" onClick={add} className={btnClass}>
        <Plus className="h-3.5 w-3.5" />
        Add FAQ
      </button>
    </div>
  );
}

export function FacultyIdsEditor({ value = [], onChange, facultyList = [] }) {
  const selected = new Set(value);

  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange([...next]);
  };

  if (!facultyList.length) {
    return (
      <p className="text-sm text-slate-500">
        No faculty found. Add faculty profiles in Admin → Faculty first.
      </p>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {facultyList.map((member) => {
        const id = member.id || member._id;
        const checked = selected.has(id);
        return (
          <label
            key={id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors ${
              checked
                ? "border-brand-primary/40 bg-brand-primary-light/30"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(id)}
              className="rounded border-slate-300"
            />
            <span>
              <span className="font-medium text-slate-900">{member.name}</span>
              {member.title && (
                <span className="block text-xs text-slate-500">{member.title}</span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export function FeesEditor({ value = {}, onChange }) {
  const fees = {
    amount: value.amount ?? "",
    label: value.label ?? "",
    note: value.note ?? "",
  };

  const update = (field, val) => onChange({ ...fees, [field]: val });

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Amount (₹) — leave empty for &quot;On Enquiry&quot;
        </label>
        <input
          type="number"
          min="0"
          value={fees.amount ?? ""}
          onChange={(e) =>
            update("amount", e.target.value ? Number(e.target.value) : null)
          }
          className={inputClass}
          placeholder="e.g. 25000"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Fee label
        </label>
        <input
          value={fees.label}
          onChange={(e) => update("label", e.target.value)}
          className={inputClass}
          placeholder="e.g. Full course fee"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Note
        </label>
        <textarea
          value={fees.note}
          onChange={(e) => update("note", e.target.value)}
          rows={2}
          className={`${inputClass} resize-y`}
          placeholder="Installments, scholarships, etc."
        />
      </div>
    </div>
  );
}
