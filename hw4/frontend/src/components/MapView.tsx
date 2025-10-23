import React, { useEffect, useRef, useState } from 'react';
import { Cafe } from '../types';

// 擴展 Window 介面以包含 Google Maps API
declare global {
  interface Window {
    google: typeof google;
    gm_authFailure: () => void;
    initMapCallback: () => void;
  }
}

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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_JS_KEY;

  // 初始化地圖
  useEffect(() => {
    // 如果沒有 API Key，顯示提示
    if (!API_KEY) {
      setError('請在 .env 檔案中設定 VITE_GOOGLE_MAPS_JS_KEY');
      setIsLoading(false);
      return;
    }

    // 使用 setTimeout 確保 DOM 元素已渲染
    const timer = setTimeout(() => {
      if (!mapRef.current) {
        console.error('MapView: mapRef.current 不存在');
        setError('無法找到地圖容器元素');
        setIsLoading(false);
        return;
      }

      // 檢查 Google Maps API 是否已載入
      if (typeof google !== 'undefined' && google.maps) {
        initializeMap();
        return;
      }

      // 如果 Google Maps API 未載入，則載入它
      if (!window.google) {
        loadGoogleMapsAPI();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [API_KEY]);

  const loadGoogleMapsAPI = () => {
    // 設定全域錯誤處理
    window.gm_authFailure = function() {
      console.error('Google Maps 認證失敗');
      setError('Google Maps 認證失敗，請檢查 API Key 是否正確');
      setIsLoading(false);
    };

    // 載入成功回調
    window.initMapCallback = function() {
      console.log('Google Maps API 載入成功');
      initializeMap();
    };

    // 建立腳本標籤
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMapCallback`;
    script.async = true;
    script.defer = true;
    
    script.onerror = function() {
      console.error('Google Maps API 腳本載入失敗');
      setError('Google Maps API 腳本載入失敗');
      setIsLoading(false);
    };

    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current) return;

    try {
      // 建立地圖（預設中心點：台北101）
      const defaultCenter = { lat: 25.0330, lng: 121.5654 };
      
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      setMap(mapInstance);
      setIsLoading(false);

      // 地圖點擊事件
      if (onMapClick) {
        mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onMapClick(e.latLng.lat(), e.latLng.lng());
          }
        });
      }

      console.log('地圖初始化成功');
    } catch (error) {
      console.error('地圖初始化失敗:', error);
      setError('地圖初始化失敗: ' + error.message);
      setIsLoading(false);
    }
  };

  // 更新地圖標記
  useEffect(() => {
    if (!map) return;

    // 清除舊標記
    markers.forEach(marker => marker.setMap(null));

    // 建立新標記
    const newMarkers = cafes.map((cafe) => {
      // 使用地址的 hash 來生成固定的座標（示意用）
      // 在真實情況下，這些座標應該從後端的 Geocoding API 取得
      const lat = 25.0330 + (Math.random() - 0.5) * 0.05;
      const lng = 121.5654 + (Math.random() - 0.5) * 0.05;

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: cafe.name,
        icon: selectedCafeId === cafe.id
          ? {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#D97706',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }
          : {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#EF4444',
              fillOpacity: 0.8,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
      });

      // 建立資訊視窗
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="font-weight: bold; margin-bottom: 5px; color: #1f2937;">${cafe.name}</h3>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">${cafe.category}</p>
            <p style="font-size: 13px; color: #4b5563;">${cafe.address}</p>
            ${cafe.rating ? `<p style="font-size: 13px; color: #f59e0b; margin-top: 5px;">⭐ ${cafe.rating.toFixed(1)}</p>` : ''}
          </div>
        `,
      });

      // 點擊標記顯示資訊
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        onCafeClick(cafe.id);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // 如果有咖啡廳，自動調整地圖範圍以顯示所有標記
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        const position = marker.getPosition();
        if (position) {
          bounds.extend(position);
        }
      });
      map.fitBounds(bounds);
      
      // 設定最大縮放等級
      const listener = google.maps.event.addListenerOnce(map, 'idle', () => {
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom > 15) {
          map.setZoom(15);
        }
      });
    }
  }, [map, cafes, selectedCafeId, onCafeClick]);

  // 當選中的咖啡廳改變時，將地圖中心移到該咖啡廳
  useEffect(() => {
    if (!map || selectedCafeId === null) return;

    const selectedMarker = markers.find((_, index) => cafes[index]?.id === selectedCafeId);
    if (selectedMarker) {
      const position = selectedMarker.getPosition();
      if (position) {
        map.panTo(position);
        map.setZoom(16);
      }
    }
  }, [map, selectedCafeId, markers, cafes]);

  return (
    <div className="w-full h-full rounded-lg shadow-lg overflow-hidden relative" style={{ minHeight: '400px' }}>
      {/* 載入狀態覆蓋層 */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">載入 Google Maps...</p>
          </div>
        </div>
      )}

      {/* 錯誤狀態覆蓋層 */}
      {error && (
        <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
          <div className="text-center p-6">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium mb-2">{error}</p>
            <p className="text-sm text-gray-600">
              請參考 GOOGLE_MAPS_SETUP.md 設定 API Key
            </p>
          </div>
        </div>
      )}

      {/* 地圖容器 - 始終渲染 */}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapView;
