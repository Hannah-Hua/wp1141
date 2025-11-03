'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import PostCard from '@/components/PostCard';
import PostComposer from '@/components/PostComposer';

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  useEffect(() => {
    // 當 post 載入後再取得回覆（因為需要知道是否是 repost）
    if (post) {
      fetchReplies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    try {
      // 如果是 repost，查詢原始貼文的回覆；否則查詢當前貼文的回覆
      const targetPostId = post?.originalPost || postId;
      const res = await fetch(`/api/posts?parentPost=${targetPostId}`);
      if (res.ok) {
        const data = await res.json();
        setReplies(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch replies:', error);
    }
  };

  const handleUpdate = () => {
    fetchPost();
    fetchReplies();
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8 text-center">載入中...</div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="p-8 text-center">貼文不存在</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-4 py-3">
          <div className="flex items-center gap-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </button>
            <h1 className="text-xl font-bold">Post</h1>
          </div>
        </div>

        {/* Main Post */}
        <div className="border-b border-gray-200">
          <PostCard post={post} onUpdate={handleUpdate} disableClick={true} />
        </div>

        {/* Reply Composer */}
        <div className="border-b border-gray-200">
          <PostComposer 
            onPostCreated={handleUpdate} 
            parentPostId={post.originalPost || postId}
            placeholder="Post your reply"
            defaultExpanded={true}
          />
        </div>

        {/* Replies */}
        <div>
          {replies.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              還沒有留言
            </div>
          ) : (
            replies.map((reply) => (
              <div key={reply._id} className="border-b border-gray-200">
                <PostCard post={reply} onUpdate={handleUpdate} />
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}

