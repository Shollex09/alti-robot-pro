import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import { supabase } from '../lib/supabase';

// On arrondit la position pour ne jamais stocker une adresse précise,
// seulement un secteur approximatif (~1 km).
function arrondirPosition(valeur) {
  return Math.round(valeur * 100) / 100;
}

export default function ProfileScreen({ session, profile, onSaved }) {
  const [description, setDescription] = useState(profile?.description ?? '');
  const [typeProduction, setTypeProduction] = useState(profile?.type_production ?? '');
  const [rayon, setRayon] = useState(profile?.rayon_recherche_km ?? 10);
  const [position, setPosition] = useState(
    profile?.latitude != null ? { latitude: profile.latitude, longitude: profile.longitude } : null
  );
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);

  const role = profile?.role ?? 'acheteur';

  async function handleLocaliser() {
    setLocating(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocating(false);
      Alert.alert(
        'Position refusée',
        "Sans autorisation de localisation, on ne peut pas situer ton secteur. Tu peux l'activer dans les réglages du téléphone."
      );
      return;
    }
    try {
      const result = await Location.getCurrentPositionAsync({});
      setPosition({
        latitude: arrondirPosition(result.coords.latitude),
        longitude: arrondirPosition(result.coords.longitude),
      });
    } catch (e) {
      Alert.alert('Erreur', "Impossible de récupérer ta position : " + e.message);
    } finally {
      setLocating(false);
    }
  }

  async function handleSauvegarder() {
    if (!position) {
      Alert.alert('Position manquante', 'Indique ta position approximative avant de continuer.');
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        description: description.trim() || null,
        type_production: role === 'vendeur' ? typeProduction.trim() || null : null,
        rayon_recherche_km: role === 'acheteur' ? rayon : null,
        latitude: position.latitude,
        longitude: position.longitude,
      })
      .eq('id', session.user.id);
    setSaving(false);
    if (error) {
      Alert.alert('Erreur', "Impossible d'enregistrer ton profil : " + error.message);
      return;
    }
    onSaved();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complète ton profil</Text>
      <Text style={styles.subtitle}>
        {role === 'vendeur'
          ? 'Ces infos apparaîtront sur ta vitrine publique.'
          : 'Ces infos servent à te montrer les produits proches de toi.'}
      </Text>

      <Text style={styles.label}>Ta position (secteur approximatif)</Text>
      <TouchableOpacity style={styles.locateBtn} onPress={handleLocaliser} disabled={locating}>
        {locating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.locateBtnText}>
            {position ? '📍 Position enregistrée — actualiser' : '📍 Utiliser ma position actuelle'}
          </Text>
        )}
      </TouchableOpacity>
      {position && (
        <Text style={styles.positionHint}>
          Secteur : {position.latitude.toFixed(2)}, {position.longitude.toFixed(2)} (arrondi, pas ton adresse exacte)
        </Text>
      )}

      {role === 'vendeur' && (
        <>
          <Text style={styles.label}>Type de production</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex : légumes de saison, poules pondeuses..."
            value={typeProduction}
            onChangeText={setTypeProduction}
          />
        </>
      )}

      {role === 'acheteur' && (
        <>
          <Text style={styles.label}>Rayon de recherche : {rayon} km</Text>
          <Slider
            minimumValue={1}
            maximumValue={50}
            step={1}
            value={rayon}
            onValueChange={setRayon}
            minimumTrackTintColor="#2e7d32"
            thumbTintColor="#2e7d32"
          />
        </>
      )}

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder={role === 'vendeur' ? 'Présente-toi en quelques mots...' : "Facultatif"}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSauvegarder} disabled={saving}>
        <Text style={styles.saveBtnText}>{saving ? '...' : 'Enregistrer'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  label: { marginBottom: 8, marginTop: 12, color: '#333', fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  locateBtn: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  locateBtnText: { color: '#fff', fontWeight: 'bold' },
  positionHint: { marginTop: 8, color: '#888', fontSize: 12 },
  saveBtn: {
    backgroundColor: '#1565c0',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 32,
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
