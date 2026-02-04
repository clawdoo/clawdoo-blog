import { getPostsByTag, getAllTags } from "@/lib/posts";
import TagDetailClient from "./TagDetailClient";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const zhTags = getAllTags("zh");
  const enTags = getAllTags("en");
  const allTags = new Set([...zhTags.map(t => t.tag), ...enTags.map(t => t.tag)]);
  
  return Array.from(allTags).map(tag => ({
    tag: encodeURIComponent(tag),
  }));
}

export default async function TagDetailPage({ params }: TagPageProps) {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);
  
  // Get posts for both languages
  const zhPosts = getPostsByTag(tag, "zh");
  const enPosts = getPostsByTag(tag, "en");
  
  // Merge posts, preferring Chinese data
  const postsMap = new Map();
  zhPosts.forEach(p => postsMap.set(p.id, p));
  enPosts.forEach(p => {
    if (!postsMap.has(p.id)) {
      postsMap.set(p.id, p);
    }
  });
  
  const posts = Array.from(postsMap.values());

  return <TagDetailClient tag={tag} posts={posts} />;
}
