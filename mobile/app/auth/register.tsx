import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/auth-store';
import { getApiError } from '@/lib/api';
import { Colors } from '@/lib/colors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [consentement, setConsentement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!nom.trim()) e.nom = 'Le nom est obligatoire';
    if (!prenom.trim()) e.prenom = 'Le prénom est obligatoire';
    if (!email.trim()) e.email = 'L\'email est obligatoire';
    else if (!EMAIL_REGEX.test(email)) e.email = 'Format d\'email invalide';
    if (!password) e.password = 'Le mot de passe est obligatoire';
    else if (password.length < 8) e.password = 'Le mot de passe doit faire au moins 8 caractères';
    if (password !== passwordConfirmation) e.passwordConfirmation = 'Les mots de passe ne correspondent pas';
    if (!consentement) e.consentement = 'Vous devez accepter le traitement de vos données (RGPD)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        nom, prenom, email, password,
        password_confirmation: passwordConfirmation,
        consentement_rgpd: consentement,
      });
      router.replace('/(tabs)');
    } catch (error) {
      const data = getApiError(error);
      const msg = data.message || 'Erreur lors de l\'inscription';
      const apiErrors = data.errors;
      if (apiErrors) {
        const mapped: Record<string, string> = {};
        Object.entries(apiErrors).forEach(([k, v]) => { mapped[k] = Array.isArray(v) ? v[0] as string : String(v); });
        setErrors(mapped);
      }
      Alert.alert('Erreur', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>CESIZen</Text>
          <Text style={styles.subtitle}>Créez votre compte</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Inscription</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Nom</Text>
              <TextInput style={styles.input} value={nom} onChangeText={setNom} placeholder="Dupont" />
              {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput style={styles.input} value={prenom} onChangeText={setPrenom} placeholder="Jean" />
              {errors.prenom && <Text style={styles.errorText}>{errors.prenom}</Text>}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="votre@email.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe (min. 8 caractères)</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Mot de passe" secureTextEntry />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <TextInput style={styles.input} value={passwordConfirmation} onChangeText={setPasswordConfirmation} placeholder="Confirmer" secureTextEntry />
            {errors.passwordConfirmation && <Text style={styles.errorText}>{errors.passwordConfirmation}</Text>}
          </View>

          <TouchableOpacity style={styles.consentRow} onPress={() => setConsentement(!consentement)} activeOpacity={0.7}>
            <View style={[styles.checkbox, consentement && styles.checkboxChecked]}>
              {consentement && <Ionicons name="checkmark" size={16} color={Colors.white} />}
            </View>
            <Text style={styles.consentText}>
              J'accepte le traitement de mes données de bien-être conformément à la <Text style={styles.consentLink}>politique de confidentialité</Text> (RGPD).
            </Text>
          </TouchableOpacity>
          {errors.consentement && <Text style={styles.errorText}>{errors.consentement}</Text>}
          {errors.consentement_rgpd && <Text style={styles.errorText}>{errors.consentement_rgpd}</Text>}

          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Inscription...' : 'S\'inscrire'}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ? </Text>
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
  input: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.gray[300], borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: Colors.black },
  errorText: { color: '#DC2626', marginTop: 4, fontSize: 12 },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginVertical: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.gray[300], backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', marginTop: 1 },
  checkboxChecked: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  consentText: { flex: 1, fontSize: 13, color: Colors.gray[700], lineHeight: 18 },
  consentLink: { color: Colors.secondary, fontWeight: '600' },
  button: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 16, fontWeight: '700', color: Colors.black },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: Colors.gray[500], fontSize: 14 },
  link: { color: Colors.secondary, fontSize: 14, fontWeight: '600' },
});
