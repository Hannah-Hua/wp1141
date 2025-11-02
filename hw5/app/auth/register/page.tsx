'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const provider = searchParams.get('provider');
  const providerId = searchParams.get('providerId');
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const image = searchParams.get('image');

  const validateUserId = (id: string) => {
    if (id.length < 3 || id.length > 20) {
      return 'UserID 必須介於 3-20 個字元之間';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(id)) {
      return 'UserID 只能包含字母、數字和底線';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateUserId(userId);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          provider,
          providerId,
          name,
          email,
          image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '註冊失敗');
        return;
      }

      // 註冊成功，導向首頁
      router.push('/');
    } catch (err) {
      setError('註冊時發生錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">𝕏</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            建立您的帳號
          </h2>
          <p className="text-gray-600">請設定您的 UserID</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
              UserID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="例如：john_doe123"
              required
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]+"
            />
            <p className="mt-2 text-sm text-gray-500">
              3-20 個字元，只能使用字母、數字和底線
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '註冊中...' : '完成註冊'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            使用 <span className="font-medium">{name}</span> 的帳號註冊
          </p>
          <p className="text-xs text-gray-500 mt-1">透過 {provider}</p>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">載入中...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

