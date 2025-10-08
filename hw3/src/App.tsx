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
import { getFilteredProducts, getPopularProducts, searchProducts, getProducts } from './data/products';
import { FilterOptions, Product, CartItem } from './types';

const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
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

  // 從 localStorage 載入最愛清單和購物車
  useEffect(() => {
    const savedFavorites = localStorage.getItem('kpop-merchandise-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('載入最愛清單時發生錯誤:', error);
      }
    }

    const savedCart = localStorage.getItem('kpop-merchandise-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('載入購物車時發生錯誤:', error);
      }
    }

    // 新增 keydown 監聽器來處理 ESC 鍵
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

  // 儲存最愛清單和購物車到 localStorage
  useEffect(() => {
    localStorage.setItem('kpop-merchandise-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('kpop-merchandise-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleEntertainmentSelect = (entertainment: string) => {
    // 只保留娛樂公司篩選，清除其他所有篩選條件
    setFilters({
      entertainment,
    });
    setSearchTerm(''); // 清除搜尋
  };

  const handleGroupSelect = (group: string) => {
    // 只保留團體篩選，清除其他所有篩選條件
    setFilters({
      group_name: group,
    });
    setSearchTerm(''); // 清除搜尋
  };


  const clearFilters = () => {
    setFilters({});
    setSearchTerm(''); // 清除搜尋
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    // 清空搜尋時清除搜尋狀態
    if (!term.trim()) {
      setSearchTerm('');
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
    setShowFavorites(false); // 確保回到首頁
    setSearchTerm(''); // 清除搜尋
    setFilters({}); // 清除篩選
  };

  // 處理最愛商品
  const handleFavoriteToggle = (productId: number) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleFavoriteClick = () => {
    setShowFavorites(true); // 始終開啟最愛頁面
    setShowCart(false); // 關閉購物車
    setShowOrderHistory(false); // 關閉訂單歷史
    setSearchTerm(''); // 清除搜尋
    setFilters({}); // 清除篩選
    setSelectedProduct(null); // 如果正在查看商品，也要關閉
  };

  // 關閉最愛顯示
  const handleCloseFavorites = () => {
    setShowFavorites(false);
  };

  // 處理購物車
  const handleAddToCart = (product: Product, selectedOption?: string, quantity: number = 1) => {
    // 檢查庫存限制
    if (quantity > product.stock) {
      console.warn(`無法加入購物車：請求數量 ${quantity} 超過庫存 ${product.stock}`);
      return;
    }

    // 正規化選項值，確保 undefined 和空字串被視為相同
    const normalizedOption = selectedOption || undefined;
    
    const existingItemIndex = cartItems.findIndex(
      item => item.product.product_id === product.product_id && 
      (item.selectedOption || undefined) === normalizedOption
    );

    if (existingItemIndex >= 0) {
      // 如果商品已存在，檢查累加後是否超過庫存
      const currentQuantity = cartItems[existingItemIndex].quantity;
      const newTotalQuantity = currentQuantity + quantity;
      
      if (newTotalQuantity > product.stock) {
        console.warn(`無法累加數量：累加後數量 ${newTotalQuantity} 超過庫存 ${product.stock}`);
        return;
      }
      
      // 如果商品已存在，累加數量
      setCartItems(prev => prev.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
      console.log(`商品 ${product.product_name} 已存在，累加數量 ${quantity}，新總數: ${newTotalQuantity}`);
    } else {
      // 如果商品不存在，新增到購物車
      const newCartItem: CartItem = {
        product,
        quantity,
        selectedOption: normalizedOption,
        isSelected: true
      };
      setCartItems(prev => [...prev, newCartItem]);
      console.log(`新增商品 ${product.product_name} 到購物車，數量: ${quantity}，選項: ${normalizedOption || '無'}`);
    }

    // 跳轉到購物車畫面，但保持原本的瀏覽狀態
    setShowCart(true);
    setSelectedProduct(null);
    setShowFavorites(false);
  };

  const handleCartClick = () => {
    setShowCart(true);
    setShowFavorites(false); // 關閉最愛
    setShowOrderHistory(false); // 關閉訂單歷史
    setSelectedProduct(null);
  };

  const handleCloseCart = () => {
    setShowCart(false);
  };

  // 處理結帳
  const handleCheckout = () => {
    setShowOrderForm(true);
    setShowCart(false);
  };

  // 處理訂單提交
  const handleSubmitOrder = (submittedOrderData: any) => {
    console.log('訂單已提交:', submittedOrderData);
    
    // 保存訂單到 localStorage
    const savedOrders = localStorage.getItem('kpop-merchandise-orders');
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    orders.push(submittedOrderData);
    localStorage.setItem('kpop-merchandise-orders', JSON.stringify(orders));
    
    // 只移除已勾選的商品，保留未勾選的商品
    setCartItems(prev => prev.filter(item => !item.isSelected));
    
    setOrderData(submittedOrderData);
    setShowOrderForm(false);
    setShowOrderConfirmation(true);
  };

  // 處理返回購物車
  const handleBackToCart = () => {
    setShowOrderForm(false);
    setShowCart(true);
  };

  // 處理關閉訂單確認頁面
  const handleCloseOrderConfirmation = () => {
    setShowOrderConfirmation(false);
    setOrderData(null);
    setSearchTerm('');
    setFilters({});
    setSelectedProduct(null);
    setShowFavorites(false);
    setShowCart(false);
  };

  // 處理訂單歷史點擊
  const handleOrderHistoryClick = () => {
    setShowOrderHistory(true);
    setShowFavorites(false); // 關閉最愛
    setShowCart(false); // 關閉購物車
    setSearchTerm('');
    setFilters({});
    setSelectedProduct(null);
    setShowOrderForm(false);
    setShowOrderConfirmation(false);
  };

  // 處理關閉訂單歷史頁面
  const handleCloseOrderHistory = () => {
    setShowOrderHistory(false);
  };

  // 獲取要顯示的商品和標題
  const getDisplayData = async () => {
    // 如果顯示訂單表單，優先顯示訂單表單
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

    // 如果顯示最愛，優先顯示最愛商品
    if (showFavorites) {
      const products = await getProducts();
      const favoriteProducts = favorites.map(id => 
        products.find((p: Product) => p.product_id === id)
      ).filter((product): product is Product => product !== undefined);
      
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
    const hasFilters = filters.entertainment || filters.group_name;
    
    if (hasFilters) {
      // 有篩選條件時，顯示篩選後的商品
      const filteredProducts = await getFilteredProducts(filters);
      let title = '';
      
      if (filters.group_name) {
        title = `${filters.group_name} 商品`;
      } else if (filters.entertainment) {
        title = `${filters.entertainment} 商品`;
      }
      
      return { products: filteredProducts, title };
    } else {
      // 沒有篩選條件時，顯示最熱門的商品（前10個）
      const popularProducts = await getPopularProducts(10);
      return { 
        products: popularProducts, 
        title: '熱門商品 TOP 10' 
      };
    }
  };

  const [displayData, setDisplayData] = useState<any>(null);
  const [isLoadingDisplayData, setIsLoadingDisplayData] = useState(false);

  // 更新顯示資料
  useEffect(() => {
    const updateDisplayData = async () => {
      if (!isDataLoaded) return;
      
      setIsLoadingDisplayData(true);
      try {
        const data = await getDisplayData();
        setDisplayData(data);
      } catch (error) {
        console.error('更新顯示資料時發生錯誤:', error);
      } finally {
        setIsLoadingDisplayData(false);
      }
    };

    updateDisplayData();
  }, [isDataLoaded, showOrderForm, showCart, showFavorites, searchTerm, filters, favorites, cartItems]);

  const displayProducts = displayData && 'products' in displayData ? (displayData.products || []) : [];
  const title = displayData?.title || '載入中...';

  // 載入中或錯誤狀態
  if (!isDataLoaded || loadingError) {
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
          cartCount={cartItems.length}
          onOrderHistoryClick={handleOrderHistoryClick}
        />

        {/* Loading or Error State */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#ffffff'
        }}>
          {loadingError ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
                {loadingError}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                請檢查 merchandise_2.csv 檔案是否存在於 /public/data/ 目錄中
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                正在載入商品資料...
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                請稍候
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
        
        {/* Header */}
        <Header 
          onSearchChange={handleSearchChange} 
          searchTerm={searchTerm}
          onFavoriteClick={handleFavoriteClick}
          favoriteCount={favorites.length}
          onCartClick={handleCartClick}
          cartCount={cartItems.length}
          onOrderHistoryClick={handleOrderHistoryClick}
        />

        {/* Order History */}
        <Box sx={{ flex: 1, backgroundColor: '#ffffff' }}>
          <OrderHistory 
            onClose={handleCloseOrderHistory}
          />
        </Box>
      </Box>
    );
  }

  // 如果顯示訂單確認頁面
  if (showOrderConfirmation && orderData) {
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
          cartCount={cartItems.length}
          onOrderHistoryClick={handleOrderHistoryClick}
        />

        {/* Order Confirmation */}
        <Box sx={{ flex: 1, backgroundColor: '#ffffff' }}>
          <OrderConfirmation 
            orderData={orderData}
            onClose={handleCloseOrderConfirmation}
          />
        </Box>
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
        
        {/* Header */}
        <Header 
          onSearchChange={handleSearchChange} 
          searchTerm={searchTerm}
          onFavoriteClick={handleFavoriteClick}
          favoriteCount={favorites.length}
          onCartClick={handleCartClick}
          cartCount={cartItems.length}
          onOrderHistoryClick={handleOrderHistoryClick}
        />

        {/* Order Form */}
        <Box sx={{ flex: 1, backgroundColor: '#ffffff' }}>
          <OrderForm 
            cartItems={selectedItems}
            totalAmount={totalAmount}
            onBack={handleBackToCart}
            onSubmitOrder={handleSubmitOrder}
          />
        </Box>
      </Box>
    );
  }

  // 如果選中了商品，顯示商品詳細頁面
  if (selectedProduct) {
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
          cartCount={cartItems.length}
          onOrderHistoryClick={handleOrderHistoryClick}
        />

        {/* Product Detail */}
        <Box sx={{ flex: 1, backgroundColor: '#ffffff' }}>
          <ProductDetail 
            product={selectedProduct} 
            onBack={handleBackToList}
            onFavoriteToggle={handleFavoriteToggle}
            favorites={favorites}
            onAddToCart={handleAddToCart}
          />
        </Box>
      </Box>
    );
  }

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
        cartCount={cartItems.length}
        onOrderHistoryClick={handleOrderHistoryClick}
      />

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Sidebar - 如果顯示最愛則隱藏，購物車時保持顯示 */}
        {!showFavorites && (
          <Sidebar
            selectedEntertainment={filters.entertainment}
            selectedGroup={filters.group_name}
            onEntertainmentSelect={handleEntertainmentSelect}
            onGroupSelect={handleGroupSelect}
            onClearFilters={clearFilters}
          />
        )}

        {/* Product Grid */}
        <Box sx={{ flex: 1, backgroundColor: '#ffffff' }}>
          {showFavorites ? (
            <ProductGrid 
              products={displayProducts} 
              title={title} 
              onProductClick={handleProductClick}
              onCloseFavorites={handleCloseFavorites}
              showCloseButton={true}
              hideEmptyMessage={true}
            />
          ) : (
            <ProductGrid 
              products={displayProducts} 
              title={title} 
              onProductClick={handleProductClick}
            />
          )}
        </Box>
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

export default App;
