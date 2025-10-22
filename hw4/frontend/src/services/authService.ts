import api from './api';
import { User } from '../types';

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// 註冊
export async function register(username: string, email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', {
    username,
    email,
    password,
  });
  return response.data;
}

// 登入
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return response.data;
}

// 取得當前使用者資訊
export async function getCurrentUser(): Promise<{ user: User }> {
  const response = await api.get<{ user: User }>('/auth/me');
  return response.data;
}

// 儲存認證資訊到 localStorage
export function saveAuth(token: string, user: User) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

// 取得儲存的認證資訊
export function getStoredAuth() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user };
}

// 清除認證資訊
export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

