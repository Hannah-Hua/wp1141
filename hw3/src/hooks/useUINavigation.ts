import { useState, useEffect } from 'react';
import { Product } from '../types';

/**
 * UI 導航和顯示狀態管理 Hook
 */
export const useUINavigation = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  // ESC 鍵關閉所有彈窗
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowFavorites(false);
        setShowCart(false);
        setShowOrderForm(false);
        setShowOrderConfirmation(false);
        setShowOrderHistory(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 處理商品點擊
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    // 滾動到頁面最上方
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 返回商品列表
  const handleBackToList = () => {
    setSelectedProduct(null);
    setShowFavorites(false);
    // 滾動到頁面最上方
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 顯示最愛頁面
  const handleFavoriteClick = () => {
    setShowFavorites(true);
    setShowCart(false);
    setShowOrderHistory(false);
    setSelectedProduct(null);
    // 滾動到頁面最上方
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 關閉最愛頁面
  const handleCloseFavorites = () => {
    setShowFavorites(false);
  };

  // 顯示購物車
  const handleCartClick = () => {
    setShowCart(true);
    setShowFavorites(false);
    setShowOrderHistory(false);
    setSelectedProduct(null);
  };

  // 關閉購物車
  const handleCloseCart = () => {
    setShowCart(false);
  };

  // 顯示訂單表單
  const handleCheckout = () => {
    setShowOrderForm(true);
    setShowCart(false);
    // 滾動到頁面最上方
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 返回購物車
  const handleBackToCart = () => {
    setShowOrderForm(false);
    setShowCart(true);
  };

  // 提交訂單
  const handleSubmitOrder = (submittedOrderData: any) => {
    setOrderData(submittedOrderData);
    setShowOrderForm(false);
    setShowOrderConfirmation(true);
  };

  // 關閉訂單確認
  const handleCloseOrderConfirmation = () => {
    setShowOrderConfirmation(false);
    setOrderData(null);
  };

  // 顯示訂單歷史
  const handleOrderHistoryClick = () => {
    setShowOrderHistory(true);
    setShowFavorites(false);
    setShowCart(false);
    setSelectedProduct(null);
    // 滾動到頁面最上方
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 關閉訂單歷史
  const handleCloseOrderHistory = () => {
    setShowOrderHistory(false);
  };

  return {
    // State
    selectedProduct,
    showFavorites,
    showCart,
    showOrderForm,
    showOrderConfirmation,
    showOrderHistory,
    orderData,
    
    // Setters
    setSelectedProduct,
    setShowCart,
    
    // Handlers
    handleProductClick,
    handleBackToList,
    handleFavoriteClick,
    handleCloseFavorites,
    handleCartClick,
    handleCloseCart,
    handleCheckout,
    handleBackToCart,
    handleSubmitOrder,
    handleCloseOrderConfirmation,
    handleOrderHistoryClick,
    handleCloseOrderHistory,
  };
};

