import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '@/lib/auth-store';
import { Colors } from '@/lib/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nom || !prenom || !email || !password || !passwordConfirmation) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    if (password !== passwordConfirmation) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      await register({ nom, prenom, email, password, password_confirmation: passwordConfirmation });
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>CESIZen</Text>
          <Text style={styles.subtitle}>Creez votre compte</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Inscription</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Nom</Text>
              <TextInput style={styles.input} value={nom} onChangeText={setNom} placeholder="Dupont" />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Prenom</Text>
              <TextInput style={styles.input} value={prenom} onChangeText={setPrenom} placeholder="Jean" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="votre@email.com" keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Mot de passe" secureTextEntry />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <TextInput style={styles.input} value={passwordConfirmation} onChangeText={setPasswordConfirmation} placeholder="Confirmer" secureTextEntry />
          </View>

          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Inscription...' : 'S\'inscrire'}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Deja un compte ? </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity><Text style={styles.link}>Se connecter</Text></TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 36, fontWeight: '800', color: Colors.black },
  subtitle: { fontSize: 16, color: Colors.gray[500], marginTop: 8 },
  form: { backgroundColor: Colors.gray[50], borderRadius: 24, padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.black, marginBottom: 24 },
  row: { flexDirection: 'row' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.gray[700], marginBottom: 6 },
  input: {
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.gray[300],
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: Colors.black,
  },
  button: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 16, fontWeight: '700', color: Colors.black },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: Colors.gray[500], fontSize: 14 },
  link: { color: Colors.secondary, fontSize: 14, fontWeight: '600' },
});
