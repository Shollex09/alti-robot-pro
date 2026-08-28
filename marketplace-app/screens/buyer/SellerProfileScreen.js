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
import { distanceKm } from '../../lib/geo';
import { COULEURS, categorieLabel, formatEuros } from '../../lib/constants';
import EnteteProfil from '../../components/EnteteProfil';
import CarteSecteur from '../../components/CarteSecteur';

export default function SellerProfileScreen({ route, navigation }) {
  const { vendeurId } = route.params;
  const { profile } = useAuth();
  const [vendeur, setVendeur] = useState(null);
  const [produits, setProduits] = useState([]);
  const [nbVentes, setNbVentes] = useState(0);

  const charger = useCallback(async () => {
    const [{ data: v }, { data: p }, { count }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', vendeurId).single(),
      supabase
        .from('products')
        .select('*')
        .eq('vendeur_id', vendeurId)
        .eq('statut', 'disponible')
        .gt('quantite_disponible', 0)
        .order('created_at', { ascending: false }),
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('vendeur_id', vendeurId)
        .neq('statut', 'annulee'),
    ]);
    setVendeur(v);
    setProduits(p ?? []);
    setNbVentes(count ?? 0);
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
      style={styles.page}
      data={produits}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.liste}
      ListHeaderComponent={
        <EnteteProfil
          profil={vendeur}
          distance={distance}
          nbMisesEnRelation={nbVentes}
          enfant={
            <>
              <CarteSecteur
                latitude={vendeur.latitude}
                longitude={vendeur.longitude}
                titre={`Où se situe ${vendeur.prenom}`}
              />
              <Text style={styles.sectionTitre}>Ses produits ({produits.length})</Text>
            </>
          }
        />
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
  page: { backgroundColor: COULEURS.fondProfil },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  liste: { paddingBottom: 24 },
  sectionTitre: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COULEURS.encre,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  vide: { textAlign: 'center', color: COULEURS.texteDoux, padding: 20 },
  carte: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  photo: { width: 84, height: 84 },
  photoVide: { backgroundColor: COULEURS.vertClair, justifyContent: 'center', alignItems: 'center' },
  carteInfos: { flex: 1, padding: 12, justifyContent: 'center' },
  carteNom: { fontSize: 15, fontWeight: 'bold', color: COULEURS.encre },
  carteCategorie: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 2 },
  cartePrix: { fontSize: 14, fontWeight: '600', color: COULEURS.vert, marginTop: 4 },
});
