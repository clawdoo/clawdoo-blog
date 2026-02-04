"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";

interface Post {
  id: string;
  title: string;
  titleEn: string;
  date: string;
  excerpt: string;
  excerptEn: string;
  tags: string[];
  tagsEn: string[];
}

interface TagDetailClientProps {
  tag: string;
  posts: Post[];
}

export default function TagDetailClient({ tag, posts }: TagDetailClientProps) {
  const [lang, setLang] = useState<"zh" | "en">("zh");

  useEffect(() => {
    const savedLang = localStorage.getItem("blog-lang") as "zh" | "en";
    if (savedLang) setLang(savedLang);
  }, []);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Noise background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <Link
            href={`/tags?lang=${lang}`}
            className="inline-block text-sm font-sans transition-colors hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            ← {lang === "zh" ? "所有标签" : "All Tags"}
          </Link>
        </div>

        <div className="mb-12">
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-sans mb-4"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
          >
            {tag}
          </span>
          <h1 className="text-3xl font-serif tracking-tight">
            {lang === "zh" ? `标签：${tag}` : `Tag: ${tag}`}
          </h1>
          <p className="mt-2 font-serif" style={{ color: 'var(--text-secondary)' }}>
            {posts.length} {lang === "zh" ? "篇文章" : "posts"}
          </p>
        </div>

        {/* Posts List */}
        <div className="space-y-10">
          {posts.map((post) => (
            <article key={post.id} className="group">
              <Link href={`/posts/${post.id}/${lang}`}>
                <div className="text-sm mb-2 font-sans" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(post.date).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <h2 className="text-xl mb-2 font-serif group-hover:opacity-70 transition-opacity">
                  {lang === "zh" ? post.title : post.titleEn}
                </h2>
                <p className="leading-relaxed font-serif" style={{ color: 'var(--text-secondary)' }}>
                  {lang === "zh" ? post.excerpt : post.excerptEn}
                </p>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {(lang === "zh" ? post.tags : post.tagsEn).map((t) => (
                    <Link
                      key={t}
                      href={`/tags/${encodeURIComponent(t)}?lang=${lang}`}
                      className="text-xs px-2 py-1 rounded transition-colors hover:opacity-70"
                      style={{
                        backgroundColor: t === tag ? 'var(--text-primary)' : 'var(--bg-secondary)',
                        color: t === tag ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>

        <footer className="mt-20 pt-10 border-t text-center" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-sm font-sans" style={{ color: 'var(--text-secondary)' }}>
            © 2026 Clawdoo
          </p>
        </footer>
      </div>
    </main>
  );
}
