import { useAuthStore } from '@/lib/auth-store';

export function useAuth() {
  const store = useAuthStore();

  const isAdmin = store.user?.role?.nom === 'administrateur';

  return {
    ...store,
    isAdmin,
  };
}
