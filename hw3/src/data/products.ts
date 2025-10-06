import { Product } from '../types';
import { parseCSV } from '../utils/csvParser';

// 動態載入 CSV 資料
let cachedProducts: Product[] | null = null;
let isLoading = false;
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30秒快取

export const getProducts = async (): Promise<Product[]> => {
  const now = Date.now();
  
  // 如果有快取且未過期，直接返回
  if (cachedProducts && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedProducts;
  }
  
  // 如果正在載入，等待載入完成
  if (isLoading) {
    return new Promise((resolve) => {
      const checkLoading = () => {
        if (!isLoading && cachedProducts) {
          resolve(cachedProducts);
        } else {
          setTimeout(checkLoading, 100);
        }
      };
      checkLoading();
    });
  }
  
  isLoading = true;
  
  try {
    console.log('正在載入 merchandise.csv...');
    const response = await fetch('/data/merchandise.csv');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // 讀取為 ArrayBuffer 來處理 Big5 編碼
    const arrayBuffer = await response.arrayBuffer();
    console.log('CSV 檔案載入成功，開始解碼 Big5...');
    
    // 使用 TextDecoder 解碼 Big5
    const decoder = new TextDecoder('big5');
    const csvText = decoder.decode(arrayBuffer);
    console.log('Big5 解碼完成，開始解析...');
    
    // 解析 CSV
    const parsedProducts = parseCSV(csvText);
    cachedProducts = parsedProducts;
    lastFetchTime = now;
    
    console.log(`成功載入 ${cachedProducts.length} 個商品`);
    return cachedProducts;
    
  } catch (error) {
    console.error('載入 CSV 檔案時發生錯誤:', error);
    
    // 如果載入失敗，返回空陣列或預設資料
    cachedProducts = [];
    return cachedProducts;
    
  } finally {
    isLoading = false;
  }
};

// 獲取所有娛樂公司
export const getEntertainments = async (): Promise<string[]> => {
  const products = await getProducts();
  return Array.from(new Set(products.map(product => product.entertainment)));
};

// 獲取指定娛樂公司的團體
export const getGroupsByEntertainment = async (entertainment: string): Promise<string[]> => {
  const products = await getProducts();
  return Array.from(new Set(
    products
      .filter(product => product.entertainment === entertainment)
      .map(product => product.group_name)
  ));
};

// 獲取所有分類
export const getCategories = async (): Promise<string[]> => {
  const products = await getProducts();
  return Array.from(new Set(products.map(product => product.category)));
};

// 獲取最熱門商品（按已售出數量排序）
export const getPopularProducts = async (limit?: number): Promise<Product[]> => {
  const products = await getProducts();
  const sorted = [...products].sort((a, b) => b.sold_count - a.sold_count);
  return limit ? sorted.slice(0, limit) : sorted;
};

// 搜尋商品
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  if (!searchTerm.trim()) {
    return [];
  }

  const products = await getProducts();
  const term = searchTerm.toLowerCase();
  return products.filter(product =>
    product.product_name.toLowerCase().includes(term) ||
    product.group_name.toLowerCase().includes(term) ||
    product.entertainment.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term)
  );
};

// 根據篩選條件獲取商品
export const getFilteredProducts = async (filters: {
  entertainment?: string;
  group_name?: string;
  category?: string;
}): Promise<Product[]> => {
  const products = await getProducts();
  let filtered = [...products];

  if (filters.entertainment) {
    filtered = filtered.filter(product => product.entertainment === filters.entertainment);
  }

  if (filters.group_name) {
    filtered = filtered.filter(product => product.group_name === filters.group_name);
  }

  if (filters.category) {
    filtered = filtered.filter(product => product.category === filters.category);
  }

  return filtered;
};

// 為了向後相容，保留同步版本（使用快取）
export const mockProducts: Product[] = [];
