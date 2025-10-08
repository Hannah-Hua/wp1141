import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, CircularProgress, Typography } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import OrderForm from './components/OrderForm';
import OrderConfirmation from './components/OrderConfirmation';
import OrderHistory from './components/OrderHistory';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { getFilteredProducts, getPopularProducts, searchProducts, getProducts } from './data/products';
import { Product } from './types';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from './utils/localStorage';
import { calculateSelectedCount } from './utils/cartHelpers';
import { filterFavoriteProducts } from './utils/productHelpers';

/**
 * App 主要內容組件
 */
const AppContent: React.FC = () => {
  const {
    // 商品資料
    isDataLoaded,
    loadingError,
    
    // 購物車
    cartItems,
    setCartItems,
    addToCart,
    removeSelectedItems,
    
    // 最愛
    favorites,
    handleFavoriteToggle,
    
    // UI 導航
    selectedProduct,
    showFavorites,
    showCart,
    showOrderForm,
    showOrderConfirmation,
    showOrderHistory,
    orderData,
    setSelectedProduct,
    setShowCart,
    handleProductClick,
    handleBackToList,
    handleFavoriteClick,
    handleCartClick,
    handleCloseCart,
    handleCheckout,
    handleBackToCart,
    handleSubmitOrder,
    handleCloseOrderConfirmation,
    handleOrderHistoryClick,
    handleCloseOrderHistory,
    
    // 篩選和搜尋
    filters,
    searchTerm,
    handleEntertainmentSelect,
    clearFilters,
    handleSearchChange,
  } = useAppContext();

  const [displayData, setDisplayData] = useState<any>(null);

  // 處理加入購物車
  const handleAddToCart = (product: Product, selectedOption?: string, quantity: number = 1) => {
    addToCart(product, selectedOption, quantity);
    setShowCart(true);
    setSelectedProduct(null);
  };

  // 處理訂單提交
  const handleOrderSubmit = (submittedOrderData: any) => {
    console.log('訂單已提交:', submittedOrderData);
    
    // 保存訂單到 localStorage
    const orders = getFromStorage<any[]>(STORAGE_KEYS.ORDERS, []);
    orders.push(submittedOrderData);
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    
    // 移除已選中的商品
    removeSelectedItems();
    
    handleSubmitOrder(submittedOrderData);
  };

  // 獲取要顯示的商品和標題
  const getDisplayData = async () => {
    // 如果顯示訂單表單
    if (showOrderForm) {
      const selectedItems = cartItems.filter(item => item.isSelected);
      const totalAmount = selectedItems.reduce((total, item) => total + (item.product.price_twd * item.quantity), 0);
      return {
        orderForm: true,
        cartItems: selectedItems,
        totalAmount,
        title: '填寫訂單資料'
      };
    }

    // 如果顯示最愛
    if (showFavorites) {
      const products = await getProducts();
      const favoriteProducts = filterFavoriteProducts(products, favorites);
      
      return {
        products: favoriteProducts,
        title: `我的最愛 (${favoriteProducts.length} 件商品)`
      };
    }

    // 優先檢查是否有搜尋
    if (searchTerm.trim()) {
      const searchResults = await searchProducts(searchTerm);
      return {
        products: searchResults,
        title: `搜尋結果: "${searchTerm}" (${searchResults.length} 件商品)`
      };
    }

    // 檢查是否有任何篩選條件
    const hasFilters = filters.entertainment;
    
    if (hasFilters) {
      const filteredProducts = await getFilteredProducts(filters);
      let title = '';
      
      if (filters.entertainment) {
        title = `${filters.entertainment} 商品`;
      }
      
      return { products: filteredProducts, title };
    } else {
      // 沒有篩選條件時，顯示最熱門的商品
      const popularProducts = await getPopularProducts(10);
      return { 
        products: popularProducts, 
        title: '熱門手燈 TOP 10' 
      };
    }
  };

  // 更新顯示資料
  useEffect(() => {
    const updateDisplayData = async () => {
      if (!isDataLoaded) return;
      
      try {
        const data = await getDisplayData();
        setDisplayData(data);
      } catch (error) {
        console.error('更新顯示資料時發生錯誤:', error);
      }
    };

    updateDisplayData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDataLoaded, showOrderForm, showCart, showFavorites, searchTerm, filters, favorites, cartItems]);

  const displayProducts = displayData && 'products' in displayData ? (displayData.products || []) : [];
  const title = displayData?.title || '載入中...';

  // 載入中或錯誤狀態
  if (!isDataLoaded || loadingError) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          backgroundColor: '#f5f5f5'
        }}>
          {loadingError ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
                {loadingError}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                請重新整理頁面或檢查網路連線
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                載入商品資料中...
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  // 如果顯示訂單歷史頁面
  if (showOrderHistory) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />
        <Header 
          onSearchChange={handleSearchChange} 
          searchTerm={searchTerm}
          onFavoriteClick={handleFavoriteClick}
          favoriteCount={favorites.length}
          onCartClick={handleCartClick}
          cartCount={calculateSelectedCount(cartItems)}
          onOrderHistoryClick={handleOrderHistoryClick}
        />
        <OrderHistory onClose={handleCloseOrderHistory} />
      </Box>
    );
  }

  // 如果顯示訂單確認頁面
  if (showOrderConfirmation && orderData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />
        <Header 
          onSearchChange={handleSearchChange} 
          searchTerm={searchTerm}
          onFavoriteClick={handleFavoriteClick}
          favoriteCount={favorites.length}
          onCartClick={handleCartClick}
          cartCount={calculateSelectedCount(cartItems)}
          onOrderHistoryClick={handleOrderHistoryClick}
        />
        <OrderConfirmation 
          orderData={orderData}
          onClose={handleCloseOrderConfirmation}
        />
      </Box>
    );
  }

  // 如果顯示訂單表單
  if (showOrderForm) {
    const selectedItems = cartItems.filter(item => item.isSelected);
    const totalAmount = selectedItems.reduce((total, item) => total + (item.product.price_twd * item.quantity), 0);
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />
        <Header 
          onSearchChange={handleSearchChange} 
          searchTerm={searchTerm}
          onFavoriteClick={handleFavoriteClick}
          favoriteCount={favorites.length}
          onCartClick={handleCartClick}
          cartCount={calculateSelectedCount(cartItems)}
          onOrderHistoryClick={handleOrderHistoryClick}
        />
        <OrderForm 
          cartItems={selectedItems}
          totalAmount={totalAmount}
          onSubmitOrder={handleOrderSubmit}
          onBack={handleBackToCart}
        />
      </Box>
    );
  }

  // 如果選中了商品，顯示商品詳細頁面
  if (selectedProduct) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />
        <Header 
          onSearchChange={handleSearchChange} 
          searchTerm={searchTerm}
          onFavoriteClick={handleFavoriteClick}
          favoriteCount={favorites.length}
          onCartClick={handleCartClick}
          cartCount={calculateSelectedCount(cartItems)}
          onOrderHistoryClick={handleOrderHistoryClick}
        />
        <ProductDetail 
          product={selectedProduct}
          onAddToCart={handleAddToCart}
          onBack={handleBackToList}
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
        />
        
        {/* 浮動購物車 */}
        {showCart && (
          <CartPage 
            cartItems={cartItems}
            setCartItems={setCartItems}
            onCloseCart={handleCloseCart}
            onCheckout={handleCheckout}
          />
        )}
      </Box>
    );
  }

  // 主要商品列表頁面
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header 
        onSearchChange={handleSearchChange} 
        searchTerm={searchTerm}
        onFavoriteClick={handleFavoriteClick}
        favoriteCount={favorites.length}
        onCartClick={handleCartClick}
        cartCount={calculateSelectedCount(cartItems)}
        onOrderHistoryClick={handleOrderHistoryClick}
      />

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        {!showFavorites && (
          <Sidebar
            selectedEntertainment={filters.entertainment}
            onEntertainmentSelect={handleEntertainmentSelect}
            onClearFilters={clearFilters}
          />
        )}

        {/* Product Grid */}
        <ProductGrid 
          products={displayProducts}
          onProductClick={handleProductClick}
          title={title}
          showCloseButton={showFavorites}
          onCloseFavorites={() => {
            setShowCart(false);
            handleBackToList();
          }}
        />
      </Box>

      {/* 浮動購物車 */}
      {showCart && (
        <CartPage 
          cartItems={cartItems}
          setCartItems={setCartItems}
          onCloseCart={handleCloseCart}
          onCheckout={handleCheckout}
        />
      )}
    </Box>
  );
};

/**
 * App 根組件 - 包裹 Provider
 */
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

