import api from './api';
import { User } from '../types';
export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data as { token: string; user: User };
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data as User;
  },
  logout: () => {
    localStorage.removeItem('tss_token');
    localStorage.removeItem('tss_user');
  },
};
