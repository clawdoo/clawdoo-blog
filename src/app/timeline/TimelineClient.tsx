"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

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

interface YearGroup {
  year: string;
  posts: Post[];
}

interface TimelineClientProps {
  yearGroups: YearGroup[];
}

export default function TimelineClient({ yearGroups }: TimelineClientProps) {
  const [lang, setLang] = useState<"zh" | "en">("zh");

  useEffect(() => {
    const savedLang = localStorage.getItem("blog-lang") as "zh" | "en";
    if (savedLang) setLang(savedLang);
  }, []);

  const totalPosts = yearGroups.reduce((acc, g) => acc + g.posts.length, 0);
  const t = {
    zh: {
      title: "时间线",
      back: "返回",
      description: `${totalPosts} 篇文章，横跨 ${yearGroups.length} 年`,
      posts: "篇",
    },
    en: {
      title: "Timeline",
      back: "Back",
      description: `${totalPosts} posts across ${yearGroups.length} year${yearGroups.length > 1 ? 's' : ''}`,
      posts: "posts",
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

      <div className="relative max-w-2xl mx-auto px-6 py-16">
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
          {t[lang].description}
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{ backgroundColor: 'var(--border-color)' }}
          />

          {yearGroups.map(({ year, posts }) => (
            <div key={year} className="relative pl-8 pb-12 last:pb-0">
              {/* Year marker */}
              <div
                className="absolute left-0 top-0 w-3 h-3 -translate-x-1.5 rounded-full border-2"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--text-secondary)',
                }}
              />

              {/* Year label */}
              <h2 className="text-2xl font-serif mb-6 -mt-1">
                {year}
                <span
                  className="ml-3 text-sm font-sans"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {posts.length} {t[lang].posts}
                </span>
              </h2>

              {/* Posts in this year */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <article key={post.id} className="group">
                    <Link href={`/posts/${post.id}/${lang}`}>
                      <div className="flex items-baseline gap-4">
                        <span
                          className="text-sm font-sans whitespace-nowrap"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {new Date(post.date).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <h3 className="font-serif group-hover:opacity-70 transition-opacity">
                          {lang === "zh" ? post.title : post.titleEn}
                        </h3>
                      </div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-2 ml-16">
                        {(lang === "zh" ? post.tags : post.tagsEn).slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: 'var(--bg-secondary)',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
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
