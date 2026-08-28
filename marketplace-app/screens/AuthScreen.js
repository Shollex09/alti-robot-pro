import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

const ROLES = [
  { value: 'acheteur', label: 'Acheteur' },
  { value: 'vendeur', label: 'Vendeur' },
];

export default function AuthScreen() {
  const [mode, setMode] = useState('connexion'); // 'connexion' | 'inscription'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [prenom, setPrenom] = useState('');
  const [role, setRole] = useState('acheteur');
  const [loading, setLoading] = useState(false);

  async function handleConnexion() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Erreur de connexion', error.message);
  }

  async function handleInscription() {
    if (!prenom.trim()) {
      Alert.alert('Prénom manquant', 'Indique ton prénom pour créer ton profil.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setLoading(false);
      Alert.alert("Erreur d'inscription", error.message);
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        prenom: prenom.trim(),
        role,
      });
      if (profileError) {
        Alert.alert(
          'Compte créé, mais...',
          `Impossible de créer le profil : ${profileError.message}`
        );
      }
    }
    setLoading(false);
    if (!data.session) {
      Alert.alert('Compte créé', 'Vérifie ta boîte mail pour confirmer ton compte, puis connecte-toi.');
      setMode('connexion');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>🌱 Marketplace Jardin</Text>
        <Text style={styles.subtitle}>{mode === 'connexion' ? 'Connexion' : 'Créer un compte'}</Text>

        {mode === 'inscription' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              value={prenom}
              onChangeText={setPrenom}
              autoCapitalize="words"
            />
            <Text style={styles.label}>Je suis :</Text>
            <View style={styles.roleRow}>
              {ROLES.map((r) => (
                <TouchableOpacity
                  key={r.value}
                  style={[styles.roleBtn, role === r.value && styles.roleBtnActive]}
                  onPress={() => setRole(r.value)}
                >
                  <Text style={[styles.roleBtnText, role === r.value && styles.roleBtnTextActive]}>
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={mode === 'connexion' ? handleConnexion : handleInscription}
          disabled={loading}
        >
          <Text style={styles.submitBtnText}>
            {loading ? '...' : mode === 'connexion' ? 'Se connecter' : "S'inscrire"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode(mode === 'connexion' ? 'inscription' : 'connexion')}>
          <Text style={styles.switchText}>
            {mode === 'connexion' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 24 },
  label: { marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  roleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  roleBtnActive: { backgroundColor: '#2e7d32', borderColor: '#2e7d32' },
  roleBtnText: { color: '#333', fontWeight: '600' },
  roleBtnTextActive: { color: '#fff' },
  submitBtn: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  switchText: { textAlign: 'center', marginTop: 16, color: '#2e7d32' },
});
