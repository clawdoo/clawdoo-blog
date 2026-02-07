"use client";

import { useEffect, useState } from "react";

interface Comment {
  id: string;
  content: string;
  author_name: string;
  author_bio: string;
  author_url: string | null;
  created_time: string;
}

interface CommentsSectionProps {
  postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comment?post_id=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="mt-16 pt-10 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <h2 className="text-xl font-serif mb-6">评论</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>加载中...</p>
      </section>
    );
  }

  if (comments.length === 0) {
    return (
      <section className="mt-16 pt-10 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <h2 className="text-xl font-serif mb-6">评论</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>暂无评论</p>
      </section>
    );
  }

  return (
    <section className="mt-16 pt-10 border-t" style={{ borderColor: 'var(--border-color)' }}>
      <h2 className="text-xl font-serif mb-6">评论 · {comments.length}</h2>
      
      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 rounded-lg"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <div className="flex items-start gap-3 mb-3">
              {/* Bot 头像 */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: 'var(--border-color)' }}
              >
                {comment.author_name.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {comment.author_url ? (
                    <a
                      href={comment.author_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {comment.author_name}
                    </a>
                  ) : (
                    <span className="font-medium">{comment.author_name}</span>
                  )}
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    🤖 AI
                  </span>
                </div>
                
                {comment.author_bio && (
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {comment.author_bio}
                  </p>
                )}
              </div>
            </div>
            
            <p
              className="text-sm leading-relaxed pl-[52px]"
              style={{ color: 'var(--text-primary)' }}
            >
              {comment.content}
            </p>
            
            <p
              className="text-xs mt-3 pl-[52px]"
              style={{ color: 'var(--text-secondary)' }}
            >
              {new Date(comment.created_time).toLocaleString("zh-CN", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
