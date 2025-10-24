import { publicApi } from './api';
import { Cafe } from '../types';

interface CafesResponse {
  cafes: Cafe[];
}

interface CafeResponse {
  cafe: Cafe;
  message?: string;
}

// 取得所有咖啡廳
export async function getAllCafes(query?: string, category?: string): Promise<Cafe[]> {
  const params: any = {};
  if (query) params.q = query;
  if (category && category !== 'all') params.category = category;

  const response = await publicApi.get<CafesResponse>('/api/cafes', { params });
  return response.data.cafes;
}

// 取得單一咖啡廳
export async function getCafeById(id: number): Promise<Cafe> {
  const response = await publicApi.get<CafeResponse>(`/api/cafes/${id}`);
  return response.data.cafe;
}

// 新增咖啡廳
export async function createCafe(cafeData: Omit<Cafe, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<Cafe> {
  const response = await publicApi.post<CafeResponse>('/api/cafes', cafeData);
  return response.data.cafe;
}

// 更新咖啡廳
export async function updateCafe(id: number, cafeData: Partial<Cafe>): Promise<Cafe> {
  const response = await publicApi.put<CafeResponse>(`/api/cafes/${id}`, cafeData);
  return response.data.cafe;
}

// 刪除咖啡廳
export async function deleteCafe(id: number): Promise<void> {
  await publicApi.delete(`/api/cafes/${id}`);
}

