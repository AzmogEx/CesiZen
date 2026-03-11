import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from './api';
import type { Utilisateur } from '@/types';

function syncCookie(user: Utilisateur | null, token: string | null) {
  if (typeof document === 'undefined') return;
  if (token) {
    const value = JSON.stringify({
      state: {
        token,
        isAuthenticated: true,
        user: user ? { role: { nom: user.role?.nom } } : null,
      },
    });
    document.cookie = `cesizen-auth=${encodeURIComponent(value)};path=/;max-age=${60 * 60 * 24 * 7};SameSite=Lax`;
  } else {
    document.cookie = 'cesizen-auth=;path=/;max-age=0';
  }
}

interface AuthState {
  user: Utilisateur | null;
  token: string | null;
  isAuthenticated: boolean;
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
  setAuth: (user: Utilisateur | null, token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        const { utilisateur, token } = response.data;
        localStorage.setItem('cesizen_token', token);
        syncCookie(utilisateur, token);
        set({ user: utilisateur, token, isAuthenticated: true });
      },

      register: async (data) => {
        const response = await api.post('/auth/register', data);
        const { utilisateur, token } = response.data;
        localStorage.setItem('cesizen_token', token);
        syncCookie(utilisateur, token);
        set({ user: utilisateur, token, isAuthenticated: true });
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {
          // Ignorer les erreurs de déconnexion
        }
        localStorage.removeItem('cesizen_token');
        syncCookie(null, null);
        set({ user: null, token: null, isAuthenticated: false });
      },

      fetchUser: async () => {
        const response = await api.get('/auth/me');
        set({ user: response.data });
      },

      setAuth: (user: Utilisateur | null, token: string | null) => {
        if (token) {
          localStorage.setItem('cesizen_token', token);
        } else {
          localStorage.removeItem('cesizen_token');
        }
        set({ user, token, isAuthenticated: !!token });
      },
    }),
    {
      name: 'cesizen-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            syncCookie(state.user, state.token);
          }
        };
      },
    }
  )
);
