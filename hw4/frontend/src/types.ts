// 咖啡廳類型
export interface Cafe {
  id: number;
  name: string;
  description: string;
  address: string;
  rating?: number;
  priceLevel?: number; // 1-4
  hasWifi: boolean;
  hasPowerOutlets: boolean;
  hasTimeLimit: boolean; // 有無時間限制
  isNoisy: boolean; // 是否會吵雜
  hasGoodLighting: boolean; // 光線是否充足
  hasAvailableSeats: boolean; // 是否經常有座位
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

// 使用者類型
export interface User {
  id: number;
  username: string;
  email: string;
}

// 到訪記錄類型
export interface Visit {
  id: number;
  cafeId: number;
  userId: number;
  visitDate: string;
  notes: string;
  rating: number;
  createdAt: string;
}

// 願望清單類型
export interface Wishlist {
  id: number;
  cafeId: number;
  userId: number;
  notes: string;
  createdAt: string;
}

// 登入狀態類型
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

