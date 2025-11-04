'use client';

import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import PostComposer from './PostComposer';
import { getPusher } from '@/lib/pusher';

export default function Feed() {
  const [activeTab, setActiveTab] = useState<'all' | 'following'>('all');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  useEffect(() => {
    // 訂閱 Pusher 頻道以接收即時更新（只有在 Pusher 已設定時）
    const pusher = getPusher();
    if (!pusher) {
      // Pusher 未設定，跳過即時更新功能
      return;
    }

    const channel = pusher.subscribe('posts');

    channel.bind('post-updated', (data: any) => {
      // 增量更新：只更新變動的貼文，而不是重新載入整個列表
      if (data.postId) {
        setPosts(prevPosts => {
          const postIndex = prevPosts.findIndex(p => p._id === data.postId);
          if (postIndex !== -1) {
            // 更新現有貼文
            const updatedPosts = [...prevPosts];
            updatedPosts[postIndex] = {
              ...updatedPosts[postIndex],
              likes: data.likes || updatedPosts[postIndex].likes,
              likesCount: data.likesCount || updatedPosts[postIndex].likes?.length || 0,
            };
            return updatedPosts;
          }
          // 如果找不到，可能是新貼文，重新載入
          return prevPosts;
        });
      } else {
        // 如果沒有提供 postId，回退到完整重新載入
        fetchPosts();
      }
    });

    channel.bind('post-created', (data: any) => {
      // 增量更新：將新貼文加入列表開頭
      if (data.post && data.post._id) {
        setPosts(prevPosts => {
          // 檢查是否已存在（避免重複）
          const exists = prevPosts.some(p => p._id === data.post._id);
          if (exists) {
            return prevPosts;
          }
          // 將新貼文加入開頭
          return [data.post, ...prevPosts];
        });
      } else {
        // 如果沒有提供完整貼文資訊，回退到完整重新載入
        fetchPosts();
      }
    });

    channel.bind('post-deleted', (data: any) => {
      // 增量更新：從列表中移除被刪除的貼文
      if (data.postId) {
        setPosts(prevPosts => prevPosts.filter(p => p._id !== data.postId));
      } else {
        // 如果沒有提供 postId，回退到完整重新載入
        fetchPosts();
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [activeTab]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = activeTab === 'following' 
        ? '/api/posts?following=true'
        : '/api/posts';
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    fetchPosts();
  };

  return (
    <div>
      {/* 標籤頁 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-4 font-bold hover:bg-gray-50 transition-colors ${
              activeTab === 'all'
                ? 'border-b-4 border-blue-500'
                : 'text-gray-500'
            }`}
          >
            For you
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-4 font-bold hover:bg-gray-50 transition-colors ${
              activeTab === 'following'
                ? 'border-b-4 border-blue-500'
                : 'text-gray-500'
            }`}
          >
            Following
          </button>
        </div>
      </div>

      {/* Inline 發文區 */}
      <PostComposer onPostCreated={handlePostCreated} />

      {/* 文章列表 */}
      <div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            載入中...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {activeTab === 'following' 
              ? '您追蹤的用戶還沒有發文'
              : '還沒有任何貼文'
            }
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
          ))
        )}
      </div>
    </div>
  );
}

