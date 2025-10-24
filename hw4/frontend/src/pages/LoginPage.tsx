import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 前端驗證
    if (!email || !password) {
      setError('請填寫所有欄位');
      setIsLoading(false);
      return;
    }

    // 清除舊錯誤並開始載入
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // 只有登入成功才導航
      navigate('/');
    } catch (err: any) {
      console.log('登入錯誤捕獲:', err);
      
      // 根據不同的錯誤類型顯示不同的提示
      let errorMessage = '登入失敗';
      
      if (err.response?.status === 401) {
        // 使用後端回傳的具體錯誤訊息
        errorMessage = err.response?.data?.error || '查無此帳號或密碼錯誤';
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.error || '請檢查輸入格式';
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
          <p className="text-gray-600">登入您的帳號</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className={`border p-4 rounded-lg text-sm font-medium ${
              error.includes('查無此帳號') 
                ? 'bg-orange-50 border-orange-200 text-orange-700' 
                : error.includes('密碼錯誤')
                ? 'bg-red-50 border-red-200 text-red-700'
                : error.includes('請填寫所有欄位')
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : error.includes('伺服器錯誤')
                ? 'bg-purple-50 border-purple-200 text-purple-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex items-center">
                <span className="mr-2 text-lg">
                  {error.includes('查無此帳號') 
                    ? '❓' 
                    : error.includes('密碼錯誤')
                    ? '🔒'
                    : error.includes('請填寫所有欄位')
                    ? 'ℹ️'
                    : error.includes('伺服器錯誤')
                    ? '⚙️'
                    : '❌'}
                </span>
                {error}
              </div>
            </div>
          )}

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
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? '登入中...' : '登入'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            還沒有帳號？{' '}
            <Link to="/register" className="text-amber-600 hover:text-amber-700 font-semibold">
              註冊
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

