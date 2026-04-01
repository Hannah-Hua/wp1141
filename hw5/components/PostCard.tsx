'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SafeImage from '@/components/SafeImage';
import PostModal from './PostModal';

interface PostCardProps {
  post: any;
  onUpdate?: (postId: string, updates: any) => void;
  onRemove?: (postId: string) => void;
  disableClick?: boolean; // 是否禁用點擊跳轉（用於單個貼文頁面的主貼文）
}

export default function PostCard({ post, onUpdate, onRemove, disableClick = false }: PostCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isReposting, setIsReposting] = useState(false);
  
  // 使用本地狀態來實現即時更新
  const [localLikes, setLocalLikes] = useState(post.likes || []);
  const [localReplyCount, setLocalReplyCount] = useState(post.replies?.length || 0);
  const [localRepostCount, setLocalRepostCount] = useState(post.repostCount || 0);

  const isLiked = localLikes?.includes(session?.user?.id);
  const isOwnPost = post.author === session?.user?.id && !post.repostBy;

  // 同步外部更新（例如 Pusher 事件）
  // 但要避免覆蓋正在進行的樂觀更新
  useEffect(() => {
    // 只有在不進行操作時，才同步外部更新
    // 這樣可以避免 API 返回前的舊資料覆蓋樂觀更新
    if (!isLiking && !isReposting) {
      setLocalLikes(post.likes || []);
      setLocalReplyCount(post.replies?.length || 0);
      setLocalRepostCount(post.repostCount || 0);
    }
  }, [post.likes, post.replies, post.repostCount, isLiking, isReposting]);

  const formatTimestamp = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}秒`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分鐘`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小時`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天`;
    
    const month = postDate.getMonth() + 1;
    const day = postDate.getDate();
    if (postDate.getFullYear() === now.getFullYear()) {
      return `${month}月${day}日`;
    }
    return `${postDate.getFullYear()}年${month}月${day}日`;
  };

  const renderContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hashtagRegex = /#(\w+)/g;
    const mentionRegex = /@(\w+)/g;

    let parts: any[] = [text];

    // Process URLs
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return part;
      const segments = part.split(urlRegex);
      return segments.map((segment, i) => {
        if (urlRegex.test(segment)) {
          return (
            <a
              key={`url-${i}`}
              href={segment}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {segment}
            </a>
          );
        }
        return segment;
      });
    });

    // Process hashtags
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return part;
      const segments = part.split(hashtagRegex);
      return segments.map((segment, i) => {
        const prevSegment = segments[i - 1];
        if (i > 0 && i % 2 === 1) {
          return (
            <span key={`hashtag-${i}`} className="text-blue-500 hover:underline cursor-pointer">
              #{segment}
            </span>
          );
        }
        return segment;
      });
    });

    // Process mentions
    parts = parts.flatMap((part, partIndex) => {
      if (typeof part !== 'string') return part;
      const segments = part.split(mentionRegex);
      return segments.map((segment, i) => {
        if (i > 0 && i % 2 === 1) {
          return (
            <span
              key={`mention-${partIndex}-${i}-${segment}`}
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/profile/${segment}`);
              }}
            >
              @{segment}
            </span>
          );
        }
        return segment;
      });
    });

    return parts;
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking || !session?.user?.id) return;

    setIsLiking(true);
    
    // 樂觀更新：立即更新 UI
    const userId = session.user.id;
    const wasLiked = isLiked;
    const newLikes = wasLiked 
      ? localLikes.filter(id => id !== userId)
      : [...localLikes, userId];
    
    setLocalLikes(newLikes);

    try {
      // 如果是 repost，應該對原始貼文進行 like 操作
      const targetPostId = post.originalPost || post._id;
      
      const res = await fetch(`/api/posts/${targetPostId}/like`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        console.log('[PostCard] Like API response:', data);
        
        // 使用伺服器返回的最新狀態來設置最終狀態
        const finalLikes = data.isLiked 
          ? (newLikes.includes(userId) ? newLikes : [...newLikes, userId])
          : newLikes.filter(id => id !== userId);
        
        setLocalLikes(finalLikes);
        
        // 通知父元件更新
        if (onUpdate) {
          console.log('[PostCard] Calling onUpdate with:', { postId: targetPostId, likes: finalLikes });
          onUpdate(targetPostId, { likes: finalLikes });
        }
      } else {
        // 如果失敗，回滾更新
        console.error('[PostCard] Like API failed');
        setLocalLikes(localLikes);
      }
    } catch (error) {
      console.error('[PostCard] Failed to like post:', error);
      // 回滾更新
      setLocalLikes(localLikes);
    } finally {
      setIsLiking(false);
    }
  };

  const handleRepost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isReposting) return;

    setIsReposting(true);
    
    // 樂觀更新：立即增加轉發數
    const newRepostCount = localRepostCount + 1;
    setLocalRepostCount(newRepostCount);

    try {
      // 如果是 repost，應該對原始貼文進行 repost 操作
      const targetPostId = post.originalPost || post._id;
      
      const res = await fetch(`/api/posts/${targetPostId}/repost`, {
        method: 'POST',
      });

      if (res.ok) {
        // 通知父元件更新
        if (onUpdate) {
          onUpdate(targetPostId, { repostCount: newRepostCount });
        }
        // 轉發成功後，清除快取以確保新貼文會出現
        // 不需要手動刷新，Pusher 會處理即時更新
        console.log('[PostCard] Repost successful, cache should be cleared by API');
      } else {
        // 如果失敗，回滾更新
        const data = await res.json();
        if (data.error === 'Already reposted') {
          alert('您已經轉發過這篇貼文');
        }
        setLocalRepostCount(localRepostCount);
      }
    } catch (error) {
      console.error('Failed to repost:', error);
      // 回滾更新
      setLocalRepostCount(localRepostCount);
    } finally {
      setIsReposting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('確定要刪除這則貼文嗎？')) return;

    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // 立即從 UI 移除
        if (onRemove) {
          onRemove(post._id);
        }
      } else {
        alert('刪除失敗');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('刪除時發生錯誤');
    }
  };

  const handleCardClick = () => {
    if (!disableClick) {
      router.push(`/post/${post._id}`);
    }
  };

  return (
    <>
      <article
        className={`border-b border-gray-200 p-4 transition-colors ${
          disableClick ? '' : 'hover:bg-gray-50 cursor-pointer'
        }`}
        onClick={handleCardClick}
      >
        {post.repostBy && post.reposterDetails && (
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2 ml-8">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            </svg>
            <span>{post.reposterDetails.name} 轉發了</span>
          </div>
        )}

        <div className="flex gap-3">
          <div
            className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/profile/${post.authorDetails?.userId}`);
            }}
          >
            {post.authorDetails?.image ? (
              <SafeImage
                src={post.authorDetails.image}
                alt={post.authorDetails.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold">
                {post.authorDetails?.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span
                  className="font-bold hover:underline cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/profile/${post.authorDetails?.userId}`);
                  }}
                >
                  {post.authorDetails?.name}
                </span>
                <span className="text-gray-500">
                  @{post.authorDetails?.userId}
                </span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">{formatTimestamp(post.createdAt)}</span>
              </div>

              {isOwnPost && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(!showMenu);
                    }}
                    className="p-2 hover:bg-blue-50 hover:text-blue-500 rounded-full"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                        className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 whitespace-nowrap"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-gray-900 mb-3">
              {renderContent(post.content)}
            </div>

            <div className="flex items-center justify-between max-w-md">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReplyModal(true);
                }}
                className="flex items-center gap-2 text-gray-500 hover:text-blue-500 group"
              >
                <div className="p-2 rounded-full group-hover:bg-blue-50">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
                  </svg>
                </div>
                <span className="text-sm">{localReplyCount}</span>
              </button>

              <button
                onClick={handleRepost}
                disabled={isReposting}
                className="flex items-center gap-2 text-gray-500 hover:text-green-500 group"
              >
                <div className="p-2 rounded-full group-hover:bg-green-50">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                  </svg>
                </div>
                <span className="text-sm">{localRepostCount}</span>
              </button>

              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-2 group ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <div className="p-2 rounded-full group-hover:bg-red-50">
                  <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <span className="text-sm">{localLikes.length}</span>
              </button>
            </div>
          </div>
        </div>
      </article>

      {showReplyModal && (
        <PostModal
          onClose={() => setShowReplyModal(false)}
          parentPostId={post.originalPost || post._id}
          isReply={true}
          onSuccess={() => {
            // 留言成功後，立即增加回覆數
            const newReplyCount = localReplyCount + 1;
            setLocalReplyCount(newReplyCount);
            if (onUpdate) {
              onUpdate(post.originalPost || post._id, { 
                replies: [...(post.replies || []), 'temp-id'] 
              });
            }
          }}
        />
      )}
    </>
  );
}

