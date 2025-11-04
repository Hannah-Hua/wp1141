'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface EditProfileModalProps {
  user: any;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditProfileModal({ user, onClose, onUpdate }: EditProfileModalProps) {
  const router = useRouter();
  const { update } = useSession();
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

  /**
   * 壓縮 Base64 圖片
   */
  const compressImage = (base64Image: string, maxSizeMB: number = 2): Promise<string> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // 計算目標尺寸（最大寬度或高度為 1200px）
        const maxDimension = 1200;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // 嘗試不同的品質直到大小符合要求
          let quality = 0.9;
          let compressed = canvas.toDataURL('image/jpeg', quality);
          
          // 如果還是太大，降低品質
          while (compressed.length > maxSizeMB * 1024 * 1024 && quality > 0.1) {
            quality -= 0.1;
            compressed = canvas.toDataURL('image/jpeg', quality);
          }
          
          resolve(compressed);
        } else {
          resolve(base64Image);
        }
      };
      img.onerror = () => resolve(base64Image);
      img.src = base64Image;
    });
  };

  /**
   * 上傳圖片到 Cloudinary，如果失敗則回退到 Base64（並壓縮）
   */
  const uploadImageToCloudinary = async (base64Image: string, folder: string): Promise<string> => {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          folder: folder,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        // 如果無法解析 JSON，可能是 413 錯誤
        console.error('❌ Cloudinary upload failed: 無法解析回應 (可能是 413 錯誤)', {
          status: res.status,
          statusText: res.statusText,
        });
        return await compressImage(base64Image, 2);
      }

      if (res.ok && data.url) {
        // Cloudinary 上傳成功，返回 URL
        console.log('✅ Cloudinary 上傳成功:', data.url.substring(0, 50) + '...');
        return data.url;
      } else {
        // Cloudinary 上傳失敗，記錄詳細錯誤
        console.error('❌ Cloudinary upload failed:', {
          status: res.status,
          statusText: res.statusText,
          error: data.error,
          fallback: data.fallback,
        });

        // 如果是環境變數未設定（503），提示用戶
        if (res.status === 503 && data.fallback) {
          console.warn('⚠️ Cloudinary 環境變數未設定，使用 Base64 儲存');
        } else if (res.status === 500) {
          console.error('❌ Cloudinary 上傳發生伺服器錯誤，請檢查環境變數和憑證');
        }

        // 壓縮後回退到 Base64
        return await compressImage(base64Image, 2);
      }
    } catch (error) {
      // 網路錯誤或其他問題
      console.error('❌ Cloudinary upload 網路錯誤:', error);
      console.warn('⚠️ 使用壓縮的 Base64 作為回退方案');
      return await compressImage(base64Image, 2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let coverImageData = coverImagePreview;
      let avatarData = avatarPreview;

      // 如果有新上傳的圖片，先嘗試上傳到 Cloudinary
      if (coverImageFile) {
        const base64 = await convertFileToBase64(coverImageFile);
        // 嘗試上傳到 Cloudinary，失敗則使用 Base64
        coverImageData = await uploadImageToCloudinary(base64, 'x-clone/cover-images');
      }
      
      if (avatarFile) {
        const base64 = await convertFileToBase64(avatarFile);
        // 嘗試上傳到 Cloudinary，失敗則使用 Base64
        avatarData = await uploadImageToCloudinary(base64, 'x-clone/avatars');
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
        // 強制刷新 session 以更新頭貼和名稱
        await update();
        
        // 觸發頁面重新驗證，更新所有組件（包括 Sidebar 和 Feed）
        router.refresh();
        
        onUpdate();
        onClose();
      } else {
        // 嘗試解析錯誤訊息
        let errorMessage = '更新失敗';
        try {
          const data = await res.json();
          errorMessage = data.error || errorMessage;
          
          // 如果是圖片太大錯誤，提供更清楚的訊息
          if (res.status === 413 || data.code === 'PAYLOAD_TOO_LARGE' || data.code === 'IMAGE_TOO_LARGE') {
            errorMessage = '圖片太大。請使用較小的圖片（建議小於 2MB），或設定 Cloudinary 以使用雲端儲存。';
          }
        } catch (parseError) {
          // 如果無法解析 JSON（可能是 413 錯誤），顯示預設訊息
          if (res.status === 413) {
            errorMessage = '圖片太大。請使用較小的圖片（建議小於 2MB），或設定 Cloudinary 以使用雲端儲存。';
          } else {
            errorMessage = `更新失敗 (狀態碼: ${res.status})`;
          }
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      if (error instanceof Error && error.message.includes('413')) {
        alert('圖片太大。請使用較小的圖片（建議小於 2MB），或設定 Cloudinary 以使用雲端儲存。');
      } else {
        alert('更新時發生錯誤');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{ zIndex: 9999 }}
    >
      <div 
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 10000 }}
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
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover rounded-lg"
                />
              )}
              
              {/* 上傳背景圖按鈕 - 置中 */}
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
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-opacity z-10"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
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
