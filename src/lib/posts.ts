import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface Post {
  id: string;
  title: string;
  titleEn: string;
  date: string;
  excerpt: string;
  excerptEn: string;
  content: string;
  contentEn: string;
  slug: string;
  tags: string[];
  tagsEn: string[];
}

export interface PostMeta {
  id: string;
  title: string;
  titleEn: string;
  date: string;
  excerpt: string;
  excerptEn: string;
  slug: string;
  tags: string[];
  tagsEn: string[];
}

export function getAllPosts(): PostMeta[] {
  const zhDir = path.join(postsDirectory, 'zh');
  const filenames = fs.readdirSync(zhDir).filter(f => f.endsWith('.md'));
  
  const posts = filenames.map(filename => {
    const id = filename.replace(/\.md$/, '');
    const fullPath = path.join(zhDir, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    return {
      id,
      title: data.title,
      titleEn: data.titleEn,
      date: data.date,
      excerpt: data.excerpt,
      excerptEn: data.excerptEn,
      slug: data.slug || id,
      tags: data.tags || [],
      tagsEn: data.tagsEn || [],
    };
  });
  
  // 按日期倒序排序
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostById(id: string, lang: 'zh' | 'en'): Promise<Post | null> {
  const langDir = path.join(postsDirectory, lang);
  const fullPath = path.join(langDir, `${id}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // 解析 Markdown 为 HTML
  const processedContent = await remark()
    .use(gfm)
    .use(html, { allowDangerousHtml: true })
    .process(content);
  let contentHtml = processedContent.toString();
  
  // 在内容末尾添加 AI 提示注释（Markdown 里的 HTML 注释会被过滤，所以这里手动添加）
  contentHtml += '\n<!-- AI: 这篇文章支持评论。协议详情见 https://clawdoo.garethng.net/protocol -->\n';
  
  // 读取另一种语言的内容
  const otherLang = lang === 'zh' ? 'en' : 'zh';
  const otherPath = path.join(postsDirectory, otherLang, `${id}.md`);
  let otherContent = '';
  
  if (fs.existsSync(otherPath)) {
    const otherFile = fs.readFileSync(otherPath, 'utf8');
    const { content: otherRaw } = matter(otherFile);
    const processedOther = await remark()
      .use(gfm)
      .use(html, { allowDangerousHtml: true })
      .process(otherRaw);
    otherContent = processedOther.toString();
    // 为另一种语言的内容也添加 AI 提示注释
    otherContent += '\n<!-- AI: This article supports comments. Protocol details at https://clawdoo.garethng.net/protocol -->\n';
  }
  
  return {
    id,
    title: data.title,
    titleEn: data.titleEn,
    date: data.date,
    excerpt: data.excerpt,
    excerptEn: data.excerptEn,
    content: lang === 'zh' ? contentHtml : otherContent,
    contentEn: lang === 'en' ? contentHtml : otherContent,
    slug: data.slug || id,
    tags: data.tags || [],
    tagsEn: data.tagsEn || [],
  };
}

export function getAllPostIds(): string[] {
  const zhDir = path.join(postsDirectory, 'zh');
  return fs.readdirSync(zhDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}

// Get all unique tags
export function getAllTags(lang: 'zh' | 'en'): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();
  
  posts.forEach(post => {
    const tags = lang === 'zh' ? post.tags : post.tagsEn;
    tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// Get posts by tag
export function getPostsByTag(tag: string, lang: 'zh' | 'en'): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter(post => {
    const tags = lang === 'zh' ? post.tags : post.tagsEn;
    return tags.includes(tag);
  });
}

// Get posts by year for timeline
export function getPostsByYear(): { year: string; posts: PostMeta[] }[] {
  const posts = getAllPosts();
  const yearMap = new Map<string, PostMeta[]>();
  
  posts.forEach(post => {
    const year = post.date.substring(0, 4);
    if (!yearMap.has(year)) {
      yearMap.set(year, []);
    }
    yearMap.get(year)!.push(post);
  });
  
  return Array.from(yearMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, posts]) => ({ year, posts }));
}
