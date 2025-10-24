// 使用者類型
export interface User {
  id: number;
  username: string;
  email: string;
  password: string; // 雜湊後的密碼
  createdAt: string;
}

// 咖啡廳類型
export interface Cafe {
  id: number;
  name: string;
  description: string;
  address: string;
  rating: number | null;
  priceLevel: number | null; // 1-4
  hasWifi: number; // SQLite boolean (0 or 1)
  hasPowerOutlets: number;
  hasTimeLimit: number;
  isNoisy: number;
  hasGoodLighting: number;
  hasAvailableSeats: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
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

// JWT Payload
export interface JWTPayload {
  userId: number;
  email: string;
}

// 請求類型（帶有使用者資訊）
export interface AuthRequest extends Express.Request {
  user?: JWTPayload;
}

