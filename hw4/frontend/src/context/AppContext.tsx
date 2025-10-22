import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User, Cafe, Visit, Wishlist } from '../types';
import * as authService from '../services/authService';
import * as cafeService from '../services/cafeService';
import * as visitService from '../services/visitService';
import * as wishlistService from '../services/wishlistService';

interface AppContextType {
  // Auth
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  
  // Cafes
  cafes: Cafe[];
  loadCafes: () => Promise<void>;
  addCafe: (cafe: Omit<Cafe, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCafe: (id: number, cafe: Partial<Cafe>) => Promise<void>;
  deleteCafe: (id: number) => Promise<void>;
  getCafeById: (id: number) => Cafe | undefined;
  
  // Visits
  visits: Visit[];
  loadVisits: () => Promise<void>;
  addVisit: (visit: { cafeId: number; visitDate: string; notes: string; rating: number }) => Promise<void>;
  deleteVisit: (id: number) => Promise<void>;
  
  // Wishlist
  wishlist: Wishlist[];
  loadWishlist: () => Promise<void>;
  addToWishlist: (cafeId: number, notes: string) => Promise<void>;
  removeFromWishlist: (id: number) => Promise<void>;
  isInWishlist: (cafeId: number) => boolean;
  
  // UI State
  selectedCafeId: number | null;
  setSelectedCafeId: (id: number | null) => void;
  
  // Loading & Error
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  // Data state
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [selectedCafeId, setSelectedCafeId] = useState<number | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化：檢查是否已登入
  useEffect(() => {
    const { token, user } = authService.getStoredAuth();
    if (token && user) {
      setAuth({ isAuthenticated: true, user });
      // 載入資料
      loadCafes();
      loadVisits();
      loadWishlist();
    }
  }, []);

  // Auth methods
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login(email, password);
      authService.saveAuth(data.token, data.user);
      setAuth({ isAuthenticated: true, user: data.user });
      // 登入後載入資料
      await Promise.all([loadCafes(), loadVisits(), loadWishlist()]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || '登入失敗';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.clearAuth();
    setAuth({ isAuthenticated: false, user: null });
    setCafes([]);
    setVisits([]);
    setWishlist([]);
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.register(username, email, password);
      authService.saveAuth(data.token, data.user);
      setAuth({ isAuthenticated: true, user: data.user });
      // 註冊後載入資料
      await Promise.all([loadCafes(), loadVisits(), loadWishlist()]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || '註冊失敗';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cafe methods
  const loadCafes = async () => {
    try {
      const data = await cafeService.getAllCafes();
      setCafes(data);
    } catch (err: any) {
      console.error('載入咖啡廳失敗:', err);
    }
  };

  const addCafe = async (cafeData: Omit<Cafe, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      await cafeService.createCafe(cafeData);
      await loadCafes(); // 重新載入列表
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || '新增咖啡廳失敗';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateCafe = async (id: number, updates: Partial<Cafe>) => {
    try {
      setLoading(true);
      setError(null);
      await cafeService.updateCafe(id, updates);
      await loadCafes(); // 重新載入列表
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || '更新咖啡廳失敗';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteCafe = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await cafeService.deleteCafe(id);
      await loadCafes(); // 重新載入列表
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || '刪除咖啡廳失敗';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getCafeById = (id: number): Cafe | undefined => {
    return cafes.find(cafe => cafe.id === id);
  };

  // Visit methods
  const loadVisits = async () => {
    try {
      const data = await visitService.getMyVisits();
      setVisits(data);
    } catch (err: any) {
      console.error('載入到訪記錄失敗:', err);
    }
  };

  const addVisit = async (visitData: { cafeId: number; visitDate: string; notes: string; rating: number }) => {
    try {
      setLoading(true);
      setError(null);
      await visitService.createVisit(visitData);
      await loadVisits(); // 重新載入列表
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || '新增到訪記錄失敗';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteVisit = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await visitService.deleteVisit(id);
      await loadVisits(); // 重新載入列表
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || '刪除到訪記錄失敗';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Wishlist methods
  const loadWishlist = async () => {
    try {
      const data = await wishlistService.getMyWishlist();
      setWishlist(data);
    } catch (err: any) {
      console.error('載入願望清單失敗:', err);
    }
  };

  const addToWishlist = async (cafeId: number, notes: string) => {
    try {
      setLoading(true);
      setError(null);
      await wishlistService.addToWishlist(cafeId, notes);
      await loadWishlist(); // 重新載入列表
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || '加入願望清單失敗';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await wishlistService.removeFromWishlist(id);
      await loadWishlist(); // 重新載入列表
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || '移除願望清單失敗';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (cafeId: number): boolean => {
    return wishlist.some(item => item.cafeId === cafeId);
  };

  const value: AppContextType = {
    auth,
    login,
    logout,
    register,
    cafes,
    loadCafes,
    addCafe,
    updateCafe,
    deleteCafe,
    getCafeById,
    visits,
    loadVisits,
    addVisit,
    deleteVisit,
    wishlist,
    loadWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    selectedCafeId,
    setSelectedCafeId,
    loading,
    error,
    setError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
