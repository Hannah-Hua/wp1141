import { useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/localStorage';
import { findCartItemIndex, hasEnoughStock } from '../utils/cartHelpers';

/**
 * 購物車狀態管理 Hook
 */
export const useCartState = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 從 localStorage 載入購物車
  useEffect(() => {
    const savedCart = getFromStorage<CartItem[]>(STORAGE_KEYS.CART, []);
    setCartItems(savedCart);
  }, []);

  // 儲存購物車到 localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CART, cartItems);
  }, [cartItems]);

  // 加入商品到購物車
  const addToCart = (product: Product, selectedOption?: string, quantity: number = 1) => {
    // 檢查庫存限制
    if (quantity > product.stock) {
      console.warn(`無法加入購物車：請求數量 ${quantity} 超過庫存 ${product.stock}`);
      return;
    }

    // 查找是否已存在相同商品和選項
    const existingItemIndex = findCartItemIndex(cartItems, product.product_id, selectedOption);

    if (existingItemIndex >= 0) {
      // 如果商品已存在，檢查累加後是否超過庫存
      const currentQuantity = cartItems[existingItemIndex].quantity;
      
      if (!hasEnoughStock(product, quantity, currentQuantity)) {
        const newTotalQuantity = currentQuantity + quantity;
        console.warn(`無法累加數量：累加後數量 ${newTotalQuantity} 超過庫存 ${product.stock}`);
        return;
      }
      
      // 如果商品已存在，累加數量
      setCartItems(prev => prev.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
      console.log(`商品 ${product.product_name} 已存在，累加數量 ${quantity}，新總數: ${currentQuantity + quantity}`);
    } else {
      // 如果商品不存在，新增到購物車
      const newCartItem: CartItem = {
        product,
        quantity,
        selectedOption: selectedOption || undefined,
        isSelected: true
      };
      setCartItems(prev => [...prev, newCartItem]);
      console.log(`新增商品 ${product.product_name} 到購物車，數量: ${quantity}，選項: ${selectedOption || '無'}`);
    }
  };

  // 移除已選中的商品
  const removeSelectedItems = () => {
    setCartItems(prev => prev.filter(item => !item.isSelected));
  };

  return {
    cartItems,
    setCartItems,
    addToCart,
    removeSelectedItems,
  };
};

