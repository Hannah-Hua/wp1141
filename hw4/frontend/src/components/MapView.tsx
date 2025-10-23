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
  hoveredCafeId: number | null;
  wishlistCafeIds: number[];
  onCafeClick: (cafeId: number) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onUserInteraction?: () => void;
}

const MapView: React.FC<MapViewProps> = ({
  cafes,
  selectedCafeId,
  hoveredCafeId,
  wishlistCafeIds,
  onCafeClick,
  onMapClick,
  onUserInteraction,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindows, setInfoWindows] = useState<google.maps.InfoWindow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

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

      // 監聽用戶手動縮放和拖曳
      mapInstance.addListener('zoom_changed', () => {
        setUserHasInteracted(true);
        onUserInteraction?.();
      });
      
      mapInstance.addListener('dragend', () => {
        setUserHasInteracted(true);
        onUserInteraction?.();
      });

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

    // 清除舊標記和資訊視窗
    markers.forEach(marker => marker.setMap(null));
    infoWindows.forEach(infoWindow => infoWindow.close());

    // 為每個咖啡廳獲取真實座標
    const createMarkers = async () => {
      const newMarkers: google.maps.Marker[] = [];
      const newInfoWindows: google.maps.InfoWindow[] = [];
      
      for (const cafe of cafes) {
        try {
          // 使用 Google Maps Geocoding API 獲取真實座標
          const geocoder = new google.maps.Geocoder();
          const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
            geocoder.geocode({ address: cafe.address }, (results, status) => {
              if (status === 'OK' && results) {
                resolve(results);
              } else {
                reject(new Error(`Geocoding failed: ${status}`));
              }
            });
          });

          if (result.length > 0) {
            const location = result[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();

            // 判斷是否在願望清單中
            const isInWishlist = wishlistCafeIds.includes(cafe.id);
            const isSelected = selectedCafeId === cafe.id;
            const isHovered = hoveredCafeId === cafe.id;

            // 根據狀態選擇圖標
            let iconConfig;
            if (isInWishlist) {
              // 願望清單：愛心符號
              iconConfig = {
                path: 'M12,21.35L10.55,20.03C5.4,15.36 2,12.28 2,8.5 2,5.42 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.09C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5C22,12.28 18.6,15.36 13.45,20.04L12,21.35Z',
                scale: isSelected ? 1.3 : isHovered ? 1.15 : 1,
                fillColor: '#E91E63',
                fillOpacity: isSelected ? 1 : isHovered ? 0.9 : 0.8,
                strokeColor: '#ffffff',
                strokeWeight: isSelected ? 3 : 2,
                anchor: new google.maps.Point(12, 12),
              };
            } else {
              // 一般咖啡廳：咖啡杯符號
              iconConfig = {
                path: 'M19,7H18V6A2,2 0 0,0 16,4H8A2,2 0 0,0 6,6V7H5A1,1 0 0,0 4,8V19A3,3 0 0,0 7,22H17A3,3 0 0,0 20,19V8A1,1 0 0,0 19,7M8,6H16V7H8V6M18,19A1,1 0 0,1 17,20H7A1,1 0 0,1 6,19V9H18V19Z',
                scale: isSelected ? 1.3 : isHovered ? 1.15 : 1,
                fillColor: '#8B4513',
                fillOpacity: isSelected ? 1 : isHovered ? 0.9 : 0.8,
                strokeColor: '#ffffff',
                strokeWeight: isSelected ? 3 : 2,
                anchor: new google.maps.Point(12, 12),
              };
            }

            const marker = new google.maps.Marker({
              position: { lat, lng },
              map,
              title: cafe.name,
              icon: iconConfig,
            });

            // 建立資訊視窗
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="padding: 10px; max-width: 250px;">
                  <h3 style="font-weight: bold; margin-bottom: 5px; color: #1f2937;">${cafe.name}</h3>
                  <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">${cafe.description}</p>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; color: #374151;">${cafe.category}</span>
                    ${cafe.rating ? `<span style="color: #f59e0b; font-weight: bold;">⭐ ${cafe.rating}</span>` : ''}
                  </div>
                </div>
              `,
            });

            // 標記點擊事件 - 只高亮，不跳轉到詳情頁
            marker.addListener('click', () => {
              // 關閉其他資訊視窗
              newInfoWindows.forEach(iw => iw.close());
              
              // 開啟當前資訊視窗
              infoWindow.open(map, marker);
              
              // 只呼叫高亮回調，不跳轉到詳情頁
              onCafeClick(cafe.id);
            });

            newMarkers.push(marker);
            newInfoWindows.push(infoWindow);
          } else {
            console.warn(`無法為咖啡廳 "${cafe.name}" 獲取座標: ${cafe.address}`);
          }
        } catch (error) {
          console.error(`為咖啡廳 "${cafe.name}" 獲取座標時發生錯誤:`, error);
          // 如果 Geocoding 失敗，使用預設座標
          const lat = 25.0330 + (Math.random() - 0.5) * 0.05;
          const lng = 121.5654 + (Math.random() - 0.5) * 0.05;
          
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map,
            title: cafe.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#9CA3AF',
              fillOpacity: 0.8,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
          });

          newMarkers.push(marker);
        }
      }

      setMarkers(newMarkers);
      setInfoWindows(newInfoWindows);

      // 只在第一次載入時自動調整地圖範圍，之後讓使用者自己控制
      if (newMarkers.length > 0 && markers.length === 0) {
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
    };

    createMarkers();
  }, [map, cafes, selectedCafeId, hoveredCafeId, wishlistCafeIds, onCafeClick]);

  // 當選中的咖啡廳改變時，將地圖中心移到該咖啡廳並自動縮放
  useEffect(() => {
    if (!map || selectedCafeId === null) return;

    const selectedMarker = markers.find((_, index) => cafes[index]?.id === selectedCafeId);
    if (selectedMarker) {
      const position = selectedMarker.getPosition();
      if (position) {
        map.panTo(position);
        map.setZoom(16); // 聚焦時自動縮放到適當大小
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