import { Stack } from 'expo-router';
import AdminGuard from '@/components/AdminGuard';
import { Colors } from '@/lib/colors';

/** Pile de navigation de l'espace d'administration (protégée par AdminGuard). */
export default function AdminLayout() {
  return (
    <AdminGuard>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.primary,
          headerTitleStyle: { fontWeight: '700', color: Colors.black },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Administration' }} />
        <Stack.Screen name="utilisateurs" options={{ title: 'Utilisateurs' }} />
        <Stack.Screen name="contenus" options={{ title: 'Contenus' }} />
        <Stack.Screen name="emotions" options={{ title: 'Émotions' }} />
      </Stack>
    </AdminGuard>
  );
}
