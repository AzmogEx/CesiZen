import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/auth-store';
import { Colors } from '@/lib/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Deconnexion', 'Voulez-vous vous deconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se deconnecter',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar & Name */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </Text>
        </View>
        <Text style={styles.name}>{user?.prenom} {user?.nom}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role?.nom || 'Membre'}</Text>
        </View>
      </View>

      {/* Menu items */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Compte</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="person-outline" label="Informations personnelles" />
          <MenuItem icon="lock-closed-outline" label="Changer le mot de passe" />
          <MenuItem icon="shield-checkmark-outline" label="Donnees personnelles (RGPD)" />
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Application</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="information-circle-outline" label="A propos de CESIZen" />
          <MenuItem icon="document-text-outline" label="Conditions d'utilisation" />
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Se deconnecter</Text>
      </TouchableOpacity>

      <Text style={styles.version}>CESIZen v1.0.0</Text>
    </ScrollView>
  );
}

function MenuItem({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <Ionicons name={icon} size={20} color={Colors.gray[600]} />
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={Colors.gray[300]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 20, paddingBottom: 40 },
  profileHeader: { alignItems: 'center', marginBottom: 32, marginTop: 12 },
  avatar: {
    width: 80, height: 80, borderRadius: 4, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: Colors.white },
  name: { fontSize: 22, fontWeight: '700', color: Colors.black },
  email: { fontSize: 14, color: Colors.gray[500], marginTop: 4 },
  roleBadge: { backgroundColor: `${Colors.primary}15`, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, marginTop: 8 },
  roleText: { fontSize: 12, fontWeight: '600', color: Colors.primary, textTransform: 'capitalize' },
  menuSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.gray[500], textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  menuCard: { backgroundColor: Colors.white, borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: Colors.gray[200] },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.gray[200],
  },
  menuLabel: { flex: 1, fontSize: 15, color: Colors.black },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: 4, backgroundColor: Colors.errorBg,
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: Colors.error },
  version: { textAlign: 'center', fontSize: 12, color: Colors.gray[400], marginTop: 20 },
});
