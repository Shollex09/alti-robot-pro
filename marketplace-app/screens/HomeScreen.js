import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function HomeScreen({ session }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from('profiles')
      .select('prenom, role')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        if (active) {
          setProfile(data);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [session.user.id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.title}>{profile ? `Bienvenue ${profile.prenom} !` : 'Bienvenue !'}</Text>
      <Text style={styles.subtitle}>Rôle : {profile?.role === 'vendeur' ? 'Vendeur' : 'Acheteur'}</Text>
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
  subtitle: { fontSize: 16, color: '#444', marginBottom: 16 },
  hint: { color: '#888', marginBottom: 24 },
  logoutBtn: { backgroundColor: '#c62828', borderRadius: 8, padding: 12, paddingHorizontal: 24 },
  logoutBtnText: { color: '#fff', fontWeight: 'bold' },
});
