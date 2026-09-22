import api from '../services/api';

export interface User {
  id: number;
  name: string;
  email: string;
  roles: Array<{ id: number; name: string; slug: string }>;
  organizer_profile?: any;
}

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
};
