'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={60} // 每 60 秒檢查一次 session 狀態
      refetchOnWindowFocus={true} // 當視窗獲得焦點時檢查 session
    >
      {children}
    </SessionProvider>
  );
}

