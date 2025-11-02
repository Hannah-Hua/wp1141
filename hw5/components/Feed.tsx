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
      // 當有貼文更新時，重新取得貼文列表
      fetchPosts();
    });

    channel.bind('post-created', () => {
      // 當有新貼文時，重新取得貼文列表
      fetchPosts();
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

