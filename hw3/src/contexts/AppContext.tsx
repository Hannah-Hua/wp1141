import React, { createContext, useContext, ReactNode } from 'react';
import { Product, CartItem, FilterOptions } from '../types';
import { useCartState } from '../hooks/useCartState';
import { useFavoritesState } from '../hooks/useFavoritesState';
import { useProductsData } from '../hooks/useProductsData';
import { useUINavigation } from '../hooks/useUINavigation';
import { useFilterAndSearch } from '../hooks/useFilterAndSearch';

/**
 * App Context 型別定義
 */
interface AppContextType {
  // 商品資料
  isDataLoaded: boolean;
  loadingError: string | null;
  
  // 購物車
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (product: Product, selectedOption?: string, quantity?: number) => void;
  removeSelectedItems: () => void;
  
  // 最愛
  favorites: number[];
  setFavorites: React.Dispatch<React.SetStateAction<number[]>>;
  handleFavoriteToggle: (productId: number) => void;
  
  // UI 導航
  selectedProduct: Product | null;
  showFavorites: boolean;
  showCart: boolean;
  showOrderForm: boolean;
  showOrderConfirmation: boolean;
  showOrderHistory: boolean;
  orderData: any;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  handleProductClick: (product: Product) => void;
  handleBackToList: () => void;
  handleFavoriteClick: () => void;
  handleCloseFavorites: () => void;
  handleCartClick: () => void;
  handleCloseCart: () => void;
  handleCheckout: () => void;
  handleBackToCart: () => void;
  handleSubmitOrder: (orderData: any) => void;
  handleCloseOrderConfirmation: () => void;
  handleOrderHistoryClick: () => void;
  handleCloseOrderHistory: () => void;
  
  // 篩選和搜尋
  filters: FilterOptions;
  searchTerm: string;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleEntertainmentSelect: (entertainment: string) => void;
  clearFilters: () => void;
  handleSearchChange: (term: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * App Provider 組件
 */
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // 使用各個自定義 hooks
  const productsData = useProductsData();
  const cartState = useCartState();
  const favoritesState = useFavoritesState();
  const uiNavigation = useUINavigation();
  const filterAndSearch = useFilterAndSearch();

  const value: AppContextType = {
    // 商品資料
    isDataLoaded: productsData.isDataLoaded,
    loadingError: productsData.loadingError,
    
    // 購物車
    cartItems: cartState.cartItems,
    setCartItems: cartState.setCartItems,
    addToCart: cartState.addToCart,
    removeSelectedItems: cartState.removeSelectedItems,
    
    // 最愛
    favorites: favoritesState.favorites,
    setFavorites: favoritesState.setFavorites,
    handleFavoriteToggle: favoritesState.handleFavoriteToggle,
    
    // UI 導航
    selectedProduct: uiNavigation.selectedProduct,
    showFavorites: uiNavigation.showFavorites,
    showCart: uiNavigation.showCart,
    showOrderForm: uiNavigation.showOrderForm,
    showOrderConfirmation: uiNavigation.showOrderConfirmation,
    showOrderHistory: uiNavigation.showOrderHistory,
    orderData: uiNavigation.orderData,
    setSelectedProduct: uiNavigation.setSelectedProduct,
    setShowCart: uiNavigation.setShowCart,
    handleProductClick: uiNavigation.handleProductClick,
    handleBackToList: uiNavigation.handleBackToList,
    handleFavoriteClick: uiNavigation.handleFavoriteClick,
    handleCloseFavorites: uiNavigation.handleCloseFavorites,
    handleCartClick: uiNavigation.handleCartClick,
    handleCloseCart: uiNavigation.handleCloseCart,
    handleCheckout: uiNavigation.handleCheckout,
    handleBackToCart: uiNavigation.handleBackToCart,
    handleSubmitOrder: uiNavigation.handleSubmitOrder,
    handleCloseOrderConfirmation: uiNavigation.handleCloseOrderConfirmation,
    handleOrderHistoryClick: uiNavigation.handleOrderHistoryClick,
    handleCloseOrderHistory: uiNavigation.handleCloseOrderHistory,
    
    // 篩選和搜尋
    filters: filterAndSearch.filters,
    searchTerm: filterAndSearch.searchTerm,
    setFilters: filterAndSearch.setFilters,
    setSearchTerm: filterAndSearch.setSearchTerm,
    handleEntertainmentSelect: filterAndSearch.handleEntertainmentSelect,
    clearFilters: filterAndSearch.clearFilters,
    handleSearchChange: filterAndSearch.handleSearchChange,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * 使用 App Context 的 Hook
 */
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

