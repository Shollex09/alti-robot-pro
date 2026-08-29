import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { distanceKm, formatDistance } from '../../lib/geo';
import { ouvrirConversation } from '../../lib/messagerie';
import BoutonSignaler from '../../components/BoutonSignaler';
import Icone from '../../components/Icone';
import { COULEURS, categorieLabel, formatEuros, formatTypeProduction } from '../../lib/constants';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const { session, profile } = useAuth();
  const [produit, setProduit] = useState(null);
  const [favori, setFavori] = useState(null);
  const [quantite, setQuantite] = useState(1);
  const [commande, setCommande] = useState(false);

  const charger = useCallback(async () => {
    const { data } = await supabase
      .from('products')
      .select('*, vendeur:profiles!products_vendeur_id_fkey(id, prenom, description, type_production, latitude, longitude)')
      .eq('id', productId)
      .single();
    setProduit(data);

    const { data: fav } = await supabase
      .from('favoris')
      .select('id')
      .eq('acheteur_id', session.user.id)
      .eq('product_id', productId)
      .maybeSingle();
    setFavori(fav?.id ?? null);
  }, [productId, session.user.id]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  async function basculerFavori() {
    if (favori) {
      await supabase.from('favoris').delete().eq('id', favori);
      setFavori(null);
    } else {
      const { data } = await supabase
        .from('favoris')
        .insert({ acheteur_id: session.user.id, product_id: productId })
        .select('id')
        .single();
      setFavori(data?.id ?? null);
    }
  }

  async function contacterProducteur() {
    try {
      const conversationId = await ouvrirConversation({
        acheteurId: session.user.id,
        vendeurId: produit.vendeur_id,
        productId: produit.id,
      });
      navigation.navigate('Messages', {
        screen: 'Conversation',
        params: { conversationId, prenom: produit.vendeur?.prenom ?? 'Producteur' },
      });
    } catch (e) {
      Alert.alert('Messagerie indisponible', e.message);
    }
  }

  async function passerCommande() {
    if (quantite > produit.quantite_disponible) {
      Alert.alert('Quantité trop grande', `Il ne reste que ${produit.quantite_disponible} en stock.`);
      return;
    }
    setCommande(true);
    const { error } = await supabase.from('orders').insert({
      product_id: produit.id,
      acheteur_id: session.user.id,
      vendeur_id: produit.vendeur_id,
      quantite,
      prix_total: Number((quantite * produit.prix).toFixed(2)),
    });
    setCommande(false);
    if (error) {
      Alert.alert('Commande impossible', error.message);
      return;
    }
    Alert.alert(
      'Commande envoyée !',
      `${produit.vendeur?.prenom} va être prévenu. Retrouve ta commande dans "Mes achats".`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  }

  if (!produit) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COULEURS.vert} />
      </View>
    );
  }

  const estMonProduit = produit.vendeur_id === session.user.id;
  const distance = distanceKm(
    profile?.latitude,
    profile?.longitude,
    produit.vendeur?.latitude,
    produit.vendeur?.longitude
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {produit.photo_url ? (
        <Image source={{ uri: produit.photo_url }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.photoVide]}>
          <Icone nom="photo" taille={34} couleur={COULEURS.vert} />
        </View>
      )}

      <View style={styles.corps}>
        <Text style={styles.nom}>{produit.nom}</Text>
        <Text style={styles.categorie}>{categorieLabel(produit.categorie)}</Text>
        <Text style={styles.prix}>{formatEuros(produit.prix)} l'unité</Text>
        <Text style={styles.stock}>{produit.quantite_disponible} disponible(s)</Text>

        {produit.description ? <Text style={styles.description}>{produit.description}</Text> : null}

        <TouchableOpacity
          style={styles.vendeurCarte}
          onPress={() => navigation.navigate('SellerProfile', { vendeurId: produit.vendeur_id })}
        >
          <Text style={styles.vendeurNom}>{produit.vendeur?.prenom}</Text>
          <Text style={styles.vendeurMeta}>
            {produit.vendeur?.type_production
              ? `${formatTypeProduction(produit.vendeur.type_production)} · `
              : ''}
            {formatDistance(distance)}
          </Text>
          <Text style={styles.vendeurLien}>Voir sa vitrine →</Text>
        </TouchableOpacity>

        {estMonProduit ? (
          <Text style={styles.info}>C'est ton propre produit.</Text>
        ) : (
          <>
            <View style={styles.actionsSecondaires}>
              <TouchableOpacity style={styles.favoriBtn} onPress={basculerFavori}>
                <Icone nom="favoris" taille={16} couleur={COULEURS.vert} />
                <Text style={styles.favoriTexte}>{favori ? 'En favori' : 'Favori'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contacterBtn} onPress={contacterProducteur}>
                <Icone nom="messages" taille={16} couleur={COULEURS.vert} />
                <Text style={styles.favoriTexte}>Contacter</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Quantité</Text>
            <View style={styles.quantiteRow}>
              <TouchableOpacity
                style={styles.quantiteBtn}
                onPress={() => setQuantite((q) => Math.max(1, q - 1))}
              >
                <Text style={styles.quantiteBtnTexte}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantiteValeur}>{quantite}</Text>
              <TouchableOpacity
                style={styles.quantiteBtn}
                onPress={() => setQuantite((q) => Math.min(produit.quantite_disponible, q + 1))}
              >
                <Text style={styles.quantiteBtnTexte}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.commanderBtn} onPress={passerCommande} disabled={commande}>
              <Text style={styles.commanderTexte}>
                {commande ? '...' : `Réserver — ${formatEuros(quantite * produit.prix)}`}
              </Text>
            </TouchableOpacity>
            <Text style={styles.paiementNote}>
              Pas de paiement en ligne : tu régles directement avec le producteur au retrait.
            </Text>
            <BoutonSignaler productId={produit.id} />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photo: { width: '100%', height: 240 },
  photoVide: { backgroundColor: COULEURS.vertClair, justifyContent: 'center', alignItems: 'center' },

  corps: { padding: 20 },
  nom: { fontSize: 24, fontWeight: 'bold', color: COULEURS.texte },
  categorie: { fontSize: 14, color: COULEURS.texteDoux, marginTop: 4 },
  prix: { fontSize: 20, fontWeight: '600', color: COULEURS.vert, marginTop: 12 },
  stock: { fontSize: 14, color: COULEURS.texteDoux, marginTop: 4 },
  description: { fontSize: 15, color: COULEURS.texte, marginTop: 16, lineHeight: 22 },
  vendeurCarte: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COULEURS.fondDoux,
  },
  vendeurNom: { fontSize: 16, fontWeight: '600' },
  vendeurMeta: { fontSize: 13, color: COULEURS.texteDoux, marginTop: 4 },
  vendeurLien: { fontSize: 13, color: COULEURS.vert, marginTop: 8, fontWeight: '600' },
  actionsSecondaires: { flexDirection: 'row', gap: 10, marginTop: 20 },
  favoriBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COULEURS.vert,
    alignItems: 'center',
  },
  contacterBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COULEURS.vert,
    alignItems: 'center',
  },
  favoriTexte: { color: COULEURS.vert, fontWeight: '600' },
  label: { marginTop: 24, marginBottom: 8, fontWeight: '600', color: COULEURS.texte },
  quantiteRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  quantiteBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COULEURS.fondDoux,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantiteBtnTexte: { fontSize: 24, fontWeight: 'bold', color: COULEURS.texte },
  quantiteValeur: { fontSize: 20, fontWeight: '600', minWidth: 40, textAlign: 'center' },
  commanderBtn: {
    marginTop: 24,
    backgroundColor: COULEURS.vert,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  commanderTexte: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  paiementNote: { fontSize: 12, color: COULEURS.texteDoux, textAlign: 'center', marginTop: 12 },
  info: { marginTop: 24, color: COULEURS.texteDoux, fontStyle: 'italic', textAlign: 'center' },
});
