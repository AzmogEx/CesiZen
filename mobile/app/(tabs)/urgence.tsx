import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/lib/colors';

type Contact = {
  nom: string;
  numero: string;
  description: string;
  disponibilite: string;
};

const CONTACTS: Contact[] = [
  {
    nom: 'Prévention du suicide',
    numero: '3114',
    description: 'Numéro national gratuit et confidentiel pour les personnes en détresse psychologique et leur entourage.',
    disponibilite: '24h/24 — 7j/7',
  },
  {
    nom: 'SOS Amitié',
    numero: '0972394050',
    description: 'Écoute et soutien pour les personnes en souffrance, solitude ou détresse morale.',
    disponibilite: '24h/24',
  },
  {
    nom: 'Fil Santé Jeunes',
    numero: '0800235236',
    description: 'Ligne d\'écoute gratuite et anonyme pour les 12-25 ans.',
    disponibilite: 'Lun-Dim, 9h-23h',
  },
  {
    nom: 'SAMU',
    numero: '15',
    description: 'Service d\'aide médicale urgente. En cas d\'urgence vitale.',
    disponibilite: '24h/24 — 7j/7',
  },
  {
    nom: 'SOS Médecins',
    numero: '3624',
    description: 'Consultations médicales à domicile.',
    disponibilite: '24h/24 — 7j/7',
  },
  {
    nom: 'Numéro européen d\'urgence',
    numero: '112',
    description: 'Police, pompiers, SAMU. À utiliser en cas d\'urgence vitale.',
    disponibilite: '24h/24 — 7j/7',
  },
];

function formatNumero(n: string): string {
  if (n.length <= 4) return n;
  return n.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

export default function UrgenceScreen() {
  const appeler = async (numero: string, nom: string) => {
    const url = `tel:${numero}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert('Impossible d\'appeler', `Composez manuellement le ${formatNumero(numero)} pour joindre ${nom}.`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <Ionicons name="heart" size={20} color={Colors.error} />
        </View>
        <Text style={styles.headerTitle}>Vous n'êtes pas seul(e)</Text>
        <Text style={styles.headerSubtitle}>
          Si vous ou un proche traversez une période difficile, ces services sont là pour vous écouter.
        </Text>
      </View>

      {CONTACTS.map((c) => (
        <TouchableOpacity key={c.numero} style={styles.card} onPress={() => appeler(c.numero, c.nom)}>
          <View style={styles.cardIcon}>
            <Ionicons name="call" size={22} color={Colors.error} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardName}>{c.nom}</Text>
            <Text style={styles.cardNumber}>{formatNumero(c.numero)}</Text>
            <Text style={styles.cardDescription}>{c.description}</Text>
            <Text style={styles.cardAvailability}>{c.disponibilite}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.gray[300]} />
        </TouchableOpacity>
      ))}

      <View style={styles.warning}>
        <Ionicons name="warning" size={18} color={Colors.error} />
        <Text style={styles.warningText}>
          En cas d'urgence vitale, appelez immédiatement le <Text style={styles.bold}>15</Text> (SAMU) ou le <Text style={styles.bold}>112</Text>.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 20, alignItems: 'flex-start' },
  iconBadge: { width: 40, height: 40, borderRadius: 4, backgroundColor: Colors.errorBg, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.black, marginBottom: 6 },
  headerSubtitle: { fontSize: 14, color: Colors.gray[500], lineHeight: 20 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16,
    backgroundColor: Colors.white, borderRadius: 4, marginBottom: 10,
    borderWidth: 1, borderColor: Colors.gray[200],
  },
  cardIcon: { width: 44, height: 44, borderRadius: 4, backgroundColor: Colors.errorBg, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '700', color: Colors.black, marginBottom: 2 },
  cardNumber: { fontSize: 20, fontWeight: '800', color: Colors.error, marginBottom: 6 },
  cardDescription: { fontSize: 12, color: Colors.gray[500], lineHeight: 17 },
  cardAvailability: { fontSize: 11, color: Colors.primary, marginTop: 4, fontWeight: '600' },
  warning: { marginTop: 8, padding: 14, borderRadius: 4, backgroundColor: Colors.errorBg, borderWidth: 1, borderColor: Colors.error, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  warningText: { flex: 1, fontSize: 13, color: Colors.error, lineHeight: 19 },
  bold: { fontWeight: '800' },
});
