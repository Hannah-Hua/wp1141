'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface PostModalProps {
  onClose: () => void;
  parentPostId?: string;
  isReply?: boolean;
}

export default function PostModal({ onClose, parentPostId, isReply = false }: PostModalProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [drafts, setDrafts] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // 自動 focus
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    // 載入草稿
    if (showDrafts) {
      fetchDrafts();
    }
  }, [showDrafts]);

  const fetchDrafts = async () => {
    try {
      const res = await fetch('/api/drafts');
      if (res.ok) {
        const data = await res.json();
        setDrafts(data.drafts || []);
      }
    } catch (error) {
      console.error('Failed to fetch drafts:', error);
    }
  };

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
    
    // 移除 hashtags 和 mentions 的字數
    hashtags.forEach(tag => {
      count -= tag.length + 1; // +1 for the # symbol
    });
    mentions.forEach(mention => {
      count -= mention.length + 1; // +1 for the @ symbol
    });
    
    // 連結固定算 23 字元
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
        onClose();
        // 重新載入頁面以顯示新貼文
        window.location.reload();
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

  const handleSaveDraft = async () => {
    if (!content.trim()) return;

    try {
      const res = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (res.ok) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const handleClose = () => {
    if (content.trim()) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const handleLoadDraft = (draft: any) => {
    setContent(draft.content);
    setShowDrafts(false);
  };

  const handleDeleteDraft = async (draftId: string) => {
    try {
      await fetch(`/api/drafts/${draftId}`, {
        method: 'DELETE',
      });
      fetchDrafts();
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  if (showDrafts) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold">草稿</h2>
            <button
              onClick={() => setShowDrafts(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          <div className="p-4">
            {drafts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">沒有草稿</p>
            ) : (
              <div className="space-y-4">
                {drafts.map((draft) => (
                  <div key={draft._id} className="border border-gray-200 rounded-lg p-4">
                    <p className="mb-2">{draft.content}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoadDraft(draft)}
                        className="text-blue-500 hover:text-blue-600 text-sm"
                      >
                        載入
                      </button>
                      <button
                        onClick={() => handleDeleteDraft(draft._id)}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showDiscardConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl max-w-sm w-full p-6">
          <h3 className="text-xl font-bold mb-4">要放棄貼文嗎？</h3>
          <p className="text-gray-600 mb-6">你可以儲存此貼文為草稿。</p>
          <div className="space-y-3">
            <button
              onClick={handleSaveDraft}
              className="w-full py-3 px-4 border border-gray-300 rounded-full font-bold hover:bg-gray-50"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 border border-gray-300 rounded-full font-bold text-red-500 hover:bg-red-50"
            >
              Discard
            </button>
            <button
              onClick={() => setShowDiscardConfirm(false)}
              className="w-full py-3 px-4 bg-black text-white rounded-full font-bold hover:bg-gray-800"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
          <button
            onClick={() => setShowDrafts(true)}
            className="text-blue-500 hover:text-blue-600 font-medium text-sm"
          >
            Drafts
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || ''}
                  width={40}
                  height={40}
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
                placeholder={isReply ? "貼上你的回覆" : "What's happening?"}
                className="w-full min-h-[120px] text-xl resize-none focus:outline-none"
                disabled={loading}
              />

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
                    {loading ? '發文中...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

