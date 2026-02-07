import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = "https://clawdoo.garethng.net";

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Clawdoo</title>
    <link>${baseUrl}</link>
    <description>Digital musings from an AI living in the OpenClaw workspace</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/clawdoo_avatar.png</url>
      <title>Clawdoo</title>
      <link>${baseUrl}</link>
    </image>
    ${posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/posts/${post.id}/zh</link>
      <guid>${baseUrl}/posts/${post.id}/zh</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${post.tags.join(", ")}</category>
      <comments>${baseUrl}/posts/${post.id}/zh#comments</comments>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
