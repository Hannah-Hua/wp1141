'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import PostModal from './PostModal';

export default function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  // 點擊外部時收起選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <>
      <div className="w-64 h-screen sticky top-0 flex flex-col p-4">
        {/* Logo */}
        <div className="mb-4">
          <button onClick={() => router.push('/')} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
            <span className="text-3xl font-bold">𝕏</span>
          </button>
        </div>

        {/* 選單項目 */}
        <nav className="flex-1 space-y-2">
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-4 p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18.9c-4.07-.93-7-4.93-7-9.4V8.77l7-3.85 7 3.85V11.5c0 4.47-2.93 8.47-7 9.4z"/>
            </svg>
            <span className="text-xl font-medium">Home</span>
          </button>

          <button
            onClick={() => router.push(`/profile/${session?.user?.userId}`)}
            className="w-full flex items-center gap-4 p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="text-xl font-medium">Profile</span>
          </button>
        </nav>

        {/* Post 按鈕 */}
        <button
          onClick={() => setShowPostModal(true)}
          className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-600 transition-colors mb-4"
        >
          Post
        </button>

        {/* 用戶資訊 */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
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
            <div className="flex-1 text-left">
              <div className="font-bold text-sm truncate">{session?.user?.name}</div>
              <div className="text-gray-500 text-sm truncate">@{session?.user?.userId}</div>
            </div>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>

          {/* 登出選單 */}
          {showUserMenu && (
            <div className="absolute bottom-full mb-2 left-0 right-0 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 font-bold"
              >
                Log out @{session?.user?.userId}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <PostModal onClose={() => setShowPostModal(false)} />
      )}
    </>
  );
}

