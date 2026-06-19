import { Stack } from 'expo-router';
import { Colors } from '@/lib/colors';
import { FontWeight } from '@/lib/theme';

export default function JournalLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTitleStyle: { fontWeight: FontWeight.bold, color: Colors.black },
        headerTintColor: Colors.primary,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="reports" options={{ headerShown: false }} />
      <Stack.Screen name="new" options={{ title: 'Nouvelle saisie', presentation: 'modal' }} />
      <Stack.Screen name="edit" options={{ title: 'Modifier la saisie', presentation: 'modal' }} />
    </Stack>
  );
}
