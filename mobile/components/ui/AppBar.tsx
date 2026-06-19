import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/lib/colors';
import { FontSize, FontWeight, LetterSpacing, LineHeight, Spacing } from '@/lib/theme';

interface AppBarProps {
  /** Titre de la page, affiché sous le bandeau institutionnel. */
  title?: string;
  subtitle?: string;
  /** Élément optionnel aligné à droite du bandeau (ex. bouton). */
  right?: React.ReactNode;
}

/**
 * Bandeau institutionnel République Française réutilisable, à placer en haut
 * de chaque écran principal. Reprend le bloc-marque de l'État (DSFR) + le nom
 * du service, avec un titre/sous-titre de page optionnel.
 */
export default function AppBar({ title, subtitle, right }: AppBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]} accessibilityRole="header">
      <View style={styles.brandRow}>
        <View style={styles.marianne}>
          <Text style={styles.republique}>RÉPUBLIQUE</Text>
          <Text style={styles.republique}>FRANÇAISE</Text>
        </View>
        <View style={styles.serviceBlock}>
          <Text style={styles.serviceName}>CESIZen</Text>
          <Text style={styles.serviceTagline}>Santé mentale</Text>
        </View>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
      {title ? (
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  marianne: {
    paddingRight: Spacing.md,
    marginRight: Spacing.md,
    borderRightWidth: 1,
    borderRightColor: Colors.gray[200],
  },
  republique: {
    fontSize: FontSize.tiny,
    fontWeight: FontWeight.bold,
    color: Colors.black,
    letterSpacing: LetterSpacing.sm,
    lineHeight: LineHeight.tight,
  },
  serviceBlock: { flex: 1 },
  serviceName: { fontSize: FontSize.lg, fontWeight: FontWeight.heavy, color: Colors.primary },
  serviceTagline: { fontSize: FontSize.tiny, color: Colors.gray[500], marginTop: Spacing.xs / 4 },
  right: { marginLeft: Spacing.sm },
  titleRow: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.xs,
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.black },
  subtitle: { fontSize: FontSize.sm, color: Colors.gray[500], marginTop: Spacing.xs / 2 },
});
