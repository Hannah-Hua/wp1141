import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const WishlistPage: React.FC = () => {
  const { wishlist, getCafeById, removeFromWishlist, loadWishlist, loading } = useAppContext();
  const navigate = useNavigate();

  // 載入願望清單
  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (id: number) => {
    if (window.confirm('確定要從願望清單中移除嗎？')) {
      try {
        await removeFromWishlist(id);
      } catch (err: any) {
        alert(err.message || '移除失敗');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航 */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-800 font-medium"
        >
          ← 返回
        </button>
        <h1 className="text-2xl font-bold text-amber-600">♥ 我的願望清單</h1>
        <div className="w-20"></div>
      </nav>

      {/* 內容區域 */}
      <div className="max-w-4xl mx-auto p-6">
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">♡</div>
            <p className="text-xl text-gray-600 mb-4">願望清單是空的</p>
            <p className="text-gray-500 mb-6">發現喜歡的咖啡廳就加入願望清單吧！</p>
            <button
              onClick={() => navigate('/')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              探索咖啡廳
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map(item => {
              const cafe = getCafeById(item.cafeId);
              if (!cafe) return null;

              return (
                <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl text-red-500">♥</span>
                        <h3
                          className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-amber-600"
                          onClick={() => navigate(`/cafe/${cafe.id}`)}
                        >
                          {cafe.name}
                        </h3>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{cafe.category}</p>
                      <p className="text-sm text-gray-600 mb-3">📍 {cafe.address}</p>

                      {cafe.rating && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600">{cafe.rating.toFixed(1)}</span>
                        </div>
                      )}

                      {item.notes && (
                        <div className="bg-amber-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">💭 {item.notes}</p>
                        </div>
                      )}

                      {/* 設施標籤 */}
                      <div className="mt-3 flex gap-2">
                        {cafe.hasWifi && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            📶 WiFi
                          </span>
                        )}
                        {cafe.hasPowerOutlets && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            🔌 插座
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 操作按鈕 */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => navigate(`/cafe/${cafe.id}`)}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap"
                      >
                        查看詳情
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap"
                      >
                        移除
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 統計資訊 */}
        {wishlist.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 統計</h2>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">{wishlist.length}</p>
              <p className="text-sm text-gray-600 mt-1">想去的咖啡廳</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;

