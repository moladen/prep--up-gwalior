"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import PageBanner from "@/components/ui/PageBanner";
import Container from "@/components/ui/Container";
import ReadingProgress from "@/components/blog/ReadingProgress";
import { getPublicBlogBySlug, getPublicBlogs } from "@/lib/publicApi";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      getPublicBlogBySlug(slug),
      getPublicBlogs(),
    ])
      .then(([detail, all]) => {
        if (!active) return;
        if (!detail) {
          notFound();
          return;
        }
        setPost(detail);
        setRelated(
          all
            .filter((p) => p.slug !== slug && p.category === detail.category)
            .slice(0, 3)
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="section-padding text-center text-muted">Loading...</div>;
  }
  if (!post) return null;

  return (
    <>
      <ReadingProgress />
      <PageBanner title={post.title} subtitle={post.excerpt} />
      <article className="section-padding bg-white">
        <Container className="max-w-3xl">
          {post.coverImage?.url && (
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src={post.coverImage.url}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}
          <div
            className="prose prose-slate max-w-none prose-headings:text-primary-dark prose-a:text-brand-primary"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }}
          />
          {related.length > 0 && (
            <div className="mt-14 border-t border-border/60 pt-10">
              <h3 className="mb-5 text-xl font-bold text-primary-dark">Related Posts</h3>
              <ul className="space-y-3">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/blog/${item.slug}`}
                      className="font-medium text-brand-primary hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </article>
    </>
  );
}
