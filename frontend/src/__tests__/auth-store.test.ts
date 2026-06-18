import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/lib/auth-store';
import type { Utilisateur } from '@/types';

const fakeUser = {
  id: 1,
  nom: 'Martin',
  prenom: 'Claire',
  email: 'claire@email.fr',
  role: { id: 2, nom: 'membre' },
} as unknown as Utilisateur;

describe('auth-store', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  it('démarre déconnecté', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
  });

  it('setAuth stocke le token et authentifie l\'utilisateur', () => {
    useAuthStore.getState().setAuth(fakeUser, 'jwt-123');
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('jwt-123');
    expect(state.user?.email).toBe('claire@email.fr');
    expect(localStorage.getItem('cesizen_token')).toBe('jwt-123');
  });

  it('setAuth(null) déconnecte et purge le token', () => {
    useAuthStore.getState().setAuth(fakeUser, 'jwt-123');
    useAuthStore.getState().setAuth(null, null);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(localStorage.getItem('cesizen_token')).toBeNull();
  });
});
