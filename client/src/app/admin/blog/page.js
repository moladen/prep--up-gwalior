"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/admin/ConfirmModal";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  author: "Prep Up Gwalior",
  status: "Draft",
};

export default function BlogAdminPage() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [cover, setCover] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    const data = await api.getBlogs("limit=50");
    setPosts(data.posts || []);
  }, []);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (cover) fd.append("coverImage", cover);
      if (editing) {
        await api.updateBlog(editing._id || editing.id, fd);
        showToast("Post updated");
      } else {
        await api.createBlog(fd);
        showToast("Post created");
      }
      setForm(emptyForm);
      setCover(null);
      setEditing(null);
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Blog</h1>
      <form onSubmit={submit} className="max-w-3xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        {Object.entries({
          title: "text",
          slug: "text",
          category: "text",
          excerpt: "textarea",
          content: "textarea",
          status: "text",
        }).map(([key, type]) => (
          <div key={key}>
            <label className="mb-1 block text-sm font-medium capitalize">{key}</label>
            {type === "textarea" ? (
              <textarea
                rows={key === "content" ? 8 : 3}
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
        <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} />
        <button type="submit" className="btn-primary px-5 py-2.5 text-sm">
          {editing ? "Update Post" : "Create Post"}
        </button>
      </form>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
            <button
              type="button"
              onClick={() => {
                setEditing(post);
                setForm({
                  title: post.title,
                  slug: post.slug,
                  excerpt: post.excerpt,
                  content: post.content,
                  category: post.category,
                  author: post.author,
                  status: post.status,
                });
              }}
              className="text-left text-sm font-medium hover:text-brand-primary"
            >
              {post.title} <span className="text-muted">({post.status})</span>
            </button>
            <button type="button" onClick={() => setDeleteTarget(post)} className="text-slate-400 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete blog post?"
        message="This cannot be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          await api.deleteBlog(deleteTarget._id || deleteTarget.id);
          showToast("Deleted");
          setDeleteTarget(null);
          load();
        }}
      />
    </div>
  );
}
