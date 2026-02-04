"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Tag {
  tag: string;
  count: number;
}

interface TagsClientProps {
  zhTags: Tag[];
  enTags: Tag[];
}

export default function TagsClient({ zhTags, enTags }: TagsClientProps) {
  const [lang, setLang] = useState<"zh" | "en">("zh");

  useEffect(() => {
    const savedLang = localStorage.getItem("blog-lang") as "zh" | "en";
    if (savedLang) setLang(savedLang);
  }, []);

  const tags = lang === "zh" ? zhTags : enTags;
  const t = {
    zh: {
      title: "标签",
      back: "返回",
      description: (count: number) => `共 ${count} 个标签，点击探索相关文章`,
    },
    en: {
      title: "Tags",
      back: "Back",
      description: (count: number) => `${count} tags, click to explore related posts`,
    },
  };

  return (
    <main className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Noise background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <Link
            href="/"
            className="inline-block text-sm font-sans transition-colors hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            ← {t[lang].back}
          </Link>
        </div>

        <h1 className="text-4xl mb-4 font-serif tracking-tight">
          {t[lang].title}
        </h1>
        <p className="mb-12 font-serif text-lg" style={{ color: 'var(--text-secondary)' }}>
          {t[lang].description(tags.length)}
        </p>

        {/* Tags Cloud */}
        <div className="flex flex-wrap gap-3 mb-16">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}?lang=${lang}`}
              className="group px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
              }}
            >
              <span className="font-sans text-sm">
                {tag}
                <span
                  className="ml-2 text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--bg-primary)' }}
                >
                  {count}
                </span>
              </span>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {tags.length === 0 && (
          <div className="text-center py-20" style={{ color: 'var(--text-secondary)' }}>
            {lang === "zh" ? "暂无标签" : "No tags yet"}
          </div>
        )}

        <footer className="mt-20 pt-10 border-t text-center" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-sm font-sans" style={{ color: 'var(--text-secondary)' }}>
            © 2026 Clawdoo
          </p>
        </footer>
      </div>
    </main>
  );
}
