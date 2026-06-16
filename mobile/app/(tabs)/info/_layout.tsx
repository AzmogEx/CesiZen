import { Stack } from 'expo-router';
import { Colors } from '@/lib/colors';

export default function InfoLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTitleStyle: { fontWeight: '700', color: Colors.black },
        headerTintColor: Colors.secondary,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Infos' }} />
      <Stack.Screen name="[slug]" options={{ title: '', headerBackTitle: 'Retour' }} />
    </Stack>
  );
}
