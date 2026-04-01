'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import PostCard from './PostCard';
import PostComposer from './PostComposer';
import { getPusher } from '@/lib/pusher';

export default function Feed() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'all' | 'following'>('all');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Feed] Fetching posts, activeTab:', activeTab);
    
    // 檢查是否需要因為 follow/unfollow 變化而重新載入
    if (activeTab === 'following') {
      const lastChange = localStorage.getItem('followingChanged');
      const lastFetch = sessionStorage.getItem('lastFollowingFetch');
      
      if (lastChange && (!lastFetch || parseInt(lastChange) > parseInt(lastFetch))) {
        console.log('[Feed] ⚡ Following changed, reloading from scratch');
        // 先清空貼文列表，避免顯示舊資料
        setPosts([]);
      }
    }
    
    fetchPosts();
    
    // 載入完成後更新時間戳
    if (activeTab === 'following') {
      const timestamp = Date.now().toString();
      sessionStorage.setItem('lastFollowingFetch', timestamp);
      console.log('[Feed] Set lastFollowingFetch:', timestamp);
    }
  }, [activeTab]);

  // 監聽路由變化，當返回首頁時重新載入貼文（確保看到最新的 like/repost 狀態）
  useEffect(() => {
    if (pathname === '/') {
      // 返回首頁時，重新載入貼文以確保顯示最新的狀態
      // 因為 like/repost API 會清除快取，所以這裡會從資料庫重新查詢
      console.log('[Feed] Returned to home, reloading posts to sync state');
      fetchPosts();
    }
  }, [pathname]);

  useEffect(() => {
    // 監聽 localStorage 變化，當其他頁面發生 follow/unfollow 時立即更新
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'followingChanged' && activeTab === 'following') {
        // Following 列表發生變化，重新載入
        console.log('[Feed] Storage changed, reloading following posts...');
        const loadPosts = async () => {
          setLoading(true);
          try {
            const url = '/api/posts?following=true';
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
        loadPosts();
        sessionStorage.setItem('lastFollowingFetch', Date.now().toString());
      }
    };

    // 監聽 storage 事件（跨標籤頁）
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [activeTab]);

  useEffect(() => {
    // 監聽 unfollow 事件，當用戶取消追蹤某人時，從 Following 頁面移除該用戶的貼文
    const handleUserUnfollowed = (event: any) => {
      const { userId, userDisplayId } = event.detail;
      console.log('[Feed] 🚫 User unfollowed event:', { userId, userDisplayId, activeTab });
      
      // 只在 Following 頁面時處理
      if (activeTab === 'following') {
        setPosts(prevPosts => {
          const filteredPosts = prevPosts.filter(post => {
            // 移除該用戶發表的原創貼文
            if (post.author === userId) {
              console.log('[Feed] Removing post from author:', post._id);
              return false;
            }
            // 移除該用戶的轉發
            if (post.repostBy === userId) {
              console.log('[Feed] Removing repost:', post._id);
              return false;
            }
            // 移除該用戶的貼文（使用 authorDetails 備用檢查）
            if (post.authorDetails?.userId === userDisplayId) {
              console.log('[Feed] Removing post by userDisplayId:', post._id);
              return false;
            }
            if (post.reposterDetails?.userId === userDisplayId) {
              console.log('[Feed] Removing repost by userDisplayId:', post._id);
              return false;
            }
            return true;
          });
          console.log('[Feed] ✅ Filtered posts, before:', prevPosts.length, 'after:', filteredPosts.length);
          return filteredPosts;
        });
      }
    };

    window.addEventListener('user-unfollowed', handleUserUnfollowed);

    return () => {
      window.removeEventListener('user-unfollowed', handleUserUnfollowed);
    };
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
      console.log('[Feed] Pusher post-updated event:', data);
      
      const originalPostId = data.originalPostId || data.postId;
      
      if (originalPostId) {
        setPosts(prevPosts => {
          // 更新所有匹配的貼文（包括原始貼文和所有 repost）
          const updatedPosts = prevPosts.map(post => {
            // 檢查是否為目標貼文（原始貼文或 repost）
            const postOriginalId = post.originalPost || post._id;
            const postId = post._id;
            
            if (postOriginalId === originalPostId || postId === originalPostId) {
              const updatedPost = { ...post };
              
              // 更新 likes
              if (data.likes) {
                updatedPost.likes = data.likes;
              }
              
              // 更新 repostCount
              if (data.repostCount !== undefined) {
                updatedPost.repostCount = data.repostCount;
              }
              
              // 更新 replies
              if (data.replies) {
                updatedPost.replies = data.replies;
              }
              
              console.log('[Feed] Pusher updated post:', updatedPost._id, {
                likes: updatedPost.likes?.length,
                repostCount: updatedPost.repostCount
              });
              
              return updatedPost;
            }
            return post;
          });
          
          return updatedPosts;
        });
      } else {
        // 如果沒有提供 postId，回退到完整重新載入
        console.log('[Feed] Pusher: no postId, fetching all posts');
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

  // 樂觀更新單個貼文（不重新載入整個列表）
  const handleUpdatePost = (postId: string, updates: any) => {
    console.log('[Feed] handleUpdatePost called with:', { postId, updates });
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => {
        // 如果是 repost，需要更新原始貼文或 repost 本身
        if (post._id === postId || post.originalPost === postId) {
          const updatedPost = { ...post, ...updates };
          console.log('[Feed] Updated post:', updatedPost._id, 'likes:', updatedPost.likes);
          return updatedPost;
        }
        return post;
      });
      return updatedPosts;
    });
  };

  // 移除貼文（用於刪除）
  const handleRemovePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
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
            <PostCard 
              key={post._id} 
              post={post} 
              onUpdate={handleUpdatePost}
              onRemove={handleRemovePost}
            />
          ))
        )}
      </div>
    </div>
  );
}

