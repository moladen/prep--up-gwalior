"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  EligibilityEditor,
  ExamPatternEditor,
  SyllabusEditor,
  FeesEditor,
  FaqEditor,
  FacultyIdsEditor,
} from "@/components/admin/CourseStructuredFields";

const defaultFees = {
  amount: null,
  label: "Fee details available on enquiry",
  note: "Contact us for current offers, scholarships, and installment options.",
};

const empty = {
  name: "",
  fullName: "",
  tagline: "",
  category: "UG",
  subCategory: "",
  overview: "",
  eligibility: [],
  examPattern: [],
  syllabus: [],
  highlights: [],
  learningOutcomes: [],
  faqs: [],
  facultyIds: [],
  duration: "",
  batchTiming: "",
  fees: defaultFees,
  status: "Draft",
  exam: "",
  brochureUrl: "",
  demoVideoUrl: "",
  isFeatured: false,
  isPopular: false,
  isNewBatch: false,
  limitedSeats: false,
  seatsRemaining: "",
};

function normalizeInitial(initial) {
  if (!initial) return empty;

  return {
    ...empty,
    ...initial,
    eligibility: Array.isArray(initial.eligibility) ? initial.eligibility : [],
    examPattern: Array.isArray(initial.examPattern) ? initial.examPattern : [],
    syllabus: Array.isArray(initial.syllabus) ? initial.syllabus : [],
    highlights: Array.isArray(initial.highlights) ? initial.highlights : [],
    learningOutcomes: Array.isArray(initial.learningOutcomes)
      ? initial.learningOutcomes
      : [],
    faqs: Array.isArray(initial.faqs) ? initial.faqs : [],
    facultyIds: Array.isArray(initial.facultyIds) ? initial.facultyIds : [],
    fees:
      initial.fees && typeof initial.fees === "object"
        ? { ...defaultFees, ...initial.fees }
        : defaultFees,
    isFeatured: Boolean(initial.isFeatured),
    isPopular: Boolean(initial.isPopular),
    isNewBatch: Boolean(initial.isNewBatch),
    limitedSeats: Boolean(initial.limitedSeats),
    seatsRemaining: initial.seatsRemaining ?? "",
    demoVideoUrl: initial.demoVideoUrl || "",
    fullName: initial.fullName || "",
    tagline: initial.tagline || "",
  };
}

export default function CourseForm({ initial, onSubmit, loading }) {
  const [form, setForm] = useState(() => normalizeInitial(initial));
  const [image, setImage] = useState(null);
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    setForm(normalizeInitial(initial));
  }, [initial]);

  useEffect(() => {
    api
      .getFaculty("limit=100")
      .then((data) => setFacultyList(data.faculty || []))
      .catch(() => setFacultyList([]));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("fullName", form.fullName);
    fd.append("tagline", form.tagline);
    fd.append("category", form.category);
    fd.append("subCategory", form.subCategory);
    fd.append("overview", form.overview);
    fd.append("duration", form.duration);
    fd.append("batchTiming", form.batchTiming);
    fd.append("exam", form.exam);
    fd.append("brochureUrl", form.brochureUrl);
    fd.append("demoVideoUrl", form.demoVideoUrl);
    fd.append("status", form.status);
    fd.append("isFeatured", String(form.isFeatured));
    fd.append("isPopular", String(form.isPopular));
    fd.append("isNewBatch", String(form.isNewBatch));
    fd.append("limitedSeats", String(form.limitedSeats));
    if (form.seatsRemaining !== "") fd.append("seatsRemaining", form.seatsRemaining);
    fd.append(
      "eligibility",
      JSON.stringify(form.eligibility.filter((item) => item.trim()))
    );
    fd.append(
      "highlights",
      JSON.stringify(form.highlights.filter((item) => item.trim()))
    );
    fd.append(
      "learningOutcomes",
      JSON.stringify(form.learningOutcomes.filter((item) => item.trim()))
    );
    fd.append(
      "examPattern",
      JSON.stringify(
        form.examPattern.filter((row) => row.label.trim() || row.value.trim())
      )
    );
    fd.append(
      "syllabus",
      JSON.stringify(
        form.syllabus
          .filter((mod) => mod.title.trim())
          .map((mod) => ({
            title: mod.title.trim(),
            topics: (mod.topics || []).filter(Boolean),
          }))
      )
    );
    fd.append(
      "faqs",
      JSON.stringify(
        form.faqs.filter((f) => f.question.trim() && f.answer.trim())
      )
    );
    fd.append("facultyIds", JSON.stringify(form.facultyIds));
    fd.append("fees", JSON.stringify(form.fees));
    if (image) fd.append("featuredImage", image);
    onSubmit(fd);
  };

  const basicFields = [
    { name: "name", label: "Course Name", required: true },
    { name: "fullName", label: "Display Title (hero heading)" },
    { name: "tagline", label: "Short Tagline" },
    { name: "subCategory", label: "Sub Category (LAW, IPMAT, Bank, etc.)" },
    { name: "overview", label: "Overview", textarea: true },
    { name: "duration", label: "Course Duration" },
    { name: "batchTiming", label: "Batch Timing" },
    { name: "exam", label: "Exam Name (for results filter)" },
    { name: "brochureUrl", label: "Brochure URL" },
    { name: "demoVideoUrl", label: "Demo Class Video URL (YouTube embed)" },
  ];

  const structuredSections = [
    { key: "eligibility", title: "Eligibility", Editor: EligibilityEditor },
    { key: "highlights", title: "Course Highlights", Editor: EligibilityEditor },
    { key: "learningOutcomes", title: "Learning Outcomes", Editor: EligibilityEditor },
    { key: "examPattern", title: "Exam Pattern", Editor: ExamPatternEditor },
    { key: "syllabus", title: "Syllabus", Editor: SyllabusEditor },
    { key: "faqs", title: "FAQs", Editor: FaqEditor },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          >
            <option value="UG">UG</option>
            <option value="PG">PG</option>
            <option value="Government Jobs">Government Jobs</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          >
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["isFeatured", "Featured Course"],
          ["isPopular", "Popular Course"],
          ["isNewBatch", "New Batch"],
          ["limitedSeats", "Limited Seats"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name={key}
              checked={form[key]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [key]: e.target.checked }))
              }
            />
            {label}
          </label>
        ))}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Seats Remaining</label>
        <input
          name="seatsRemaining"
          type="number"
          value={form.seatsRemaining}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
        />
      </div>

      {basicFields.map(({ name, label, required, textarea }) => (
        <div key={name}>
          <label className="mb-1 block text-sm font-medium">{label}</label>
          {textarea ? (
            <textarea
              name={name}
              value={form[name]}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            />
          ) : (
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              required={required}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            />
          )}
        </div>
      ))}

      {structuredSections.map(({ key, title, Editor }) => (
        <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
          <Editor
            value={form[key]}
            onChange={(val) => setForm((prev) => ({ ...prev, [key]: val }))}
          />
        </div>
      ))}

      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Fees</h3>
        <FeesEditor
          value={form.fees}
          onChange={(fees) => setForm((prev) => ({ ...prev, fees }))}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Assigned Faculty</h3>
        <FacultyIdsEditor
          value={form.facultyIds}
          facultyList={facultyList}
          onChange={(facultyIds) => setForm((prev) => ({ ...prev, facultyIds }))}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Featured Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Course"}
      </button>
    </form>
  );
}
