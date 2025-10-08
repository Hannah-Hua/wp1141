import { CartItem, Product } from '../types';

/**
 * 購物車輔助函數
 */

/**
 * 正規化選項值
 */
export function normalizeOption(option?: string): string | undefined {
  return option || undefined;
}

/**
 * 檢查商品是否已在購物車中
 */
export function findCartItemIndex(
  cartItems: CartItem[],
  productId: number,
  option?: string
): number {
  const normalizedOption = normalizeOption(option);
  return cartItems.findIndex(
    item =>
      item.product.product_id === productId &&
      (item.selectedOption || undefined) === normalizedOption
  );
}

/**
 * 檢查庫存是否足夠
 */
export function hasEnoughStock(
  product: Product,
  requestedQuantity: number,
  currentQuantity: number = 0
): boolean {
  return currentQuantity + requestedQuantity <= product.stock;
}

/**
 * 計算選中商品的總數量
 */
export function calculateSelectedCount(cartItems: CartItem[]): number {
  return cartItems
    .filter(item => item.isSelected)
    .reduce((total, item) => total + item.quantity, 0);
}

/**
 * 計算選中商品的總金額
 */
export function calculateSelectedTotal(cartItems: CartItem[]): number {
  return cartItems
    .filter(item => item.isSelected)
    .reduce((total, item) => total + item.product.price_twd * item.quantity, 0);
}

/**
 * 獲取選中的商品
 */
export function getSelectedItems(cartItems: CartItem[]): CartItem[] {
  return cartItems.filter(item => item.isSelected);
}

