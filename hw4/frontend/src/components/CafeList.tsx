import React, { useState } from 'react';
import { Cafe } from '../types';
import { useAppContext } from '../context/AppContext';

interface CafeListProps {
  cafes: Cafe[];
  onCafeClick: (cafeId: number) => void;
  onCafeFocus: (cafeId: number) => void;
  selectedCafeId: number | null;
  onCafeHover?: (cafeId: number | null) => void;
}

const CafeList: React.FC<CafeListProps> = ({ cafes, onCafeClick, onCafeFocus, selectedCafeId, onCafeHover }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { isInWishlist } = useAppContext();

  const categories = ['all', ...Array.from(new Set(cafes.map(c => c.category)))];

  const filteredCafes = cafes.filter(cafe => {
    const matchesSearch = cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cafe.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || cafe.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const renderPriceLevel = (level?: number) => {
    if (!level) return null;
    return (
      <div className="text-gray-600">
        {'$'.repeat(level)}
        <span className="text-gray-300">{'$'.repeat(4 - level)}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* 搜尋和篩選 */}
      <div className="p-4 bg-white border-b space-y-3">
        <input
          type="text"
          placeholder="搜尋咖啡廳名稱或地址..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
        />
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                categoryFilter === category
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? '全部' : category}
            </button>
          ))}
        </div>
      </div>

      {/* 咖啡廳列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredCafes.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            沒有找到符合條件的咖啡廳
          </div>
        ) : (
          filteredCafes.map(cafe => (
            <div
              key={cafe.id}
              onClick={(e) => {
                // 如果點擊的是按鈕，不觸發卡片點擊
                if ((e.target as HTMLElement).closest('button')) {
                  return;
                }
                // 點擊卡片其他地方，聚焦到地圖
                onCafeFocus(cafe.id);
              }}
              onMouseEnter={() => onCafeHover?.(cafe.id)}
              onMouseLeave={() => onCafeHover?.(null)}
              className={`bg-white rounded-lg p-4 cursor-pointer transition-all duration-200 border-2 hover:shadow-lg hover:scale-[1.02] ${
                selectedCafeId === cafe.id
                  ? 'border-amber-500 shadow-md'
                  : 'border-transparent shadow'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                    {cafe.name}
                    {isInWishlist(cafe.id) && <span className="text-red-500">♥</span>}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">{cafe.category}</p>
                </div>
                {renderPriceLevel(cafe.priceLevel)}
              </div>

              {renderStars(cafe.rating)}

              <p className="text-sm text-gray-700 mt-2 line-clamp-2">{cafe.description}</p>

              <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  📍 {cafe.address}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {cafe.hasWifi && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    📶 WiFi
                  </span>
                )}
                {cafe.hasPowerOutlets && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    🔌 插座
                  </span>
                )}
                {!cafe.hasTimeLimit && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    ⏰ 無限時
                  </span>
                )}
                {!cafe.isNoisy && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    🔊 安靜
                  </span>
                )}
                {cafe.hasGoodLighting && (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    💡 光線佳
                  </span>
                )}
                {cafe.hasAvailableSeats && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    🪑 有座位
                  </span>
                )}
              </div>
              
              {/* 詳細資訊按鈕 */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    onCafeClick(cafe.id);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  詳細資訊
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CafeList;

