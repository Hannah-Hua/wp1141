import { useState, useEffect } from 'react';
import { getProducts } from '../data/products';

/**
 * 商品資料載入 Hook
 */
export const useProductsData = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // 載入商品資料
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('開始載入商品資料...');
        const products = await getProducts();
        if (products.length > 0) {
          setIsDataLoaded(true);
          setLoadingError(null);
          console.log(`商品資料載入完成，共 ${products.length} 個商品`);
        } else {
          setLoadingError('未載入到任何商品資料');
        }
      } catch (error) {
        console.error('載入商品資料失敗:', error);
        setLoadingError('載入商品資料失敗，請重新整理頁面');
      }
    };

    loadData();
  }, []);

  return {
    isDataLoaded,
    loadingError,
  };
};

