'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import SafeImage from '@/components/SafeImage';
import MainLayout from '@/components/MainLayout';
import PostCard from '@/components/PostCard';
import EditProfileModal from '@/components/EditProfileModal';
import { getPusher } from '@/lib/pusher';

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const userId = params.userId as string;

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts');
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHoveringFollow, setIsHoveringFollow] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  const isOwnProfile = session?.user?.userId === userId;

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserPosts();
      fetchLikedPosts();
    }
  }, [userId]);

  // 監聽路由變化，當返回 Profile 頁面時重新載入貼文（確保看到最新的 like/repost 狀態）
  useEffect(() => {
    if (pathname?.startsWith('/profile/') && userId && pathname === `/profile/${userId}`) {
      // 返回 Profile 頁面時，重新載入貼文以確保顯示最新的狀態
      // 因為 like/repost API 會清除快取，所以這裡會從資料庫重新查詢
      console.log('[Profile] Returned to profile page, reloading posts to sync state');
      
      // 使用 setTimeout 避免與初始載入衝突
      const timer = setTimeout(() => {
        fetchUserPosts();
        if (isOwnProfile) {
          fetchLikedPosts();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [pathname, userId, isOwnProfile]);

  // 監聽 tab 切換，當切換到 likes tab 時重新載入 liked posts
  useEffect(() => {
    if (activeTab === 'likes' && isOwnProfile) {
      console.log('[Profile] Switched to likes tab, reloading liked posts');
      fetchLikedPosts();
    }
  }, [activeTab, isOwnProfile]);

  // 訂閱 Pusher 頻道以接收即時更新
  useEffect(() => {
    const pusher = getPusher();
    if (!pusher) {
      return;
    }

    const channel = pusher.subscribe('posts');

    channel.bind('post-updated', (data: any) => {
      console.log('[Profile] Pusher post-updated event:', data);
      
      const originalPostId = data.originalPostId || data.postId;
      
      if (originalPostId) {
        // 更新 posts 列表
        setPosts(prevPosts => {
          const updatedPosts = prevPosts.map(post => {
            const postOriginalId = post.originalPost || post._id;
            const postId = post._id;
            
            if (postOriginalId === originalPostId || postId === originalPostId) {
              const updatedPost = { ...post };
              if (data.likes) updatedPost.likes = data.likes;
              if (data.repostCount !== undefined) updatedPost.repostCount = data.repostCount;
              if (data.replies) updatedPost.replies = data.replies;
              console.log('[Profile] Pusher updated post in posts list:', updatedPost._id);
              return updatedPost;
            }
            return post;
          });
          return updatedPosts;
        });
        
        // 更新 likedPosts 列表（如果是自己的 Profile）
        if (isOwnProfile) {
          setLikedPosts(prevLikedPosts => {
            const updatedLikedPosts = prevLikedPosts.map(post => {
              const postOriginalId = post.originalPost || post._id;
              const postId = post._id;
              
              if (postOriginalId === originalPostId || postId === originalPostId) {
                const updatedPost = { ...post };
                if (data.likes) updatedPost.likes = data.likes;
                if (data.repostCount !== undefined) updatedPost.repostCount = data.repostCount;
                if (data.replies) updatedPost.replies = data.replies;
                console.log('[Profile] Pusher updated post in likedPosts list:', updatedPost._id);
                return updatedPost;
              }
              return post;
            });
            return updatedLikedPosts;
          });
        }
      }
    });

    channel.bind('post-deleted', (data: any) => {
      console.log('[Profile] Pusher post-deleted event:', data);
      if (data.postId) {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== data.postId));
        if (isOwnProfile) {
          setLikedPosts(prevPosts => prevPosts.filter(post => post._id !== data.postId));
        }
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [isOwnProfile]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        
        // 使用 API 返回的 isFollowing 狀態
        // 這個狀態是基於當前用戶的 following 列表，與 Follow API 邏輯一致
        if (!isOwnProfile && data.isFollowing !== undefined) {
          setIsFollowing(data.isFollowing);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await fetch(`/api/posts?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const fetchLikedPosts = async () => {
    if (!isOwnProfile) return;
    
    try {
      const res = await fetch(`/api/users/${userId}/likes`);
      if (res.ok) {
        const data = await res.json();
        setLikedPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch liked posts:', error);
    }
  };

  // 樂觀更新單個貼文（不重新載入整個列表）
  const handleUpdatePost = (postId: string, updates: any) => {
    console.log('[Profile] Updating post:', postId, updates);
    
    // 更新 posts 列表
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => {
        // 檢查是否為目標貼文（可能是原貼文或 repost）
        if (post._id === postId || post.originalPost === postId) {
          const updatedPost = { ...post, ...updates };
          console.log('[Profile] Updated post in posts list:', updatedPost._id);
          return updatedPost;
        }
        return post;
      });
      
      // 如果是自己的 Profile 且更新的是 likes，需要同步更新 likedPosts
      if (isOwnProfile && updates.likes) {
        const currentUserId = session?.user?.id;
        const isLiked = updates.likes.includes(currentUserId);
        
        // 找到被更新的貼文（可能是原貼文或 repost）
        const updatedPost = updatedPosts.find(p => p._id === postId || p.originalPost === postId);
        
        if (updatedPost) {
          // 找到原始貼文 ID（如果是 repost，使用 originalPost）
          const originalPostId = updatedPost.originalPost || updatedPost._id;
          
          setLikedPosts(prevLikedPosts => {
            const wasInLikedPosts = prevLikedPosts.some(p => {
              const likedPostOriginalId = p.originalPost || p._id;
              return likedPostOriginalId === originalPostId;
            });
            
            // 如果按讚了，且該貼文不在 likedPosts 中，需要加入
            if (isLiked && !wasInLikedPosts) {
              // 找到原始貼文（如果是 repost，需要找到原貼文；否則使用自己）
              const postToAdd = updatedPost.originalPost 
                ? updatedPosts.find(p => p._id === updatedPost.originalPost) || updatedPost
                : updatedPost;
              
              // 只添加原始貼文，不添加 repost
              if (!postToAdd.repostBy) {
                console.log('[Profile] Adding post to likedPosts:', postToAdd._id);
                return [postToAdd, ...prevLikedPosts].sort((a, b) => 
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
              }
            }
            
            // 如果取消按讚，且該貼文在 likedPosts 中，需要移除
            if (!isLiked && wasInLikedPosts) {
              console.log('[Profile] Removing post from likedPosts:', originalPostId);
              return prevLikedPosts.filter(p => {
                const likedPostOriginalId = p.originalPost || p._id;
                return likedPostOriginalId !== originalPostId;
              });
            }
            
            // 更新現有貼文
            return prevLikedPosts.map(post => {
              const postOriginalId = post.originalPost || post._id;
              if (postOriginalId === originalPostId) {
                const updatedLikedPost = { ...post, ...updates };
                console.log('[Profile] Updated post in likedPosts list:', updatedLikedPost._id);
                return updatedLikedPost;
              }
              return post;
            });
          });
        }
      }
      
      return updatedPosts;
    });
    
    // 更新 likedPosts 列表（如果是自己的 Profile 且不是 likes 更新）
    if (isOwnProfile && !updates.likes) {
      setLikedPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === postId || post.originalPost === postId) {
            const updatedPost = { ...post, ...updates };
            console.log('[Profile] Updated post in likedPosts list:', updatedPost._id);
            return updatedPost;
          }
          return post;
        })
      );
    }
  };

  // 移除貼文（用於刪除）
  const handleRemovePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    setLikedPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!session?.user?.id) {
      alert('請先登入');
      return;
    }
    
    if (isFollowingLoading) return; // 防止重複點擊
    
    setIsFollowingLoading(true);
    
    // 樂觀更新：立即更新 UI 狀態
    const wasFollowing = isFollowing;
    const newFollowingState = !wasFollowing;
    setIsFollowing(newFollowingState);
    
    try {
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        const nowFollowing = data.isFollowing;
        
        // 確保狀態正確（使用伺服器返回的狀態）
        setIsFollowing(nowFollowing);
        
        // 重新獲取用戶資料以更新 followers 數量
        await fetchUserProfile();
        
        // 標記 following 列表變化
        const timestamp = Date.now().toString();
        localStorage.setItem('followingChanged', timestamp);
        console.log('[Profile] Following changed:', { wasFollowing, nowFollowing, timestamp });
        
        // 如果是 unfollow，觸發自定義事件（用於同一頁面內的即時更新）
        if (wasFollowing && !nowFollowing) {
          console.log('[Profile] 🚫 Unfollowed user, dispatching event:', { userId: user._id, userDisplayId: userId });
          window.dispatchEvent(new CustomEvent('user-unfollowed', {
            detail: { 
              userId: user._id,
              userDisplayId: userId 
            }
          }));
        }
      } else {
        // 如果失敗，回滾狀態
        setIsFollowing(wasFollowing);
        const errorData = await res.json();
        alert(errorData.error || '操作失敗');
      }
    } catch (error) {
      // 如果失敗，回滾狀態
      setIsFollowing(wasFollowing);
      console.error('Failed to follow/unfollow:', error);
      alert('操作時發生錯誤');
    } finally {
      setIsFollowingLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8 text-center">載入中...</div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="p-8 text-center">用戶不存在</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-50 px-4 py-3">
          <div className="flex items-center gap-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm text-gray-500">{posts.length} posts</p>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="h-48 bg-gray-300 relative">
          {user.coverImage && (
            <SafeImage
              src={user.coverImage}
              alt="Cover"
              fill
              className="object-cover"
              sizes="100vw"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-4 relative" style={{ pointerEvents: 'none' }}>
          <div className="flex justify-between items-start -mt-16 mb-4">
            {/* 大頭貼 - 中間對齊背景圖底部，確保在背景圖上方，但低於 Header */}
            <div 
              className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 overflow-hidden relative z-10 cursor-pointer"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => {
                e.stopPropagation();
                // 可以點擊進入個人頁面
              }}
            >
              {user.image ? (
                <SafeImage
                  src={user.image}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-4xl font-bold">
                  {user.name[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* 按鈕區域 - 放在大頭貼同一行，右側對齊，與大頭貼底部對齊 */}
            <div className="flex items-end pt-20" style={{ pointerEvents: 'auto' }}>
              {/* Edit Profile 按鈕（自己的頁面才顯示） */}
              {isOwnProfile && !showEditModal && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEditModal(true);
                  }}
                  type="button"
                  className="px-4 py-1.5 bg-white border border-gray-300 rounded-full font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Edit profile
                </button>
              )}

              {/* Follow 按鈕（別人的頁面才顯示） */}
              {!isOwnProfile && (
                <button
                  onClick={handleFollow}
                  onMouseEnter={() => !isFollowingLoading && setIsHoveringFollow(true)}
                  onMouseLeave={() => setIsHoveringFollow(false)}
                  type="button"
                  disabled={isFollowingLoading}
                  className={`px-6 py-2 rounded-full font-bold transition-all ${
                    isFollowingLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isFollowing
                      ? isHoveringFollow
                        ? 'bg-red-100 bg-opacity-90 text-red-600 border border-red-500'
                        : 'bg-white text-black border border-gray-300'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {isFollowingLoading 
                    ? '處理中...'
                    : isFollowing 
                    ? (isHoveringFollow ? 'Unfollow' : 'Following')
                    : 'Follow'
                  }
                </button>
              )}
            </div>
          </div>

          <div style={{ pointerEvents: 'auto' }}>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-500">@{user.userId}</p>
            
            {user.bio && (
              <p className="mt-3 text-gray-900">{user.bio}</p>
            )}

            {/* Website */}
            {user.website && (
              <div className="mt-3">
                <a 
                  href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {user.website}
                </a>
              </div>
            )}

            {/* Birthday */}
            {user.birthday && (
              <div className="mt-2 text-gray-500 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                </svg>
                <span>生日：{new Date(user.birthday).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}

            <div className="flex gap-4 mt-3 text-sm">
              <div>
                <span className="font-bold">{user.following?.length || 0}</span>
                <span className="text-gray-500"> Following</span>
              </div>
              <div>
                <span className="font-bold">{user.followers?.length || 0}</span>
                <span className="text-gray-500"> Followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-4 font-bold hover:bg-gray-50 transition-colors ${
                activeTab === 'posts'
                  ? 'border-b-4 border-blue-500'
                  : 'text-gray-500'
              }`}
            >
              Posts
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab('likes')}
                className={`flex-1 py-4 font-bold hover:bg-gray-50 transition-colors ${
                  activeTab === 'likes'
                    ? 'border-b-4 border-blue-500'
                    : 'text-gray-500'
                }`}
              >
                Likes
              </button>
            )}
          </div>
        </div>

        {/* Posts/Likes */}
        <div>
          {activeTab === 'posts' ? (
            posts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                還沒有貼文
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
            )
          ) : (
            likedPosts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                還沒有按讚的貼文
              </div>
            ) : (
              likedPosts.map((post) => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  onUpdate={handleUpdatePost}
                  onRemove={handleRemovePost}
                />
              ))
            )
          )}
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={fetchUserProfile}
        />
      )}
    </MainLayout>
  );
}

