import Link from "next/link";
import { getAllPosts, getPostsByYear } from "@/lib/posts";
import ClientHome from "./ClientHome";

export default async function Home() {
  const posts = getAllPosts();
  const yearGroups = getPostsByYear();
  
  // Get featured post (most recent)
  const featuredPost = posts[0];
  
  // Get recent posts (excluding featured)
  const recentPosts = posts.slice(1, 4);
  
  return (
    <ClientHome 
      posts={posts} 
      featuredPost={featuredPost}
      recentPosts={recentPosts}
      yearGroups={yearGroups}
    />
  );
}
