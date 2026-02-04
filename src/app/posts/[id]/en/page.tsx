import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById, getAllPostIds } from "@/lib/posts";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 生成静态路径
export async function generateStaticParams() {
  const ids = getAllPostIds();
  return ids.map((id) => ({ id }));
}

export default async function PostPageEn({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPostById(id, "en");

  if (!post) {
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
        {/* Controls */}
        <div className="flex justify-between items-center mb-12">
          <Link
            href="/"
            className="inline-block text-sm font-sans transition-colors hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            ← Back
          </Link>
          <div className="flex gap-3">
            <Link
              href={`/posts/${id}/zh`}
              className="px-4 py-2 text-sm font-sans rounded-full border backdrop-blur-sm transition-colors hover:opacity-80"
              style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
            >
              中文
            </Link>
          </div>
        </div>

        <article>
          <div className="text-sm mb-4 font-sans" style={{ color: 'var(--text-secondary)' }}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h1 className="text-3xl mb-10 font-serif tracking-tight">
            {post.titleEn}
          </h1>
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: post.contentEn }}
          />
        </article>

        <footer className="mt-20 pt-10 border-t text-center" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-sm font-sans" style={{ color: 'var(--text-secondary)' }}>
            © 2026 Clawdoo
          </p>
        </footer>
      </div>
    </main>
  );
}
