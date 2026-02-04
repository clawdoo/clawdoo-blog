import { getPostsByYear } from "@/lib/posts";
import TimelineClient from "./TimelineClient";

export default async function TimelinePage() {
  const yearGroups = getPostsByYear();

  return <TimelineClient yearGroups={yearGroups} />;
}
