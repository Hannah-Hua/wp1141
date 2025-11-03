'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface EditProfileModalProps {
  user: any;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditProfileModal({ user, onClose, onUpdate }: EditProfileModalProps) {
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [website, setWebsite] = useState(user.website || '');
  const [birthday, setBirthday] = useState(user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '');
  const [loading, setLoading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(user.coverImage || null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.image || null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('背景圖大小不能超過 5MB');
        return;
      }
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('大頭貼大小不能超過 2MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let coverImageData = coverImagePreview;
      let avatarData = avatarPreview;

      // 如果有新上傳的圖片，轉換為 base64
      if (coverImageFile) {
        coverImageData = await convertFileToBase64(coverImageFile);
      }
      
      if (avatarFile) {
        avatarData = await convertFileToBase64(avatarFile);
      }

      const res = await fetch(`/api/users/${user.userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          bio: bio || '',
          website: website || '',
          birthday: birthday || null,
          image: avatarData,
          coverImage: coverImageData,
        }),
      });

      if (res.ok) {
        onUpdate();
        onClose();
      } else {
        const data = await res.json();
        alert(data.error || '更新失敗');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('更新時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-8">
            <button
              onClick={onClose}
              type="button"
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            <h2 className="text-xl font-bold">編輯個人資料</h2>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            type="button"
            className="bg-black text-white font-bold py-2 px-6 rounded-full hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? '儲存中...' : '儲存'}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          <div className="p-4">
            {/* Cover Image - 最底層 */}
            <div className="h-48 bg-gray-300 relative mb-20 rounded-lg group">
              {coverImagePreview && (
                <Image
                  src={coverImagePreview}
                  alt="Cover"
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              )}
              
              {/* 上傳背景圖按鈕 - 在 banner 右上角 */}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="absolute top-3 right-3 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-opacity z-10"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </button>

              {/* Avatar - 覆蓋在 banner 左下角，確保完整顯示 */}
              <div className="absolute -bottom-20 left-4 w-32 h-32 rounded-full border-4 border-white bg-gray-300 z-20 group/avatar" style={{ overflow: 'visible' }}>
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt={user.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-4xl font-bold rounded-full">
                    {user.name[0]?.toUpperCase()}
                  </div>
                )}
                
                {/* 上傳大頭貼按鈕 - 覆蓋在大頭貼上 */}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-full z-30"
                >
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  姓名
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  個人簡介
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  maxLength={160}
                  placeholder="介紹一下自己吧..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {bio.length} / 160
                </p>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  網站
                </label>
                <input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-2">
                  生日
                </label>
                <input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
