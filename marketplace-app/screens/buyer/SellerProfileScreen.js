import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
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
import { COULEURS, RAYON } from '../../lib/constants';
import EnteteProfil from '../../components/EnteteProfil';
import CarteSecteur from '../../components/CarteSecteur';
import CarteProduit from '../../components/CarteProduit';
import Icone from '../../components/Icone';

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
                  <Icone nom="messages" taille={17} couleur="#fff" />
                  <Text style={styles.contacterTexte}>Contacter {vendeur.prenom}</Text>
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
        <CarteProduit
          style={styles.carteProduit}
          produit={item}
          onPress={() => navigation.push('ProductDetail', { productId: item.id })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: COULEURS.fondProfil },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  liste: { paddingBottom: 24, gap: 12 },
  sectionTitre: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COULEURS.encre,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  contacterBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COULEURS.vert,
    borderRadius: RAYON.pilule,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 16,
  },
  contacterTexte: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  carteProduit: { marginHorizontal: 16 },
  vide: { textAlign: 'center', color: COULEURS.texteDoux, padding: 20 },
});
