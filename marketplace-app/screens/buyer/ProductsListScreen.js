import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { distanceKm } from '../../lib/geo';
import { CATEGORIES, COULEURS, RAYON } from '../../lib/constants';
import EtatErreur from '../../components/EtatErreur';
import CarteProduit from '../../components/CarteProduit';

export default function ProductsListScreen({ navigation }) {
  const { profile } = useAuth();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categorie, setCategorie] = useState(null);
  const [erreur, setErreur] = useState(null);

  const charger = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, vendeur:profiles!products_vendeur_id_fkey(id, prenom, latitude, longitude)')
      .eq('statut', 'disponible')
      .gt('quantite_disponible', 0)
      .order('created_at', { ascending: false });
    setErreur(error ?? null);
    if (!error) setProduits(data ?? []);
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

  if (erreur) {
    return (
      <EtatErreur
        erreur={erreur}
        onReessayer={() => {
          setLoading(true);
          charger();
        }}
      />
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
          <CarteProduit
            produit={item}
            distance={item.distance}
            vendeurPrenom={item.vendeur?.prenom}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          />
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
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: RAYON.pilule,
    backgroundColor: COULEURS.fondDoux,
  },
  filtreActif: { backgroundColor: COULEURS.vert },
  filtreTexte: { fontSize: 13, color: COULEURS.texte },
  filtreTexteActif: { color: '#fff', fontWeight: '600' },
  liste: { padding: 12, gap: 12 },
  vide: { padding: 40, alignItems: 'center' },
  videTitre: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  videTexte: { color: COULEURS.texteDoux, textAlign: 'center' },
});
