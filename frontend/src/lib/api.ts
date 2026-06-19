import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur de requête : ajouter le token JWT si présent
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('cesizen_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse : gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.includes('/connexion')
    ) {
      // Purge COMPLÈTE de l'auth pour éviter une boucle de redirection :
      // le middleware lit le cookie `cesizen-auth` (état Zustand persisté) ;
      // si on ne vide que le localStorage du token, il croit l'utilisateur
      // encore connecté et renvoie /connexion -> /dashboard à l'infini.
      localStorage.removeItem('cesizen_token');
      localStorage.removeItem('cesizen-auth'); // état Zustand persisté
      document.cookie = 'cesizen-auth=;path=/;max-age=0;SameSite=Lax';
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

export default api;
