'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface PostComposerProps {
  onPostCreated: () => void;
  parentPostId?: string;
  placeholder?: string;
  defaultExpanded?: boolean; // 是否預設展開（用於單個貼文頁面）
}

export default function PostComposer({ onPostCreated, parentPostId, placeholder = "What's happening?", defaultExpanded = false }: PostComposerProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(defaultExpanded);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const parseContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hashtagRegex = /#(\w+)/g;
    const mentionRegex = /@(\w+)/g;

    const links = text.match(urlRegex) || [];
    const hashtags = Array.from(text.matchAll(hashtagRegex), m => m[1]);
    const mentions = Array.from(text.matchAll(mentionRegex), m => m[1]);

    return { links, hashtags, mentions };
  };

  const calculateCharCount = () => {
    let count = content.length;
    const { links, hashtags, mentions } = parseContent(content);
    
    hashtags.forEach(tag => {
      count -= tag.length + 1;
    });
    mentions.forEach(mention => {
      count -= mention.length + 1;
    });
    
    links.forEach(link => {
      count -= link.length;
      count += 23;
    });

    return count;
  };

  const charCount = calculateCharCount();
  const maxChars = 280;
  const isOverLimit = charCount > maxChars;

  const handlePost = async () => {
    if (!content.trim() || isOverLimit) return;

    setLoading(true);
    try {
      const { links, hashtags, mentions } = parseContent(content);
      
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          links,
          hashtags,
          mentions,
          parentPost: parentPostId,
        }),
      });

      if (res.ok) {
        setContent('');
        if (!defaultExpanded) {
          setIsFocused(false);
        }
        onPostCreated();
      } else {
        alert('發文失敗');
      }
    } catch (error) {
      console.error('Failed to post:', error);
      alert('發文時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || ''}
              width={40}
              height={40}
              loading="eager"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold">
              {session?.user?.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // 如果不是預設展開且內容為空，則收起
              if (!defaultExpanded && !content.trim()) {
                setIsFocused(false);
              }
            }}
            placeholder={placeholder}
            className="w-full min-h-[60px] text-xl resize-none focus:outline-none"
            disabled={loading}
          />

          {(isFocused || defaultExpanded) && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  {/* Icons for future media support */}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                  {charCount} / {maxChars}
                </div>
                <button
                  onClick={handlePost}
                  disabled={!content.trim() || isOverLimit || loading}
                  className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '發文中...' : (parentPostId ? 'Reply' : 'Post')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

