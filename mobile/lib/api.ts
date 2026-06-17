import axios, { isAxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/** Forme standard d'une réponse d'erreur de l'API Laravel. */
export interface ApiErrorData {
  message?: string;
  errors?: Record<string, string[] | string>;
}

/** Extrait proprement le corps d'erreur d'une exception (sans recourir à `any`). */
export function getApiError(error: unknown): ApiErrorData {
  if (isAxiosError(error)) {
    return (error.response?.data as ApiErrorData) ?? {};
  }
  return {};
}

// En production, définir EXPO_PUBLIC_API_URL (ex. https://api.cesizen.fr/api/v1)
// dans l'environnement de build (eas.json / .env). À défaut, on retombe sur la
// configuration de développement local par plateforme (émulateur Android = 10.0.2.2).
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Platform.select({
    android: 'http://10.0.2.2:8000/api/v1',
    ios: 'http://localhost:8000/api/v1',
    default: 'http://localhost:8000/api/v1',
  });

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('cesizen_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Évite d'invalider la session sur les endpoints publics d'auth (login/register/forgot)
function isAuthPublicEndpoint(url?: string): boolean {
  if (!url) return false;
  return /\/auth\/(login|register|forgot)/.test(url);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const url: string | undefined = error.config?.url;

    if (status === 401 && !isAuthPublicEndpoint(url)) {
      await SecureStore.deleteItemAsync('cesizen_token');
      // Le AuthGuard de _layout détecte l'absence de token au prochain loadToken
      // et redirige vers /auth/login.
      try {
        const { useAuthStore } = require('./auth-store');
        useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
      } catch {
        // store pas encore monté
      }
    }
    return Promise.reject(error);
  }
);

export default api;
