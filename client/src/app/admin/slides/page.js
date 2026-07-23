"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Star, Info } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/admin/ConfirmModal";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

const emptyForm = {
  studentName: "",
  exam: "",
  achievement: "",
  institute: "",
  ctaText: "Enquiry Now",
  ctaLink: "",
  sortOrder: "0",
  status: "Published",
};

const FIELD_HELP = [
  {
    key: "studentName",
    label: "1. Student Name *",
    hint: "Jo naam homepage card pe dikhega",
    placeholder: "Example: Rahul Sharma",
    required: true,
  },
  {
    key: "exam",
    label: "2. Exam",
    hint: "Kaunsa exam clear kiya / attempt kiya",
    placeholder: "Example: CAT 2025, SSC CGL, CLAT, IPM Indore",
    required: false,
  },
  {
    key: "achievement",
    label: "3. Result / Rank",
    hint: "Short result — rank, percentile, selected, shortlisted",
    placeholder: "Example: AIR 128, 99.5 %ile, Selected, Final Convert",
    required: false,
  },
  {
    key: "institute",
    label: "4. College / Institute",
    hint: "Jahan selection hua — ya Prep Up Gwalior likh sakte ho",
    placeholder: "Example: IIM Amritsar, Prep Up Gwalior",
    required: false,
  },
];

export default function SlidesAdminPage() {
  const { showToast } = useToast();
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getSlides("limit=100");
      setSlides(data.slides || []);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!image) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImage(null);
  };

  const fillExample = () => {
    setForm({
      ...emptyForm,
      studentName: "Rahul Sharma",
      exam: "CLAT",
      achievement: "AIR 128",
      institute: "Prep Up Gwalior",
      sortOrder: "0",
      status: "Published",
    });
    showToast("Example filled — ab photo add karke Save dabao", "success");
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      studentName: item.studentName || "",
      exam: item.exam || "",
      achievement: item.achievement || "",
      institute: item.institute || "",
      ctaText: item.ctaText || "Enquiry Now",
      ctaLink: item.ctaLink || "",
      sortOrder: String(item.sortOrder ?? 0),
      status: item.status || "Published",
    });
    setImage(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.studentName.trim()) {
      showToast("Student ka naam zaroori hai", "error");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
      if (image) fd.append("image", image);

      if (editing) {
        await api.updateSlide(editing._id || editing.id, fd);
        showToast("Achiever update ho gaya");
      } else {
        await api.createSlide(fd);
        showToast("Achiever add ho gaya — homepage hero pe dikhega");
      }
      setForm(emptyForm);
      setImage(null);
      setEditing(null);
      await load();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Save nahi hua", "error");
    } finally {
      setSaving(false);
    }
  };

  const photoSrc =
    previewUrl ||
    (editing && !image ? editing.image?.url || editing.imageUrl : "") ||
    "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Homepage Achievers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ye cards homepage hero pe rotate hote hain (photo + naam + result).
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover"
        >
          <Plus className="h-4 w-4" />
          Naya Achiever
        </button>
      </div>

      <div className="rounded-2xl border border-brand-primary/20 bg-[#E8F0FE] p-4 sm:p-5">
        <div className="flex gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
          <div className="text-sm text-slate-700">
            <p className="font-semibold text-[var(--brand-navy)]">
              Simple steps — sirf itna bharo:
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>
                <strong>Student Name</strong> — student ka naam
              </li>
              <li>
                <strong>Exam</strong> — jaise CAT, CLAT, SSC CGL
              </li>
              <li>
                <strong>Result</strong> — jaise AIR 128, Selected, Final Convert
              </li>
              <li>
                <strong>College</strong> — IIM / college naam (optional)
              </li>
              <li>
                <strong>Photo</strong> — student ki photo upload karo
              </li>
              <li>
                Status <strong>Published</strong> rakho → Save
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              {editing ? "Edit Achiever" : "Naya Achiever Add Karo"}
            </h2>
            {!editing ? (
              <button
                type="button"
                onClick={fillExample}
                className="text-xs font-semibold text-brand-primary hover:underline"
              >
                Example auto-fill
              </button>
            ) : null}
          </div>

          {FIELD_HELP.map((field) => (
            <div key={field.key}>
              <label className="mb-1 block text-sm font-semibold text-slate-800">
                {field.label}
              </label>
              <p className="mb-1.5 text-xs text-slate-500">{field.hint}</p>
              <input
                value={form[field.key]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className={inputClass}
                placeholder={field.placeholder}
                required={field.required}
              />
            </div>
          ))}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">
                Order (optional)
              </label>
              <p className="mb-1.5 text-xs text-slate-500">
                Chhota number pehle dikhega (0, 1, 2…)
              </p>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">
                Website pe dikhe?
              </label>
              <p className="mb-1.5 text-xs text-slate-500">
                Published = live · Draft = hide
              </p>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                <option value="Published">Published (dikhao)</option>
                <option value="Draft">Draft (chhupao)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-800">
              5. Student Photo
            </label>
            <p className="mb-1.5 text-xs text-slate-500">
              Clear face photo best rahegi (JPG / PNG / WEBP)
            </p>
            {photoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoSrc}
                alt="Preview"
                className="mb-2 h-20 w-20 rounded-full object-cover object-top ring-2 ring-[#F0C419]/60"
              />
            ) : null}
            {image ? (
              <p className="mb-2 text-xs font-medium text-brand-primary">
                Selected: {image.name}
              </p>
            ) : null}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white hover:bg-brand-primary-hover disabled:opacity-60 sm:w-auto"
          >
            {saving
              ? "Saving..."
              : editing
                ? "Update Achiever"
                : "Save Achiever"}
          </button>
        </form>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-primary">
              Live Preview
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Homepage hero pe aisa dikhega:
            </p>
            <div
              className="mt-4 rounded-[18px] border border-white/20 p-4 text-white"
              style={{
                background:
                  "linear-gradient(145deg, rgba(15,36,68,0.92), rgba(15,36,68,0.75))",
              }}
            >
              <div className="flex items-center gap-3.5">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white/10 ring-[3px] ring-[#F0C419]">
                  {photoSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoSrc}
                      alt=""
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xl font-bold text-white/70">
                      {(form.studentName || "S").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#F0C419]">
                    {form.exam || "EXAM NAME"}
                  </p>
                  <p className="truncate text-sm font-semibold text-white/90">
                    {form.achievement || "Result / Rank"}
                  </p>
                  <p className="truncate text-base font-black text-white">
                    {form.studentName || "Student Name"}
                  </p>
                  <p className="truncate text-xs text-white/60">
                    {form.institute || "Institute"}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-1 border-t border-white/15 pt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-[#F0C419] text-[#F0C419]"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
            <p className="font-semibold text-slate-800">Example:</p>
            <p className="mt-1">
              Naam: <strong>Neha Gupta</strong>
              <br />
              Exam: <strong>IPM Indore</strong>
              <br />
              Result: <strong>Shortlisted</strong>
              <br />
              College: <strong>Prep Up Gwalior</strong>
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
          Saved Achievers ({slides.length})
        </h3>
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : slides.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            Abhi koi achiever nahi hai. Upar form bhar ke pehla card add karo.
          </p>
        ) : (
          <ul className="space-y-2">
            {slides.map((item) => (
              <li
                key={item._id || item.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  {(item.image?.url || item.imageUrl) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image?.url || item.imageUrl}
                      alt={item.studentName}
                      className="h-10 w-10 rounded-full object-cover object-top"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.studentName}
                      {item.exam ? ` — ${item.exam}` : ""}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.achievement || "—"}
                      {item.institute ? ` · ${item.institute}` : ""} ·{" "}
                      {item.status}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-brand-primary"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="rounded-lg p-2 text-slate-600 hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete achiever?"
        message="Ye card homepage hero se hat jayega."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          try {
            await api.deleteSlide(deleteTarget._id || deleteTarget.id);
            showToast("Achiever delete ho gaya");
            load();
          } catch (err) {
            showToast(err.message, "error");
          } finally {
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
