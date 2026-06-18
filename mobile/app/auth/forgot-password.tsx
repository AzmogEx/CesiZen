import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/lib/colors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    if (!email.trim()) {
      setError('Veuillez renseigner votre adresse email.');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError('Format d\'email invalide.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <View style={styles.success}>
          <View style={styles.successIcon}>
            <Ionicons name="mail-open" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.successTitle}>Demande enregistrée</Text>
          <Text style={styles.successText}>
            Si l'adresse <Text style={styles.bold}>{email}</Text> est associée à un compte CESIZen, un email contenant les instructions de réinitialisation sera envoyé.
          </Text>
          <Text style={styles.successText}>
            Si vous ne recevez rien sous 24h, contactez votre administrateur.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.replace('/auth/login')}>
            <Text style={styles.buttonText}>Retour à la connexion</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>Mot de passe oublié ?</Text>
          <Text style={styles.subtitle}>
            Entrez votre adresse email. Si elle est associée à un compte, vous recevrez les instructions pour réinitialiser votre mot de passe.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(v) => { setEmail(v); setError(null); }}
              placeholder="votre@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Envoyer les instructions</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Retour à la connexion</Text>
              </TouchableOpacity>
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
  logo: { fontSize: 26, fontWeight: '800', color: Colors.black, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.gray[500], marginTop: 10, textAlign: 'center', lineHeight: 20 },
  form: { backgroundColor: Colors.gray[50], borderRadius: 4, padding: 24, borderWidth: 1, borderColor: Colors.gray[200] },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.black, marginBottom: 6 },
  input: { backgroundColor: Colors.gray[100], borderTopLeftRadius: 4, borderTopRightRadius: 4, borderBottomWidth: 2, borderBottomColor: Colors.black, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: Colors.black },
  errorText: { color: Colors.error, marginTop: 6, fontSize: 12 },
  button: { backgroundColor: Colors.primary, borderRadius: 4, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { fontSize: 16, fontWeight: '700', color: Colors.white },
  footer: { alignItems: 'center', marginTop: 20 },
  link: { color: Colors.primary, fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
  success: { padding: 24, alignItems: 'center', flex: 1, justifyContent: 'center' },
  successIcon: { width: 72, height: 72, borderRadius: 999, backgroundColor: `${Colors.primary}15`, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 22, fontWeight: '800', color: Colors.black, marginBottom: 12 },
  successText: { fontSize: 14, color: Colors.gray[600], textAlign: 'center', lineHeight: 20, marginBottom: 12 },
  bold: { fontWeight: '700', color: Colors.black },
});
