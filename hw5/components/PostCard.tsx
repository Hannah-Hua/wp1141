'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PostModal from './PostModal';

interface PostCardProps {
  post: any;
  onUpdate: () => void;
}

export default function PostCard({ post, onUpdate }: PostCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isReposting, setIsReposting] = useState(false);

  const isLiked = post.likes?.includes(session?.user?.id);
  const isOwnPost = post.author === session?.user?.id && !post.repostBy;

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
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return part;
      const segments = part.split(mentionRegex);
      return segments.map((segment, i) => {
        if (i > 0 && i % 2 === 1) {
          return (
            <span
              key={`mention-${i}`}
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
    if (isLiking) return;

    setIsLiking(true);
    try {
      const res = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
      });

      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleRepost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isReposting) return;

    setIsReposting(true);
    try {
      const res = await fetch(`/api/posts/${post._id}/repost`, {
        method: 'POST',
      });

      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to repost:', error);
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
        onUpdate();
      } else {
        alert('刪除失敗');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('刪除時發生錯誤');
    }
  };

  const handleCardClick = () => {
    router.push(`/post/${post._id}`);
  };

  return (
    <>
      <article
        className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={handleCardClick}
      >
        {post.repostBy && (
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2 ml-8">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            </svg>
            <span>{post.authorDetails?.name} 轉發了</span>
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
              <Image
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
                <span className="text-sm">{post.replies?.length || 0}</span>
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
                <span className="text-sm">0</span>
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
                <span className="text-sm">{post.likes?.length || 0}</span>
              </button>
            </div>
          </div>
        </div>
      </article>

      {showReplyModal && (
        <PostModal
          onClose={() => setShowReplyModal(false)}
          parentPostId={post._id}
          isReply={true}
        />
      )}
    </>
  );
}

