import React, { useEffect, useRef, useState } from 'react';

// 擴展 Window 介面以包含 Google Maps API
declare global {
  interface Window {
    google: typeof google;
    gm_authFailure: () => void;
    initMapCallback: () => void;
  }
}

const SimpleMapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_JS_KEY;

  useEffect(() => {
    console.log('SimpleMapView: useEffect 開始');
    console.log('API_KEY:', API_KEY ? '已設定' : '未設定');

    if (!API_KEY) {
      console.log('SimpleMapView: API_KEY 未設定');
      setError('請在 .env 檔案中設定 VITE_GOOGLE_MAPS_JS_KEY');
      setIsLoading(false);
      return;
    }

    // 使用 setTimeout 確保 DOM 元素已渲染
    const timer = setTimeout(() => {
      console.log('SimpleMapView: 檢查 mapRef.current:', mapRef.current ? '存在' : '不存在');
      
      if (!mapRef.current) {
        console.log('SimpleMapView: mapRef.current 仍然不存在，重試...');
        // 如果還是沒有，再等一點時間
        setTimeout(() => {
          if (mapRef.current) {
            console.log('SimpleMapView: mapRef.current 現在存在，開始初始化');
            initializeMapOrLoadAPI();
          } else {
            console.log('SimpleMapView: mapRef.current 仍然不存在，顯示錯誤');
            setError('無法找到地圖容器元素');
            setIsLoading(false);
          }
        }, 100);
        return;
      }

      initializeMapOrLoadAPI();
    }, 100);

    return () => clearTimeout(timer);
  }, [API_KEY]);

  const initializeMapOrLoadAPI = () => {
    // 檢查 Google Maps API 是否已載入
    if (typeof google !== 'undefined' && google.maps) {
      console.log('SimpleMapView: Google Maps API 已載入，直接初始化');
      initializeMap();
      return;
    }

    console.log('SimpleMapView: Google Maps API 未載入，開始載入');
    loadGoogleMapsAPI();
  };

  const loadGoogleMapsAPI = () => {
    console.log('SimpleMapView: loadGoogleMapsAPI 開始');
    
    // 設定全域錯誤處理
    window.gm_authFailure = function() {
      console.error('SimpleMapView: Google Maps 認證失敗');
      setError('Google Maps 認證失敗，請檢查 API Key 是否正確');
      setIsLoading(false);
    };

    // 載入成功回調
    window.initMapCallback = function() {
      console.log('SimpleMapView: Google Maps API 載入成功');
      initializeMap();
    };

    // 建立腳本標籤
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMapCallback`;
    script.async = true;
    script.defer = true;
    
    script.onerror = function() {
      console.error('SimpleMapView: Google Maps API 腳本載入失敗');
      setError('Google Maps API 腳本載入失敗');
      setIsLoading(false);
    };

    script.onload = function() {
      console.log('SimpleMapView: 腳本標籤載入完成');
    };

    console.log('SimpleMapView: 加入腳本標籤到 document.head');
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    console.log('SimpleMapView: initializeMap 開始');
    
    if (!mapRef.current) {
      console.log('SimpleMapView: mapRef.current 不存在，無法初始化地圖');
      return;
    }

    try {
      console.log('SimpleMapView: 建立地圖實例');
      
      // 建立地圖（預設中心點：台北101）
      const defaultCenter = { lat: 25.0330, lng: 121.5654 };
      
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      console.log('SimpleMapView: 地圖實例建立成功');
      setMap(mapInstance);
      setIsLoading(false);

      // 加入測試標記
      const marker = new google.maps.Marker({
        position: defaultCenter,
        map: mapInstance,
        title: '台北101',
        animation: google.maps.Animation.DROP
      });

      console.log('SimpleMapView: 標記加入成功');
      console.log('SimpleMapView: 地圖初始化完成');

    } catch (error) {
      console.error('SimpleMapView: 地圖初始化失敗:', error);
      setError('地圖初始化失敗: ' + error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full">
      {/* 載入狀態覆蓋層 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50 border border-blue-200 rounded-lg z-10">
          <div className="text-center">
            <div className="text-blue-600 text-lg font-semibold mb-2">⏳ 載入 Google Maps...</div>
            <div className="text-blue-500 text-sm">請稍候，正在載入地圖</div>
          </div>
        </div>
      )}
      
      {/* 錯誤狀態覆蓋層 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg z-10">
          <div className="text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">❌ 地圖載入失敗</div>
            <div className="text-red-500 text-sm">{error}</div>
          </div>
        </div>
      )}
      
      {/* 地圖容器 - 始終渲染 */}
      <div ref={mapRef} className="h-full w-full rounded-lg border border-gray-300" />
    </div>
  );
};

export default SimpleMapView;
