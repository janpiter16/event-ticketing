import api from './api';
import { User } from '../types';

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export const authService = {
  login: (credentials: Record<string, string>): Promise<AuthResponse> =>
    api.post('/auth/login', credentials),

  register: (data: Record<string, string>): Promise<AuthResponse> =>
    api.post('/auth/register', data),

  me: (): Promise<{ success: boolean; data: User }> =>
    api.get('/auth/me'),

  logout: (): Promise<{ success: boolean; message: string }> =>
    api.post('/auth/logout'),

  forgotPassword: (data: { email: string }): Promise<{ success: boolean; message: string }> =>
    api.post('/auth/forgot-password', data),

  resetPassword: (data: Record<string, string>): Promise<{ success: boolean; message: string }> =>
    api.post('/auth/reset-password', data),
};
