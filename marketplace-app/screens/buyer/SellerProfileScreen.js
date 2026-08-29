import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { ouvrirConversation } from '../../lib/messagerie';
import { distanceKm } from '../../lib/geo';
import { COULEURS, categorieLabel, formatEuros } from '../../lib/constants';
import EnteteProfil from '../../components/EnteteProfil';
import CarteSecteur from '../../components/CarteSecteur';

export default function SellerProfileScreen({ route, navigation }) {
  const { vendeurId } = route.params;
  const { session, profile } = useAuth();
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

  async function contacter() {
    try {
      const conversationId = await ouvrirConversation({
        acheteurId: session.user.id,
        vendeurId,
        productId: null,
      });
      navigation.navigate('Messages', {
        screen: 'Conversation',
        params: { conversationId, prenom: vendeur.prenom },
      });
    } catch (e) {
      Alert.alert('Messagerie indisponible', e.message);
    }
  }

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
              {vendeurId !== session.user.id && (
                <TouchableOpacity style={styles.contacterBtn} onPress={contacter}>
                  <Text style={styles.contacterTexte}>💬 Contacter {vendeur.prenom}</Text>
                </TouchableOpacity>
              )}
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
  contacterBtn: {
    backgroundColor: COULEURS.vert,
    borderRadius: 26,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  contacterTexte: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
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
