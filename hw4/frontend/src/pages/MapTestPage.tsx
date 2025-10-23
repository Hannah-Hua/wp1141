import React from 'react';
import SimpleMapView from '../components/SimpleMapView';

const MapTestPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white shadow-md px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">地圖載入測試</h1>
        <p className="text-gray-600">測試簡化的 MapView 組件</p>
      </div>
      
      <div className="flex-1 p-4">
        <SimpleMapView />
      </div>
    </div>
  );
};

export default MapTestPage;
