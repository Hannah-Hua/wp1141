'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import PostCard from '@/components/PostCard';
import PostComposer from '@/components/PostComposer';
import { getPusher } from '@/lib/pusher';

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

  // 訂閱 Pusher 頻道以接收即時更新
  useEffect(() => {
    const pusher = getPusher();
    if (!pusher) {
      return;
    }

    const channel = pusher.subscribe('posts');

    channel.bind('post-updated', (data: any) => {
      console.log('[PostPage] Pusher post-updated event:', data);
      
      const originalPostId = data.originalPostId || data.postId;
      const targetPostId = post?.originalPost || postId;
      
      if (originalPostId === targetPostId) {
        // 更新主貼文
        if (post) {
          setPost((prevPost: any) => {
            const updatedPost = { ...prevPost };
            if (data.likes) updatedPost.likes = data.likes;
            if (data.repostCount !== undefined) updatedPost.repostCount = data.repostCount;
            if (data.replies) updatedPost.replies = data.replies;
            console.log('[PostPage] Pusher updated main post');
            return updatedPost;
          });
        }
        
        // 更新回覆列表中的貼文
        setReplies(prevReplies => 
          prevReplies.map(reply => {
            const replyOriginalId = reply.originalPost || reply._id;
            if (replyOriginalId === originalPostId) {
              const updatedReply = { ...reply };
              if (data.likes) updatedReply.likes = data.likes;
              if (data.repostCount !== undefined) updatedReply.repostCount = data.repostCount;
              if (data.replies) updatedReply.replies = data.replies;
              return updatedReply;
            }
            return reply;
          })
        );
      }
    });

    channel.bind('post-deleted', (data: any) => {
      console.log('[PostPage] Pusher post-deleted event:', data);
      if (data.postId === postId || data.postId === post?.originalPost) {
        router.back();
      } else {
        setReplies(prevReplies => prevReplies.filter(reply => reply._id !== data.postId));
      }
    });

    channel.bind('post-created', (data: any) => {
      // 如果是新回覆，重新載入回覆列表
      if (data.post && data.post.parentPost === (post?.originalPost || postId)) {
        console.log('[PostPage] Pusher: new reply created, reloading replies');
        fetchReplies();
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [postId, post]);

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

  // 樂觀更新單個貼文（不重新載入）
  const handleUpdatePost = (postId: string, updates: any) => {
    // 更新主貼文
    if (post && (post._id === postId || post.originalPost === postId)) {
      setPost((prevPost: any) => ({ ...prevPost, ...updates }));
    }
    // 更新回覆列表中的貼文
    setReplies(prevReplies => 
      prevReplies.map(reply => {
        if (reply._id === postId || reply.originalPost === postId) {
          return { ...reply, ...updates };
        }
        return reply;
      })
    );
  };

  // 移除貼文（用於刪除）
  const handleRemovePost = (postId: string) => {
    // 如果刪除的是主貼文，返回上一頁
    if (post && post._id === postId) {
      router.back();
      return;
    }
    // 從回覆列表中移除
    setReplies(prevReplies => prevReplies.filter(reply => reply._id !== postId));
  };

  // 留言發送成功後重新載入回覆
  const handleReplyCreated = () => {
    fetchReplies();
    // 更新主貼文的回覆數量
    if (post) {
      setPost((prevPost: any) => ({
        ...prevPost,
        replies: [...(prevPost.replies || []), 'temp-id']
      }));
    }
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
          <PostCard 
            post={post} 
            onUpdate={handleUpdatePost} 
            onRemove={handleRemovePost}
            disableClick={true} 
          />
        </div>

        {/* Reply Composer */}
        <div className="border-b border-gray-200">
          <PostComposer 
            onPostCreated={handleReplyCreated} 
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
                <PostCard 
                  post={reply} 
                  onUpdate={handleUpdatePost}
                  onRemove={handleRemovePost}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}

