import api from './api';
import { Visit } from '../types';

interface VisitsResponse {
  visits: Visit[];
}

interface VisitResponse {
  visit: Visit;
  message?: string;
}

// 取得我的所有到訪記錄
export async function getMyVisits(): Promise<Visit[]> {
  const response = await api.get<VisitsResponse>('/api/visits');
  return response.data.visits;
}

// 取得特定咖啡廳的到訪記錄
export async function getCafeVisits(cafeId: number): Promise<Visit[]> {
  const response = await api.get<VisitsResponse>(`/api/visits/cafe/${cafeId}`);
  return response.data.visits;
}

// 新增到訪記錄
export async function createVisit(visitData: {
  cafeId: number;
  visitDate: string;
  notes: string;
  rating: number;
}): Promise<Visit> {
  const response = await api.post<VisitResponse>('/api/visits', visitData);
  return response.data.visit;
}

// 更新到訪記錄
export async function updateVisit(id: number, visitData: Partial<Visit>): Promise<Visit> {
  const response = await api.put<VisitResponse>(`/api/visits/${id}`, visitData);
  return response.data.visit;
}

// 刪除到訪記錄
export async function deleteVisit(id: number): Promise<void> {
  await api.delete(`/api/visits/${id}`);
}

