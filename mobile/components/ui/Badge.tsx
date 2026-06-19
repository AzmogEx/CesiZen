import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, Radius, Spacing } from '@/lib/theme';

type Tone = 'neutral' | 'success' | 'error' | 'info' | 'warning' | 'primary';

interface BadgeProps {
  label: string;
  tone?: Tone;
  /** Couleur personnalisée (ex. couleur d'une émotion) — prioritaire sur `tone`. */
  color?: string;
  uppercase?: boolean;
}

/** Pastille d'état DSFR, taille homogène. */
export default function Badge({ label, tone = 'neutral', color, uppercase = false }: BadgeProps) {
  const palette = color ? { bg: hexWithAlpha(color, 0.14), text: darken(color) } : TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.text, { color: palette.text }, uppercase && styles.uppercase]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const TONES: Record<Tone, { bg: string; text: string }> = {
  neutral: { bg: Colors.gray[100], text: Colors.gray[600] },
  success: { bg: Colors.successBg, text: Colors.success },
  error: { bg: Colors.errorBg, text: Colors.error },
  info: { bg: '#E8EDFF', text: Colors.info },
  warning: { bg: '#FFE9C7', text: Colors.warning },
  primary: { bg: '#E3E3FD', text: Colors.primary },
};

/** Ajoute un canal alpha (0–1) à une couleur hex #RRGGBB. */
function hexWithAlpha(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return `${hex}${a}`;
}

/** Pour le texte sur fond teinté, on garde la couleur d'origine (lisible sur 14% d'alpha). */
function darken(hex: string): string {
  return hex;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  text: { fontSize: FontSize.tiny, fontWeight: FontWeight.bold },
  uppercase: { textTransform: 'uppercase', letterSpacing: 0.5 },
});
