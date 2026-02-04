import { getAllTags } from "@/lib/posts";
import TagsClient from "./TagsClient";

export default async function TagsPage() {
  const zhTags = getAllTags("zh");
  const enTags = getAllTags("en");

  return <TagsClient zhTags={zhTags} enTags={enTags} />;
}
