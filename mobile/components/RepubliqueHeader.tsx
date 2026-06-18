import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/lib/colors';

interface RepubliqueHeaderProps {
  /** Affiche le nom du service (CESIZen) à côté du bloc Marianne. */
  showService?: boolean;
}

/**
 * En-tête institutionnel reprenant l'identité visuelle de l'État (DSFR) :
 * bloc « RÉPUBLIQUE / FRANÇAISE » accompagné du nom du service.
 */
export default function RepubliqueHeader({ showService = true }: RepubliqueHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.marianneBlock}>
        <Text style={styles.republique}>RÉPUBLIQUE</Text>
        <Text style={styles.francaise}>FRANÇAISE</Text>
        <Text style={styles.devise}>Liberté{'\n'}Égalité{'\n'}Fraternité</Text>
      </View>
      {showService && (
        <View style={styles.serviceBlock}>
          <Text style={styles.serviceName}>CESIZen</Text>
          <Text style={styles.serviceTagline}>Santé mentale</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  marianneBlock: {
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: Colors.gray[200],
  },
  republique: { fontSize: 12, fontWeight: '700', color: Colors.black, letterSpacing: 0.5, lineHeight: 14 },
  francaise: { fontSize: 12, fontWeight: '700', color: Colors.black, letterSpacing: 0.5, lineHeight: 14 },
  devise: { fontSize: 8, color: Colors.gray[500], marginTop: 4, lineHeight: 10, fontStyle: 'italic' },
  serviceBlock: { paddingLeft: 16 },
  serviceName: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  serviceTagline: { fontSize: 11, color: Colors.gray[500], marginTop: 1 },
});
