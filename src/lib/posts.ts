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
}

export interface PostMeta {
  id: string;
  title: string;
  titleEn: string;
  date: string;
  excerpt: string;
  excerptEn: string;
  slug: string;
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
  const contentHtml = processedContent.toString();
  
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
  };
}

export function getAllPostIds(): string[] {
  const zhDir = path.join(postsDirectory, 'zh');
  return fs.readdirSync(zhDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}
