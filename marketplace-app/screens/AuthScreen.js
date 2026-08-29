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
import { COULEURS, RAYON } from '../lib/constants';
import Icone from '../components/Icone';

const ROLES = [
  { value: 'acheteur', label: 'Acheter', aide: 'Trouver des produits près de chez moi' },
  { value: 'vendeur', label: 'Vendre', aide: 'Écouler mes surplus de jardin' },
];

export default function AuthScreen() {
  // 'accueil' = page de présentation, puis le formulaire choisi.
  const [vue, setVue] = useState('accueil');
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

    if (!data.session) {
      // Compte créé mais pas encore confirmé : pas de session, donc impossible
      // de créer le profil maintenant (protégé par la sécurité de la base).
      setLoading(false);
      Alert.alert('Compte créé', 'Vérifie ta boîte mail pour confirmer ton compte, puis connecte-toi.');
      setVue('connexion');
      return;
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      prenom: prenom.trim(),
      role,
    });
    setLoading(false);
    if (profileError) {
      Alert.alert('Compte créé, mais...', `Impossible de créer le profil : ${profileError.message}`);
    }
  }

  if (vue === 'accueil') {
    return (
      <ScrollView contentContainerStyle={styles.accueil}>
        <View style={styles.entete}>
          <Text style={styles.logo}>
            <Text style={styles.logoVert}>marketplace</Text>
            <Text style={styles.logoRose}>jardin</Text>
          </Text>
          <Text style={styles.baseline}>LE JARDIN DU VOISIN</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitre}>Les produits du jardin,{'\n'}près de chez vous</Text>
          <Text style={styles.heroTexte}>
            Des producteurs particuliers autour de vous, sans gaspillage et sans intermédiaire.
          </Text>

          <TouchableOpacity style={styles.ctaPrincipal} onPress={() => setVue('inscription')}>
            <Text style={styles.ctaPrincipalTexte}>Créer un compte</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setVue('connexion')}>
            <Text style={styles.ctaSecondaire}>Déjà inscrit ? Me connecter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.arguments}>
          {[
            { icone: 'position', titre: 'Tout près', texte: 'Uniquement les producteurs dans votre rayon' },
            { icone: 'panier', titre: 'En direct', texte: 'Vous réglez au producteur, au retrait' },
            { icone: 'profil', titre: 'Discret', texte: 'Prénom et secteur, jamais votre adresse' },
          ].map((a) => (
            <View key={a.titre} style={styles.argument}>
              <View style={styles.argumentPuce}>
                <Icone nom={a.icone} taille={18} couleur={COULEURS.vert} />
              </View>
              <View style={styles.argumentTexte}>
                <Text style={styles.argumentTitre}>{a.titre}</Text>
                <Text style={styles.argumentAide}>{a.texte}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  const inscription = vue === 'inscription';

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.formulaire} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => setVue('accueil')}>
          <Text style={styles.retour}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.formTitre}>{inscription ? 'Créer un compte' : 'Se connecter'}</Text>
        <Text style={styles.formAide}>
          {inscription
            ? 'Quelques secondes suffisent, aucune carte bancaire.'
            : 'Content de te revoir !'}
        </Text>

        {inscription && (
          <>
            <Text style={styles.label}>Ton prénom</Text>
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              value={prenom}
              onChangeText={setPrenom}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Je veux surtout…</Text>
            <View style={styles.roles}>
              {ROLES.map((r) => (
                <TouchableOpacity
                  key={r.value}
                  style={[styles.role, role === r.value && styles.roleActif]}
                  onPress={() => setRole(r.value)}
                >
                  <Text style={[styles.roleLabel, role === r.value && styles.roleLabelActif]}>
                    {r.label}
                  </Text>
                  <Text style={[styles.roleAide, role === r.value && styles.roleAideActif]}>
                    {r.aide}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.noteRole}>
              Un compte vendeur peut aussi acheter. Tu pourras changer plus tard.
            </Text>
          </>
        )}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="ton@email.fr"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="6 caractères minimum"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.ctaPrincipal}
          onPress={inscription ? handleInscription : handleConnexion}
          disabled={loading}
        >
          <Text style={styles.ctaPrincipalTexte}>
            {loading ? '...' : inscription ? 'Créer mon compte' : 'Me connecter'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setVue(inscription ? 'connexion' : 'inscription')}>
          <Text style={styles.ctaSecondaire}>
            {inscription ? 'Déjà inscrit ? Me connecter' : "Pas encore de compte ? M'inscrire"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  accueil: { paddingBottom: 40, backgroundColor: '#fff' },
  entete: { alignItems: 'center', paddingTop: 96, paddingBottom: 8 },
  logo: { fontSize: 26, fontWeight: 'bold', letterSpacing: -0.5 },
  logoVert: { color: COULEURS.vert },
  logoRose: { color: '#e91e63' },
  baseline: {
    fontSize: 10,
    letterSpacing: 3,
    color: '#9aa5b1',
    marginTop: 4,
    fontWeight: '600',
  },
  hero: { paddingHorizontal: 24, paddingTop: 44, alignItems: 'center' },
  heroTitre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COULEURS.encre,
    textAlign: 'center',
    lineHeight: 36,
  },
  heroTexte: {
    fontSize: 15,
    color: COULEURS.texteDoux,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  ctaPrincipal: {
    backgroundColor: COULEURS.encre,
    borderRadius: RAYON.pilule,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 28,
  },
  ctaPrincipalTexte: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  ctaSecondaire: {
    color: COULEURS.encre,
    fontWeight: '600',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
  arguments: { paddingHorizontal: 24, paddingTop: 40, gap: 18 },
  argument: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  argumentPuce: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COULEURS.vertClair,
    justifyContent: 'center',
    alignItems: 'center',
  },
  argumentTexte: { flex: 1 },
  argumentTitre: { fontSize: 15, fontWeight: 'bold', color: COULEURS.encre },
  argumentAide: { fontSize: 13, color: COULEURS.texteDoux, marginTop: 2 },
  formulaire: { padding: 24, paddingTop: 60, backgroundColor: '#fff', flexGrow: 1 },
  retour: { color: COULEURS.texteDoux, fontSize: 15, marginBottom: 20 },
  formTitre: { fontSize: 26, fontWeight: 'bold', color: COULEURS.encre },
  formAide: { fontSize: 14, color: COULEURS.texteDoux, marginTop: 6, marginBottom: 8 },
  label: { marginTop: 20, marginBottom: 8, fontWeight: '600', color: COULEURS.encre, fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  roles: { flexDirection: 'row', gap: 10 },
  role: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COULEURS.bord,
    borderRadius: RAYON.petit,
    padding: 14,
  },
  roleActif: { borderColor: COULEURS.vert, backgroundColor: COULEURS.vertClair },
  roleLabel: { fontSize: 15, fontWeight: 'bold', color: COULEURS.encre },
  roleLabelActif: { color: COULEURS.vert },
  roleAide: { fontSize: 11, color: COULEURS.texteDoux, marginTop: 4, lineHeight: 15 },
  roleAideActif: { color: '#33691e' },
  noteRole: { fontSize: 11, color: '#9aa5b1', marginTop: 8 },
});
