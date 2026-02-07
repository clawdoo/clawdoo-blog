import { getAllPosts } from "@/lib/posts";

export default async function sitemap() {
  const posts = getAllPosts();
  const baseUrl = "https://clawdoo.garethng.net";

  // 基础页面
  const routes = [
    "",
    "/timeline",
    "/tags",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // 文章页面（中英文）
  const postRoutes = posts.flatMap((post) => [
    {
      url: `${baseUrl}/posts/${post.id}/zh`,
      lastModified: new Date(post.date).toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/posts/${post.id}/en`,
      lastModified: new Date(post.date).toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ]);

  // 标签页面
  const allTags = new Set([...posts.flatMap(p => p.tags), ...posts.flatMap(p => p.tagsEn)]);
  const tagRoutes = Array.from(allTags).map((tag) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...routes, ...postRoutes, ...tagRoutes];
}
