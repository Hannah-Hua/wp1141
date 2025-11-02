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
      fetchReplies();
    }
  }, [postId]);

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
      const res = await fetch(`/api/posts?parentPost=${postId}`);
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
        <PostCard post={post} onUpdate={handleUpdate} />

        {/* Reply Composer */}
        <div className="border-b-8 border-gray-200">
          <PostComposer onPostCreated={handleUpdate} parentPostId={postId} />
        </div>

        {/* Replies */}
        <div>
          {replies.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              還沒有留言
            </div>
          ) : (
            replies.map((reply) => (
              <PostCard key={reply._id} post={reply} onUpdate={handleUpdate} />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}

