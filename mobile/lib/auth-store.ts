import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api from './api';
import type { Utilisateur } from '@/types';

interface AuthState {
  user: Utilisateur | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    nom: string;
    prenom: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  loadToken: async () => {
    const token = await SecureStore.getItemAsync('cesizen_token');
    if (token) {
      set({ token, isAuthenticated: true, isLoading: false });
      try {
        const response = await api.get('/auth/me');
        set({ user: response.data });
      } catch {
        await SecureStore.deleteItemAsync('cesizen_token');
        set({ token: null, isAuthenticated: false, user: null, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { utilisateur, token } = response.data;
    await SecureStore.setItemAsync('cesizen_token', token);
    set({ user: utilisateur, token, isAuthenticated: true });
  },

  register: async (data) => {
    const response = await api.post('/auth/register', data);
    const { utilisateur, token } = response.data;
    await SecureStore.setItemAsync('cesizen_token', token);
    set({ user: utilisateur, token, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    await SecureStore.deleteItemAsync('cesizen_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    const response = await api.get('/auth/me');
    set({ user: response.data });
  },
}));
