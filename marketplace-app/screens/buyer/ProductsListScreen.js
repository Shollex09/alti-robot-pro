import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { distanceKm, formatDistance } from '../../lib/geo';
import { CATEGORIES, COULEURS, categorieLabel, formatEuros } from '../../lib/constants';

export default function ProductsListScreen({ navigation }) {
  const { profile } = useAuth();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categorie, setCategorie] = useState(null);

  const charger = useCallback(async () => {
    const { data } = await supabase
      .from('products')
      .select('*, vendeur:profiles!products_vendeur_id_fkey(id, prenom, latitude, longitude)')
      .eq('statut', 'disponible')
      .gt('quantite_disponible', 0)
      .order('created_at', { ascending: false });
    setProduits(data ?? []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  // On calcule la distance côté appli, puis on garde ce qui est dans le rayon choisi.
  const produitsAffiches = useMemo(() => {
    const rayon = profile?.rayon_recherche_km ?? 50;
    return produits
      .map((p) => ({
        ...p,
        distance: distanceKm(
          profile?.latitude,
          profile?.longitude,
          p.vendeur?.latitude,
          p.vendeur?.longitude
        ),
      }))
      .filter((p) => (categorie ? p.categorie === categorie : true))
      .filter((p) => p.distance == null || p.distance <= rayon)
      .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
  }, [produits, profile, categorie]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COULEURS.vert} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filtres}>
        <TouchableOpacity
          style={[styles.filtre, categorie === null && styles.filtreActif]}
          onPress={() => setCategorie(null)}
        >
          <Text style={[styles.filtreTexte, categorie === null && styles.filtreTexteActif]}>Tout</Text>
        </TouchableOpacity>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c.value}
            style={[styles.filtre, categorie === c.value && styles.filtreActif]}
            onPress={() => setCategorie(c.value)}
          >
            <Text style={[styles.filtreTexte, categorie === c.value && styles.filtreTexteActif]}>
              {c.emoji} {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={produitsAffiches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.liste}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              charger();
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.vide}>
            <Text style={styles.videTitre}>Aucun produit près de toi</Text>
            <Text style={styles.videTexte}>
              Élargis ton rayon de recherche dans les réglages, ou reviens plus tard.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.carte}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          >
            {item.photo_url ? (
              <Image source={{ uri: item.photo_url }} style={styles.photo} />
            ) : (
              <View style={[styles.photo, styles.photoVide]}>
                <Text style={styles.photoVideTexte}>🌱</Text>
              </View>
            )}
            <View style={styles.carteInfos}>
              <Text style={styles.carteNom} numberOfLines={1}>
                {item.nom}
              </Text>
              <Text style={styles.carteCategorie}>{categorieLabel(item.categorie)}</Text>
              <Text style={styles.cartePrix}>{formatEuros(item.prix)}</Text>
              <Text style={styles.carteMeta}>
                {item.vendeur?.prenom} · {formatDistance(item.distance)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COULEURS.fond },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filtres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COULEURS.bord,
  },
  filtre: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COULEURS.fondDoux,
  },
  filtreActif: { backgroundColor: COULEURS.vert },
  filtreTexte: { fontSize: 13, color: COULEURS.texte },
  filtreTexteActif: { color: '#fff', fontWeight: '600' },
  liste: { padding: 12, gap: 12 },
  carte: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COULEURS.fond,
  },
  photo: { width: 100, height: 100 },
  photoVide: { backgroundColor: COULEURS.vertClair, justifyContent: 'center', alignItems: 'center' },
  photoVideTexte: { fontSize: 32 },
  carteInfos: { flex: 1, padding: 12, justifyContent: 'center' },
  carteNom: { fontSize: 16, fontWeight: 'bold', color: COULEURS.texte },
  carteCategorie: { fontSize: 13, color: COULEURS.texteDoux, marginTop: 2 },
  cartePrix: { fontSize: 15, fontWeight: '600', color: COULEURS.vert, marginTop: 4 },
  carteMeta: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 4 },
  vide: { padding: 40, alignItems: 'center' },
  videTitre: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  videTexte: { color: COULEURS.texteDoux, textAlign: 'center' },
});
