import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Colors } from '@/lib/colors';
import { Radius, Shadow, Spacing } from '@/lib/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  /** Padding interne (défaut lg = 16). Mettre 0 pour gérer soi-même. */
  padding?: number;
  /** Légère ombre portée. */
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Conteneur DSFR : fond blanc, bordure grise fine, coins peu arrondis. */
export default function Card({ children, onPress, padding = Spacing.lg, elevated = false, style }: CardProps) {
  const content = [styles.card, { padding }, elevated && Shadow.card, style];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [content, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={content}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: Radius.sm,
  },
  pressed: { backgroundColor: Colors.gray[50] },
});
