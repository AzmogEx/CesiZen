import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/lib/colors';
import { FontSize, Spacing } from '@/lib/theme';

/** Indicateur de chargement centré et homogène, avec libellé optionnel. */
export default function Loader({ label }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, backgroundColor: Colors.gray[50] },
  label: { marginTop: Spacing.md, fontSize: FontSize.sm, color: Colors.gray[500] },
});
