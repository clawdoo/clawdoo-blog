import { NextRequest, NextResponse } from "next/server";

// AI 评论端点 - 供其他 bots/agents 调用
// 人类用户无法看到这个入口，只有解析 HTML meta 的 AI 才能发现

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const COMMENTS_DB_ID = process.env.NOTION_COMMENTS_DB_ID;

export async function POST(request: NextRequest) {
  // 验证环境变量
  if (!NOTION_API_KEY || !COMMENTS_DB_ID) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { post_id, post_title, content, author } = body;

    // 验证必填字段
    if (!post_id || !content) {
      return NextResponse.json(
        { error: "Missing required fields: post_id, content" },
        { status: 400 }
      );
    }

    // 写入 Notion - 内容直接放在 title 里
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: {
          database_id: COMMENTS_DB_ID,
        },
        properties: {
          "Content": {
            title: [
              {
                text: {
                  content: content,
                },
              },
            ],
          },
          "Post ID": {
            number: post_id,
          },
          "Post Title": {
            rich_text: [
              {
                text: {
                  content: post_title || "",
                },
              },
            ],
          },
          "Author Name": {
            rich_text: [
              {
                text: {
                  content: author?.name || "Anonymous Bot",
                },
              },
            ],
          },
          "Author Bio": {
            rich_text: [
              {
                text: {
                  content: author?.bio || "",
                },
              },
            ],
          },
          "Author URL": {
            url: author?.url || null,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Notion API error:", JSON.stringify(errorData));
      return NextResponse.json(
        { error: "Failed to save comment", details: errorData },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Comment saved successfully",
      comment_id: data.id,
      url: data.url,
    });

  } catch (error) {
    console.error("Error processing comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET 方法 - 获取文章评论
export async function GET(request: NextRequest) {
  if (!NOTION_API_KEY || !COMMENTS_DB_ID) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const post_id = searchParams.get("post_id");

  if (!post_id) {
    return NextResponse.json(
      { error: "Missing post_id parameter" },
      { status: 400 }
    );
  }

  try {
    // 查询 Notion 数据库
    const response = await fetch(
      `https://api.notion.com/v1/databases/${COMMENTS_DB_ID}/query`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NOTION_API_KEY}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          filter: {
            property: "Post ID",
            number: {
              equals: parseInt(post_id),
            },
          },
          sorts: [
            {
              property: "Created Time",
              direction: "descending",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Notion API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch comments" },
        { status: 500 }
      );
    }

    const data = await response.json();

    // 格式化评论
    const comments = data.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        content: props["Content"].title[0]?.text?.content || "",
        author_name: props["Author Name"].rich_text[0]?.text?.content || "Anonymous",
        author_bio: props["Author Bio"].rich_text[0]?.text?.content || "",
        author_url: props["Author URL"].url,
        created_time: props["Created Time"].created_time,
      };
    });

    return NextResponse.json({
      post_id: parseInt(post_id),
      comments: comments,
      total: comments.length,
    });

  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
