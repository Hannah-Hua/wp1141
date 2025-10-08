import { useState, useEffect } from 'react';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/localStorage';
import { toggleFavoriteStatus } from '../utils/productHelpers';

/**
 * 最愛商品狀態管理 Hook
 */
export const useFavoritesState = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  // 從 localStorage 載入最愛
  useEffect(() => {
    const savedFavorites = getFromStorage<number[]>(STORAGE_KEYS.FAVORITES, []);
    setFavorites(savedFavorites);
  }, []);

  // 儲存最愛到 localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
  }, [favorites]);

  // 切換最愛狀態
  const handleFavoriteToggle = (productId: number) => {
    setFavorites(prev => toggleFavoriteStatus(productId, prev));
  };

  return {
    favorites,
    setFavorites,
    handleFavoriteToggle,
  };
};

