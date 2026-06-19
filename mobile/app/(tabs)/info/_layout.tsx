import { Stack } from 'expo-router';
import { Colors } from '@/lib/colors';
import { FontWeight } from '@/lib/theme';

export default function InfoLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTitleStyle: { fontWeight: FontWeight.bold, color: Colors.black },
        headerTintColor: Colors.primary,
      }}
    >
      {/* La liste rend son propre <AppBar/>, on masque le header natif. */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Le détail garde un header natif avec bouton retour. */}
      <Stack.Screen name="[slug]" options={{ title: 'Article', headerBackTitle: 'Retour' }} />
    </Stack>
  );
}
