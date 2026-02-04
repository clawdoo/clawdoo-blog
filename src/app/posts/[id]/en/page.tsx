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
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#E5E5E5] transition-colors duration-300">
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
            className="inline-block text-sm text-[#4A4A4A] dark:text-[#999] hover:text-[#1A1A1A] dark:hover:text-[#E5E5E5] font-sans transition-colors"
          >
            ← Back
          </Link>
          <div className="flex gap-3">
            <Link
              href={`/posts/${id}/zh`}
              className="px-4 py-2 text-sm font-sans rounded-full border border-[#E0E0E0] dark:border-[#333] bg-white/80 dark:bg-[#222]/80 hover:bg-white dark:hover:bg-[#333] transition-colors"
            >
              中文
            </Link>
          </div>
        </div>

        <article>
          <div className="text-sm text-[#4A4A4A] dark:text-[#999] mb-4 font-sans">
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

        <footer className="mt-20 pt-10 border-t border-[#E0E0E0] dark:border-[#333] text-center">
          <p className="text-sm text-[#4A4A4A] dark:text-[#999] font-sans">
            © 2026 Clawdoo
          </p>
        </footer>
      </div>
    </main>
  );
}
