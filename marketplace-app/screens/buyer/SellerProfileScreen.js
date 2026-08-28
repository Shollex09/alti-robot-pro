import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { distanceKm, formatDistance } from '../../lib/geo';
import { COULEURS, categorieLabel, formatEuros } from '../../lib/constants';

export default function SellerProfileScreen({ route, navigation }) {
  const { vendeurId } = route.params;
  const { profile } = useAuth();
  const [vendeur, setVendeur] = useState(null);
  const [produits, setProduits] = useState([]);

  const charger = useCallback(async () => {
    const [{ data: v }, { data: p }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', vendeurId).single(),
      supabase
        .from('products')
        .select('*')
        .eq('vendeur_id', vendeurId)
        .eq('statut', 'disponible')
        .gt('quantite_disponible', 0)
        .order('created_at', { ascending: false }),
    ]);
    setVendeur(v);
    setProduits(p ?? []);
  }, [vendeurId]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  if (!vendeur) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COULEURS.vert} />
      </View>
    );
  }

  const distance = distanceKm(
    profile?.latitude,
    profile?.longitude,
    vendeur.latitude,
    vendeur.longitude
  );

  return (
    <FlatList
      data={produits}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.liste}
      ListHeaderComponent={
        <View style={styles.entete}>
          {vendeur.photo_url ? (
            <Image source={{ uri: vendeur.photo_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarVide]}>
              <Text style={styles.avatarTexte}>{vendeur.prenom?.[0]?.toUpperCase() ?? '?'}</Text>
            </View>
          )}
          <Text style={styles.prenom}>{vendeur.prenom}</Text>
          {vendeur.type_production ? (
            <Text style={styles.production}>{vendeur.type_production}</Text>
          ) : null}
          <Text style={styles.secteur}>📍 Secteur à {formatDistance(distance)}</Text>
          {vendeur.description ? <Text style={styles.description}>{vendeur.description}</Text> : null}
          <Text style={styles.sectionTitre}>Ses produits ({produits.length})</Text>
        </View>
      }
      ListEmptyComponent={<Text style={styles.vide}>Aucun produit disponible en ce moment.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.carte}
          onPress={() => navigation.push('ProductDetail', { productId: item.id })}
        >
          {item.photo_url ? (
            <Image source={{ uri: item.photo_url }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.photoVide]}>
              <Text style={{ fontSize: 28 }}>🌱</Text>
            </View>
          )}
          <View style={styles.carteInfos}>
            <Text style={styles.carteNom}>{item.nom}</Text>
            <Text style={styles.carteCategorie}>{categorieLabel(item.categorie)}</Text>
            <Text style={styles.cartePrix}>{formatEuros(item.prix)}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  liste: { padding: 12, gap: 12 },
  entete: { alignItems: 'center', paddingVertical: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarVide: { backgroundColor: COULEURS.vertClair, justifyContent: 'center', alignItems: 'center' },
  avatarTexte: { fontSize: 32, fontWeight: 'bold', color: COULEURS.vert },
  prenom: { fontSize: 22, fontWeight: 'bold', marginTop: 12 },
  production: { fontSize: 14, color: COULEURS.texteDoux, marginTop: 4 },
  secteur: { fontSize: 13, color: COULEURS.texteDoux, marginTop: 8 },
  description: { fontSize: 14, color: COULEURS.texte, marginTop: 12, textAlign: 'center', paddingHorizontal: 20 },
  sectionTitre: { fontSize: 16, fontWeight: '600', marginTop: 24, alignSelf: 'flex-start' },
  vide: { textAlign: 'center', color: COULEURS.texteDoux, padding: 20 },
  carte: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: { width: 80, height: 80 },
  photoVide: { backgroundColor: COULEURS.vertClair, justifyContent: 'center', alignItems: 'center' },
  carteInfos: { flex: 1, padding: 12, justifyContent: 'center' },
  carteNom: { fontSize: 15, fontWeight: 'bold' },
  carteCategorie: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 2 },
  cartePrix: { fontSize: 14, fontWeight: '600', color: COULEURS.vert, marginTop: 4 },
});
