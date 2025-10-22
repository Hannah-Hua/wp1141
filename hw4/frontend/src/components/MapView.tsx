import React, { useEffect, useRef } from 'react';
import { Cafe } from '../types';

interface MapViewProps {
  cafes: Cafe[];
  selectedCafeId: number | null;
  onCafeClick: (cafeId: number) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

const MapView: React.FC<MapViewProps> = ({
  cafes,
  selectedCafeId,
  onCafeClick,
  onMapClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 這裡在階段3會整合真正的 Google Maps
    // 現在先用假的地圖視覺化
  }, [cafes, selectedCafeId]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg shadow-inner relative overflow-hidden"
    >
      {/* 假的地圖背景 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🗺️</div>
          <p className="text-gray-600 font-medium">地圖視圖（階段3會整合 Google Maps）</p>
          <p className="text-sm text-gray-500">顯示 {cafes.length} 間咖啡廳</p>
        </div>
      </div>

      {/* 簡化的標記點顯示 */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
        <h3 className="font-semibold text-gray-800 mb-2">咖啡廳位置</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {cafes.map((cafe) => (
            <div
              key={cafe.id}
              onClick={() => onCafeClick(cafe.id)}
              className={`p-2 rounded cursor-pointer transition ${
                selectedCafeId === cafe.id
                  ? 'bg-amber-100 border-2 border-amber-500'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{cafe.name}</p>
                  <p className="text-xs text-gray-500 truncate">{cafe.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;

