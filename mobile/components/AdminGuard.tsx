import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/lib/auth-store';

/**
 * Garde d'affichage pour les écrans d'administration.
 * Si l'utilisateur connecté n'est pas administrateur, on le renvoie vers
 * l'espace principal. La sécurité réelle reste assurée côté serveur (middleware
 * role:administrateur) ; ce composant évite simplement d'afficher l'UI admin.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const estAdmin = user?.role?.nom === 'administrateur';

  useEffect(() => {
    if (!estAdmin) {
      router.replace('/(tabs)');
    }
  }, [estAdmin, router]);

  if (!estAdmin) {
    return null;
  }

  return <>{children}</>;
}
