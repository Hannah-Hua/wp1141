import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 前端驗證 - 先不清除錯誤
    if (!username || !email || !password || !confirmPassword) {
      setError('請填寫所有欄位');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('密碼不一致');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('密碼長度至少需要 6 個字元');
      setIsLoading(false);
      return;
    }

    // 清除舊錯誤並開始載入
    setError('');
    setIsLoading(true);

    try {
      await register(username, email, password);
      // 只有註冊成功才導航
      navigate('/');
    } catch (err: any) {
      console.log('註冊錯誤捕獲:', err);
      
      // 根據不同的錯誤類型顯示不同的提示
      let errorMessage = '註冊失敗';
      
      if (err.response?.status === 400) {
        // 處理帳號重複或格式錯誤
        errorMessage = err.response?.data?.error || '此 Email 已被註冊';
      } else if (err.response?.status >= 500) {
        errorMessage = '伺服器錯誤，請稍後再試';
      } else if (err.message) {
        errorMessage = err.message;
      } else {
        errorMessage = '網路連線錯誤，請檢查網路連線';
      }
      
      console.log('設置錯誤訊息:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">☕ 辦公咖啡廳清單</h1>
          <p className="text-gray-600">建立新帳號</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className={`border p-4 rounded-lg text-sm font-medium ${
              error.includes('Email 已被註冊') || error.includes('此 Email 已被註冊')
                ? 'bg-orange-50 border-orange-200 text-orange-700' 
                : error.includes('密碼不一致') || error.includes('密碼長度')
                ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                : error.includes('請填寫所有欄位')
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex items-center">
                <span className="mr-2 text-lg">
                  {error.includes('Email 已被註冊') || error.includes('此 Email 已被註冊')
                    ? '⚠️' 
                    : error.includes('密碼不一致') || error.includes('密碼長度')
                    ? '🔑'
                    : error.includes('請填寫所有欄位')
                    ? 'ℹ️'
                    : '❌'}
                </span>
                {error}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              使用者名稱
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              placeholder="你的名稱"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              密碼
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              placeholder="至少 6 個字元"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              確認密碼
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              placeholder="再次輸入密碼"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? '註冊中...' : '註冊'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            已有帳號？{' '}
            <Link to="/login" className="text-amber-600 hover:text-amber-700 font-semibold">
              登入
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

