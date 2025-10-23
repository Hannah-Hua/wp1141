import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import MapView from '../components/MapView';
import CafeList from '../components/CafeList';

const HomePage: React.FC = () => {
  const { cafes, auth, logout, selectedCafeId, setSelectedCafeId, loadCafes, loading, wishlist } = useAppContext();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [hoveredCafeId, setHoveredCafeId] = useState<number | null>(null);
  const [userHasInteractedWithMap, setUserHasInteractedWithMap] = useState(false);

  // 載入咖啡廳列表
  useEffect(() => {
    loadCafes();
  }, []);

  // 處理地圖標記點擊 - 只高亮，不跳轉
  const handleMapMarkerClick = (cafeId: number) => {
    setSelectedCafeId(cafeId);
  };

  // 處理清單項目點擊 - 高亮並跳轉到詳情頁
  const handleCafeListClick = (cafeId: number) => {
    setSelectedCafeId(cafeId);
    navigate(`/cafe/${cafeId}`);
  };

  // 處理清單項目聚焦 - 只聚焦地圖，不跳轉
  const handleCafeFocus = (cafeId: number) => {
    setSelectedCafeId(cafeId);
    // 每次點擊都重置互動狀態，允許聚焦
    setUserHasInteractedWithMap(false);
  };

  // 處理地圖點擊 - 加入新咖啡廳
  const handleMapClick = (lat: number, lng: number, address: string, name: string) => {
    // 將地址和名稱編碼到 URL 中
    const encodedAddress = encodeURIComponent(address);
    const encodedName = encodeURIComponent(name);
    
    // 跳轉到新增咖啡廳頁面，並帶上預填資料
    navigate(`/add-cafe?lat=${lat}&lng=${lng}&address=${encodedAddress}&name=${encodedName}`);
  };

  // 處理地圖用戶互動
  const handleMapUserInteraction = () => {
    setUserHasInteractedWithMap(true);
    // 用戶手動操作地圖後，清除選中狀態
    setSelectedCafeId(null);
  };

  // 處理清單項目 hover
  const handleCafeHover = (cafeId: number | null) => {
    setHoveredCafeId(cafeId);
  };

  // 獲取願望清單中的咖啡廳 ID 列表
  const wishlistCafeIds = wishlist.map(item => item.cafeId);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* 頂部導航欄 */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-amber-600">☕ 辦公咖啡廳清單</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* 視圖切換按鈕 */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-2 rounded text-sm font-medium transition ${
                viewMode === 'map' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🗺️ 地圖
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-2 rounded text-sm font-medium transition ${
                viewMode === 'split' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ⚡ 雙視圖
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded text-sm font-medium transition ${
                viewMode === 'list' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📋 列表
            </button>
          </div>

          {auth.isAuthenticated && (
            <>
              <button
                onClick={() => navigate('/add-cafe')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                + 新增咖啡廳
              </button>

              <button
                onClick={() => navigate('/visits')}
                className="text-gray-700 hover:text-amber-600 font-medium transition"
              >
                📝 我的到訪
              </button>

              <button
                onClick={() => navigate('/wishlist')}
                className="text-gray-700 hover:text-amber-600 font-medium transition"
              >
                ♥ 願望清單
              </button>

              <div className="flex items-center gap-2">
                <span className="text-gray-700">👤 {auth.user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 font-medium transition"
                >
                  登出
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* 主內容區域 */}
      <div className="flex-1 flex overflow-hidden bg-gray-50">
        {loading && cafes.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-600">載入中...</p>
            </div>
          </div>
        ) : viewMode === 'split' ? (
          <>
            <div className="w-3/5 p-4">
              <MapView
                cafes={cafes}
                selectedCafeId={selectedCafeId}
                hoveredCafeId={hoveredCafeId}
                wishlistCafeIds={wishlistCafeIds}
                onCafeClick={handleMapMarkerClick}
                onUserInteraction={handleMapUserInteraction}
                onAddCafeFromMap={handleMapClick}
              />
            </div>
            <div className="w-2/5 border-l">
              <CafeList
                cafes={cafes}
                selectedCafeId={selectedCafeId}
                onCafeClick={handleCafeListClick}
                onCafeFocus={handleCafeFocus}
                onCafeHover={handleCafeHover}
              />
            </div>
          </>
        ) : viewMode === 'map' ? (
          <div className="flex-1 p-4">
            <MapView
              cafes={cafes}
              selectedCafeId={selectedCafeId}
              hoveredCafeId={hoveredCafeId}
              wishlistCafeIds={wishlistCafeIds}
              onCafeClick={handleMapMarkerClick}
              onUserInteraction={handleMapUserInteraction}
              onAddCafeFromMap={handleMapClick}
            />
          </div>
        ) : viewMode === 'list' ? (
          <div className="flex-1">
            <CafeList
              cafes={cafes}
              selectedCafeId={selectedCafeId}
              onCafeClick={handleCafeListClick}
              onCafeFocus={handleCafeFocus}
              onCafeHover={handleCafeHover}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HomePage;

