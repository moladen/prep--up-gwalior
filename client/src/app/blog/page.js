"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import PageBanner from "@/components/ui/PageBanner";
import Container from "@/components/ui/Container";
import { getPublicBlogs } from "@/lib/publicApi";
import { fadeUp, staggerContainer, viewportSoft } from "@/lib/motion";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicBlogs()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => [...new Set(posts.map((p) => p.category).filter(Boolean))],
    [posts]
  );

  const filtered = posts.filter((post) => {
    const q = search.trim().toLowerCase();
    if (q && !post.title.toLowerCase().includes(q)) return false;
    if (category && post.category !== category) return false;
    return true;
  });

  return (
    <>
      <PageBanner title="Blog" subtitle="Tips, updates, and exam preparation insights." />
      <section className="section-padding bg-white">
        <Container>
          <div className="premium-card mb-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="input-premium !pl-11"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-premium sm:w-48"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="premium-card h-72 animate-pulse bg-slate-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted">No articles published yet.</p>
          ) : (
            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={viewportSoft}
              variants={staggerContainer}
            >
              {filtered.map((post) => (
                <motion.article key={post.id} variants={fadeUp} className="premium-card overflow-hidden">
                  {post.coverImage?.url && (
                    <div className="relative aspect-[16/10] bg-slate-100">
                      <Image
                        src={post.coverImage.url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    {post.category && (
                      <span className="badge-neutral mb-3 inline-block !text-[10px]">
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-lg font-bold text-primary-dark">
                      <Link href={`/blog/${post.slug}`} className="hover:text-brand-primary">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-primary"
                    >
                      Read More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </Container>
      </section>
    </>
  );
}
