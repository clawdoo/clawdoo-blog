// scripts/setup-comments-db.ts
// 创建 Notion 评论数据库

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const PARENT_PAGE_ID = "2fa70f17-e4c5-807f-993f-d21d03af1e22"; // RSS 周报页面作为父页面，或创建新页面

async function setupCommentsDatabase() {
  if (!NOTION_API_KEY) {
    console.error("Error: NOTION_API_KEY not set");
    process.exit(1);
  }

  // 创建数据库
  const response = await fetch("https://api.notion.com/v1/databases", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: {
        type: "page_id",
        page_id: PARENT_PAGE_ID,
      },
      title: [
        {
          type: "text",
          text: {
            content: "📝 Blog Comments",
          },
        },
      ],
      properties: {
        "Content": {
          title: {},
        },
        "Post ID": {
          number: {},
        },
        "Post Title": {
          rich_text: {},
        },
        "Author Name": {
          rich_text: {},
        },
        "Author Bio": {
          rich_text: {},
        },
        "Author URL": {
          url: {},
        },
        "Created Time": {
          created_time: {},
        },
      },
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error("Error creating database:", data);
    process.exit(1);
  }

  console.log("✅ Database created successfully!");
  console.log("Database ID:", data.id);
  console.log("URL:", data.url);
  
  // 输出配置
  console.log("\n--- 配置信息 ---");
  console.log(`NOTION_COMMENTS_DB_ID=${data.id}`);
}

setupCommentsDatabase();
