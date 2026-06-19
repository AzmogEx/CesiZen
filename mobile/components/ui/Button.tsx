import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, MIN_TOUCH, MIN_TOUCH_SM, Radius, Spacing } from '@/lib/theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'tertiary';
type Size = 'md' | 'sm';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  /** Nom d'icône Ionicons affichée à gauche du libellé. */
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Bouton DSFR. 4 variantes : primary (bleu plein), secondary (contour),
 * danger (rouge plein), tertiary (texte seul). Hauteur ≥ 44px (accessibilité).
 */
export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const palette = VARIANTS[variant];
  const minHeight = size === 'sm' ? MIN_TOUCH_SM : MIN_TOUCH;
  const fontSize = size === 'sm' ? FontSize.sm : FontSize.md;
  const iconSize = fontSize + Spacing.xs - 1;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight,
          paddingVertical: size === 'sm' ? Spacing.sm : Spacing.md,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderWidth: palette.border === 'transparent' ? 0 : 1,
        },
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && { opacity: 0.85 },
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <Ionicons name={icon} size={iconSize} color={palette.text} />}
          <Text style={[styles.label, { color: palette.text, fontSize }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const VARIANTS: Record<Variant, { bg: string; text: string; border: string }> = {
  primary: { bg: Colors.primary, text: Colors.white, border: 'transparent' },
  secondary: { bg: Colors.white, text: Colors.primary, border: Colors.primary },
  danger: { bg: Colors.error, text: Colors.white, border: 'transparent' },
  tertiary: { bg: 'transparent', text: Colors.primary, border: 'transparent' },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { alignSelf: 'stretch', width: '100%' },
  disabled: { opacity: 0.45 },
  content: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  label: { fontWeight: FontWeight.semibold },
});
