import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';

export default function HomeScreen({ profile }) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Bienvenue {profile.prenom} !</Text>
      <Text style={styles.subtitle}>Rôle : {profile.role === 'vendeur' ? 'Vendeur' : 'Acheteur'}</Text>
      {profile.description ? <Text style={styles.description}>{profile.description}</Text> : null}
      <Text style={styles.hint}>Les prochains écrans arrivent bientôt.</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={() => supabase.auth.signOut()}>
        <Text style={styles.logoutBtnText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#444', marginBottom: 8 },
  description: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 16 },
  hint: { color: '#888', marginBottom: 24 },
  logoutBtn: { backgroundColor: '#c62828', borderRadius: 8, padding: 12, paddingHorizontal: 24 },
  logoutBtnText: { color: '#fff', fontWeight: 'bold' },
});
