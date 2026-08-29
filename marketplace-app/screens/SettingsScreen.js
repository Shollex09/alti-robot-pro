import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { choisirPhoto, envoyerPhoto } from '../lib/photos';
import SelecteurCategories from '../components/SelecteurCategories';
import { COULEURS, RAYON, parseTypeProduction } from '../lib/constants';
import Icone from '../components/Icone';

function arrondirPosition(valeur) {
  return Math.round(valeur * 100) / 100;
}

export default function SettingsScreen() {
  const { session, profile, rechargerProfil, estVendeur } = useAuth();
  const [prenom, setPrenom] = useState(profile?.prenom ?? '');
  const [description, setDescription] = useState(profile?.description ?? '');
  const [typeProduction, setTypeProduction] = useState(parseTypeProduction(profile?.type_production));
  const [rayon, setRayon] = useState(profile?.rayon_recherche_km ?? 10);
  const [photoUrl, setPhotoUrl] = useState(profile?.photo_url ?? null);
  const [nouvellePhoto, setNouvellePhoto] = useState(null);
  const [couvertureUrl, setCouvertureUrl] = useState(profile?.couverture_url ?? null);
  const [nouvelleCouverture, setNouvelleCouverture] = useState(null);
  const [position, setPosition] = useState(
    profile?.latitude != null ? { latitude: profile.latitude, longitude: profile.longitude } : null
  );
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [suppression, setSuppression] = useState(false);

  async function actualiserPosition() {
    setLocating(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocating(false);
      Alert.alert('Position refusée', "Autorise la localisation dans les réglages du téléphone.");
      return;
    }
    try {
      const result = await Location.getCurrentPositionAsync({});
      setPosition({
        latitude: arrondirPosition(result.coords.latitude),
        longitude: arrondirPosition(result.coords.longitude),
      });
    } catch (e) {
      Alert.alert('Erreur', e.message);
    } finally {
      setLocating(false);
    }
  }

  async function selectionnerPhoto() {
    try {
      const asset = await choisirPhoto();
      if (asset) setNouvellePhoto(asset);
    } catch (e) {
      Alert.alert('Photo', e.message);
    }
  }

  async function selectionnerCouverture() {
    try {
      const asset = await choisirPhoto({ aspect: [16, 9] });
      if (asset) setNouvelleCouverture(asset);
    } catch (e) {
      Alert.alert('Photo', e.message);
    }
  }

  async function enregistrer() {
    if (!prenom.trim()) return Alert.alert('Prénom manquant', 'Indique ton prénom.');
    setSaving(true);
    try {
      let url = photoUrl;
      if (nouvellePhoto) {
        url = await envoyerPhoto(nouvellePhoto, 'profils', session.user.id);
        setPhotoUrl(url);
        setNouvellePhoto(null);
      }
      let urlCouverture = couvertureUrl;
      if (nouvelleCouverture) {
        urlCouverture = await envoyerPhoto(nouvelleCouverture, 'couvertures', session.user.id);
        setCouvertureUrl(urlCouverture);
        setNouvelleCouverture(null);
      }
      const { error } = await supabase
        .from('profiles')
        .update({
          prenom: prenom.trim(),
          description: description.trim() || null,
          type_production: estVendeur && typeProduction.length > 0 ? typeProduction.join(',') : null,
          rayon_recherche_km: rayon,
          photo_url: url,
          couverture_url: urlCouverture,
          latitude: position?.latitude ?? null,
          longitude: position?.longitude ?? null,
        })
        .eq('id', session.user.id);
      if (error) throw error;
      await rechargerProfil();
      Alert.alert('Enregistré', 'Tes réglages ont été mis à jour.');
    } catch (e) {
      Alert.alert('Erreur', e.message);
    } finally {
      setSaving(false);
    }
  }

  function confirmerSuppression() {
    // Deux confirmations : l'action est définitive et sans retour possible.
    Alert.alert(
      'Supprimer ton compte ?',
      'Ton profil, tes annonces, tes commandes et tes messages seront effacés définitivement.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Continuer',
          style: 'destructive',
          onPress: () =>
            Alert.alert('Dernière confirmation', 'Cette action est irréversible. Confirmer ?', [
              { text: 'Annuler', style: 'cancel' },
              { text: 'Supprimer', style: 'destructive', onPress: supprimerCompte },
            ]),
        },
      ]
    );
  }

  async function supprimerCompte() {
    setSuppression(true);
    const { error } = await supabase.rpc('supprimer_mon_compte');
    setSuppression(false);
    if (error) {
      Alert.alert('Suppression impossible', error.message);
      return;
    }
    // Le compte n'existe plus : on referme la session pour revenir à l'accueil.
    await supabase.auth.signOut();
  }

  async function devenirVendeur() {
    Alert.alert(
      'Passer vendeur ?',
      'Tu pourras publier des annonces et gérer tes ventes, tout en continuant à acheter.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Devenir vendeur',
          onPress: async () => {
            const { error } = await supabase
              .from('profiles')
              .update({ role: 'vendeur' })
              .eq('id', session.user.id);
            if (error) return Alert.alert('Erreur', error.message);
            await rechargerProfil();
          },
        },
      ]
    );
  }

  const apercu = nouvellePhoto?.uri ?? photoUrl;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.couvertureZone} onPress={selectionnerCouverture}>
        {nouvelleCouverture?.uri ?? couvertureUrl ? (
          <Image
            source={{ uri: nouvelleCouverture?.uri ?? couvertureUrl }}
            style={styles.couverture}
          />
        ) : (
          <View style={[styles.couverture, styles.couvertureVide]}>
            <Icone nom="photo" taille={22} couleur={COULEURS.vert} />
            <Text style={styles.couvertureTexte}>Ajouter une photo de couverture</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.couvertureAide}>
        Ton potager, tes poules, ton étal — c'est la première chose que les autres voient.
      </Text>

      <TouchableOpacity style={styles.avatarZone} onPress={selectionnerPhoto}>
        {apercu ? (
          <Image source={{ uri: apercu }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarVide]}>
            <Text style={styles.avatarTexte}>{prenom?.[0]?.toUpperCase() ?? '?'}</Text>
          </View>
        )}
        <Text style={styles.avatarLien}>Changer la photo</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Prénom</Text>
      <TextInput style={styles.input} value={prenom} onChangeText={setPrenom} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Quelques mots sur toi"
      />

      {estVendeur && (
        <>
          <Text style={styles.label}>Ce que tu produis</Text>
          <SelecteurCategories valeurs={typeProduction} onChange={setTypeProduction} />
        </>
      )}

      <Text style={styles.label}>Rayon de recherche : {rayon} km</Text>
      <Slider
        minimumValue={1}
        maximumValue={50}
        step={1}
        value={rayon}
        onValueChange={setRayon}
        minimumTrackTintColor={COULEURS.vert}
        thumbTintColor={COULEURS.vert}
      />

      <Text style={styles.label}>Ma position (secteur approximatif)</Text>
      <TouchableOpacity style={styles.positionBtn} onPress={actualiserPosition} disabled={locating}>
        {locating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.positionTexte}>Actualiser ma position</Text>
        )}
      </TouchableOpacity>
      {position ? (
        <Text style={styles.positionHint}>
          Secteur : {position.latitude.toFixed(2)}, {position.longitude.toFixed(2)} — ton adresse
          exacte n'est jamais enregistrée ni affichée.
        </Text>
      ) : null}

      <TouchableOpacity style={styles.enregistrerBtn} onPress={enregistrer} disabled={saving}>
        <Text style={styles.enregistrerTexte}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Text>
      </TouchableOpacity>

      {!estVendeur && (
        <TouchableOpacity style={styles.vendeurBtn} onPress={devenirVendeur}>
          <Text style={styles.vendeurTexte}>Devenir vendeur</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.deconnexionBtn} onPress={() => supabase.auth.signOut()}>
        <Text style={styles.deconnexionTexte}>Se déconnecter</Text>
      </TouchableOpacity>

      <View style={styles.zoneDanger}>
        <Text style={styles.dangerTitre}>Supprimer mon compte</Text>
        <Text style={styles.dangerTexte}>
          Efface définitivement ton profil, tes annonces, tes commandes et tes messages. Cette
          action est irréversible.
        </Text>
        <TouchableOpacity
          style={styles.supprimerBtn}
          onPress={confirmerSuppression}
          disabled={suppression}
        >
          <Text style={styles.supprimerTexte}>
            {suppression ? 'Suppression...' : 'Supprimer définitivement mon compte'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  couvertureZone: { marginBottom: 8 },
  couverture: { width: '100%', height: 140, borderRadius: RAYON.carte },
  couvertureVide: {
    backgroundColor: COULEURS.vertClair,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  couvertureTexte: { color: COULEURS.vert, fontWeight: '600', fontSize: 13 },
  couvertureAide: { fontSize: 11, color: COULEURS.texteDoux, marginBottom: 16 },
  avatarZone: { alignItems: 'center', marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarVide: { backgroundColor: COULEURS.vertClair, justifyContent: 'center', alignItems: 'center' },
  avatarTexte: { fontSize: 36, fontWeight: 'bold', color: COULEURS.vert },
  avatarLien: { color: COULEURS.vert, fontWeight: '600', marginTop: 8 },
  label: { marginTop: 16, marginBottom: 8, fontWeight: '600', color: COULEURS.texte },
  input: { borderWidth: 1, borderColor: COULEURS.bord, borderRadius: 8, padding: 12, fontSize: 16 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  positionBtn: {
    backgroundColor: COULEURS.vert,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  positionTexte: { color: '#fff', fontWeight: 'bold' },
  positionHint: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 8 },
  enregistrerBtn: {
    marginTop: 28,
    backgroundColor: COULEURS.bleu,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  enregistrerTexte: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  vendeurBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: COULEURS.vert,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  vendeurTexte: { color: COULEURS.vert, fontWeight: 'bold' },
  deconnexionBtn: {
    marginTop: 32,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  deconnexionTexte: { color: COULEURS.rouge, fontWeight: '600' },
  zoneDanger: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0c9c9',
    backgroundColor: '#fdf5f5',
  },
  dangerTitre: { fontSize: 14, fontWeight: 'bold', color: COULEURS.rouge },
  dangerTexte: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 6, lineHeight: 18 },
  supprimerBtn: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: COULEURS.rouge,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  supprimerTexte: { color: COULEURS.rouge, fontWeight: '600', fontSize: 13 },
});
