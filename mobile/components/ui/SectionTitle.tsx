import { StyleSheet, Text } from 'react-native';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, LetterSpacing, Spacing } from '@/lib/theme';

/** Intitulé de section (petites capitales DSFR) au-dessus d'une liste/groupe. */
export default function SectionTitle({ children }: { children: string }) {
  return (
    <Text style={styles.title} accessibilityRole="header">
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: LetterSpacing.md,
    marginBottom: Spacing.sm,
  },
});
