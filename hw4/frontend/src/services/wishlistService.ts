import api from './api';
import { Wishlist } from '../types';

interface WishlistResponse {
  wishlist: Wishlist[];
}

interface WishlistItemResponse {
  item: Wishlist;
  message?: string;
}

interface CheckWishlistResponse {
  inWishlist: boolean;
  item: Wishlist | null;
}

// 取得我的願望清單
export async function getMyWishlist(): Promise<Wishlist[]> {
  const response = await api.get<WishlistResponse>('/api/wishlist');
  return response.data.wishlist;
}

// 檢查咖啡廳是否在願望清單中
export async function checkInWishlist(cafeId: number): Promise<CheckWishlistResponse> {
  const response = await api.get<CheckWishlistResponse>(`/api/wishlist/check/${cafeId}`);
  return response.data;
}

// 加入願望清單
export async function addToWishlist(cafeId: number, notes: string): Promise<Wishlist> {
  const response = await api.post<WishlistItemResponse>('/api/wishlist', {
    cafeId,
    notes,
  });
  return response.data.item;
}

// 更新願望清單備註
export async function updateWishlist(id: number, notes: string): Promise<Wishlist> {
  const response = await api.put<WishlistItemResponse>(`/api/wishlist/${id}`, {
    notes,
  });
  return response.data.item;
}

// 從願望清單移除（使用項目 ID）
export async function removeFromWishlist(id: number): Promise<void> {
  await api.delete(`/api/wishlist/${id}`);
}

// 從願望清單移除（使用咖啡廳 ID）
export async function removeFromWishlistByCafeId(cafeId: number): Promise<void> {
  await api.delete(`/api/wishlist/cafe/${cafeId}`);
}

