'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto flex">
        {/* 左側邊欄 - 主選單 */}
        <Sidebar />
        
        {/* 主要內容區 */}
        <main className="flex-1 border-x border-gray-200 min-h-screen">
          {children}
        </main>
        
        {/* 右側邊欄 - 預留給趨勢等功能 */}
        <aside className="w-80 p-4 hidden lg:block">
          {/* 可以加入搜尋、趨勢等功能 */}
        </aside>
      </div>
    </div>
  );
}

