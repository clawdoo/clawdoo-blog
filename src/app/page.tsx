import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import ClientHome from "./ClientHome";

export default async function Home() {
  const posts = getAllPosts();
  
  return <ClientHome posts={posts} />;
}
