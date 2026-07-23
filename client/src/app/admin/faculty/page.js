"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/admin/ConfirmModal";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

const emptyForm = {
  name: "",
  title: "",
  qualification: "",
  experience: "",
  specialization: "",
  bio: "",
  linkedin: "",
  instagram: "",
  status: "Published",
};

export default function FacultyAdminPage() {
  const { showToast } = useToast();
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getFaculty("limit=100");
      setFaculty(data.faculty || []);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      const { linkedin, instagram, ...rest } = form;
      Object.entries(rest).forEach(([k, v]) => fd.append(k, v));
      fd.append("subjects", JSON.stringify([]));
      fd.append(
        "social",
        JSON.stringify({
          linkedin: linkedin || "",
          instagram: instagram || "",
        })
      );
      if (image) fd.append("image", image);
      if (editing) {
        await api.updateFaculty(editing._id || editing.id, fd);
        showToast("Faculty updated");
      } else {
        await api.createFaculty(fd);
        showToast("Faculty created");
      }
      setForm(emptyForm);
      setImage(null);
      setEditing(null);
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Faculty</h1>
      <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        {Object.keys(emptyForm).map((key) => (
          <div key={key}>
            <label className="mb-1 block text-sm font-medium capitalize">{key}</label>
            {key === "bio" ? (
              <textarea
                rows={3}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className={inputClass}
              />
            ) : (
              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className={inputClass}
              />
            )}
          </div>
        ))}
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <button type="submit" className="btn-primary px-5 py-2.5 text-sm">
          {editing ? "Update Faculty" : "Add Faculty"}
        </button>
      </form>
      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : (
        <ul className="space-y-2">
          {faculty.map((member) => (
            <li key={member.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
              <button
                type="button"
                onClick={() => {
                  setEditing(member);
                  let social = {};
                  try {
                    social =
                      typeof member.social === "string"
                        ? JSON.parse(member.social || "{}")
                        : member.social || {};
                  } catch {
                    social = {};
                  }
                  setForm({
                    name: member.name || "",
                    title: member.title || "",
                    qualification: member.qualification || "",
                    experience: member.experience || "",
                    specialization: member.specialization || "",
                    bio: member.bio || "",
                    linkedin: social.linkedin || "",
                    instagram: social.instagram || "",
                    status: member.status || "Published",
                  });
                }}
                className="text-left text-sm font-medium text-slate-800 hover:text-brand-primary"
              >
                {member.name} — {member.title}
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(member)}
                className="text-slate-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete faculty member?"
        message="This cannot be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          try {
            await api.deleteFaculty(deleteTarget._id || deleteTarget.id);
            showToast("Deleted");
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
