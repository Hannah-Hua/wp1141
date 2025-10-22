import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CafeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getCafeById,
    deleteCafe,
    auth,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    wishlist,
    addVisit,
  } = useAppContext();

  const [showAddVisit, setShowAddVisit] = useState(false);
  const [visitNotes, setVisitNotes] = useState('');
  const [visitRating, setVisitRating] = useState(5);
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);

  const cafe = getCafeById(Number(id));

  if (!cafe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">找不到此咖啡廳</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(cafe.id);
  const wishlistItem = wishlist.find(w => w.cafeId === cafe.id);

  const handleDelete = async () => {
    if (window.confirm('確定要刪除這間咖啡廳嗎？')) {
      try {
        await deleteCafe(cafe.id);
        navigate('/');
      } catch (err: any) {
        alert(err.message || '刪除失敗');
      }
    }
  };

  const handleWishlistToggle = async () => {
    try {
      if (inWishlist && wishlistItem) {
        await removeFromWishlist(wishlistItem.id);
      } else {
        const notes = prompt('為什麼想去這間咖啡廳？（可選）');
        await addToWishlist(cafe.id, notes || '');
      }
    } catch (err: any) {
      alert(err.message || '操作失敗');
    }
  };

  const handleAddVisit = async () => {
    try {
      await addVisit({
        cafeId: cafe.id,
        visitDate,
        notes: visitNotes,
        rating: visitRating,
      });
      setShowAddVisit(false);
      setVisitNotes('');
      setVisitRating(5);
      alert('已記錄到訪！');
    } catch (err: any) {
      alert(err.message || '記錄失敗');
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
    );
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
        <h1 className="text-2xl font-bold text-amber-600">☕ 辦公咖啡廳清單</h1>
        <div className="w-20"></div>
      </nav>

      {/* 內容區域 */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* 標題和操作按鈕 */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{cafe.name}</h1>
              <p className="text-gray-600">{cafe.category}</p>
            </div>
            {auth.isAuthenticated && (
              <div className="flex gap-2">
                <button
                  onClick={handleWishlistToggle}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    inWishlist
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {inWishlist ? '♥ 已收藏' : '♡ 加入願望'}
                </button>
                <button
                  onClick={() => navigate(`/edit-cafe/${cafe.id}`)}
                  className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-4 py-2 rounded-lg font-medium transition"
                >
                  ✏️ 編輯
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg font-medium transition"
                >
                  🗑️ 刪除
                </button>
              </div>
            )}
          </div>

          {/* 評分和價格 */}
          <div className="flex items-center gap-6 mb-6">
            {renderStars(cafe.rating)}
            {cafe.priceLevel && (
              <div className="text-xl text-gray-600">
                {'$'.repeat(cafe.priceLevel)}
                <span className="text-gray-300">{'$'.repeat(4 - cafe.priceLevel)}</span>
              </div>
            )}
          </div>

          {/* 描述 */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">關於這間咖啡廳</h2>
            <p className="text-gray-700">{cafe.description}</p>
          </div>

          {/* 地址 */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">📍 地址</h2>
            <p className="text-gray-700">{cafe.address}</p>
          </div>

          {/* 設施與環境 */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">🏪 設施與環境</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                cafe.hasWifi ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
              }`}>
                📶 WiFi {cafe.hasWifi ? '有' : '無'}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                cafe.hasPowerOutlets ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                🔌 插座 {cafe.hasPowerOutlets ? '有' : '無'}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                !cafe.hasTimeLimit ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                ⏰ {cafe.hasTimeLimit ? '有時間限制' : '無時間限制'}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                !cafe.isNoisy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                🔊 {cafe.isNoisy ? '會吵雜' : '安靜'}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                cafe.hasGoodLighting ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
              }`}>
                💡 光線 {cafe.hasGoodLighting ? '充足' : '不足'}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                cafe.hasAvailableSeats ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                🪑 座位 {cafe.hasAvailableSeats ? '經常有' : '較少'}
              </span>
            </div>
          </div>

          {/* 新增到訪記錄 */}
          {auth.isAuthenticated && (
            <div className="border-t pt-6">
              <button
                onClick={() => setShowAddVisit(!showAddVisit)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                {showAddVisit ? '取消' : '📝 記錄到訪'}
              </button>

              {showAddVisit && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      到訪日期
                    </label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      評分 ({visitRating} 星)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={visitRating}
                      onChange={(e) => setVisitRating(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1 星</span>
                      <span>5 星</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      備註
                    </label>
                    <textarea
                      value={visitNotes}
                      onChange={(e) => setVisitNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="分享你的體驗..."
                    />
                  </div>

                  <button
                    onClick={handleAddVisit}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
                  >
                    送出記錄
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CafeDetailPage;

