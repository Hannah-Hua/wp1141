/**
 * localStorage 工具函數
 */

export const STORAGE_KEYS = {
  FAVORITES: 'kpop-merchandise-favorites',
  CART: 'kpop-merchandise-cart',
  ORDERS: 'kpop-merchandise-orders',
} as const;

/**
 * 從 localStorage 讀取資料
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`讀取 ${key} 時發生錯誤:`, error);
    return defaultValue;
  }
}

/**
 * 儲存資料到 localStorage
 */
export function saveToStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`儲存 ${key} 時發生錯誤:`, error);
  }
}

/**
 * 從 localStorage 移除資料
 */
export function removeFromStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`移除 ${key} 時發生錯誤:`, error);
  }
}

