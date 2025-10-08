import { Product } from '../types';

/**
 * 商品輔助函數
 */

/**
 * 根據 ID 查找商品
 */
export function findProductById(products: Product[], id: number): Product | undefined {
  return products.find(p => p.product_id === id);
}

/**
 * 過濾出最愛商品
 */
export function filterFavoriteProducts(
  products: Product[],
  favoriteIds: number[]
): Product[] {
  return favoriteIds
    .map(id => findProductById(products, id))
    .filter((product): product is Product => product !== undefined);
}

/**
 * 檢查商品是否為最愛
 */
export function isFavorite(productId: number, favorites: number[]): boolean {
  return favorites.includes(productId);
}

/**
 * 切換商品最愛狀態
 */
export function toggleFavoriteStatus(
  productId: number,
  favorites: number[]
): number[] {
  if (favorites.includes(productId)) {
    return favorites.filter(id => id !== productId);
  } else {
    return [...favorites, productId];
  }
}

