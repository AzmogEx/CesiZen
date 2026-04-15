import { Stack } from 'expo-router';
import { Colors } from '@/lib/colors';

export default function JournalLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTitleStyle: { fontWeight: '700', color: Colors.black },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Mon journal' }} />
      <Stack.Screen name="new" options={{ title: 'Nouvelle saisie', presentation: 'modal' }} />
      <Stack.Screen name="edit" options={{ title: 'Modifier la saisie', presentation: 'modal' }} />
      <Stack.Screen name="reports" options={{ title: 'Mes rapports' }} />
    </Stack>
  );
}
