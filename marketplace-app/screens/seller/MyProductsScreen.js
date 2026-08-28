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
import { COULEURS, categorieLabel, formatEuros } from '../../lib/constants';

const STATUT_LABEL = {
  disponible: { texte: 'En ligne', couleur: COULEURS.vert },
  epuise: { texte: 'Épuisé', couleur: '#ef6c00' },
  retire: { texte: 'Retiré', couleur: COULEURS.texteDoux },
};

export default function MyProductsScreen({ navigation }) {
  const { session } = useAuth();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  const charger = useCallback(async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('vendeur_id', session.user.id)
      .order('created_at', { ascending: false });
    setProduits(data ?? []);
    setLoading(false);
  }, [session.user.id]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  function confirmerSuppression(produit) {
    Alert.alert('Retirer cette annonce ?', `"${produit.nom}" ne sera plus visible par les acheteurs.`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Retirer',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('products').update({ statut: 'retire' }).eq('id', produit.id);
          charger();
        },
      },
    ]);
  }

  async function remettreEnLigne(produit) {
    if (produit.quantite_disponible <= 0) {
      Alert.alert(
        'Stock à zéro',
        "Modifie d'abord la quantité disponible pour remettre l'annonce en ligne."
      );
      return;
    }
    await supabase.from('products').update({ statut: 'disponible' }).eq('id', produit.id);
    charger();
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COULEURS.vert} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={produits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.liste}
        ListEmptyComponent={
          <View style={styles.vide}>
            <Text style={styles.videTitre}>Aucune annonce</Text>
            <Text style={styles.videTexte}>Appuie sur « + Nouvelle annonce » pour commencer.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const statut = STATUT_LABEL[item.statut] ?? STATUT_LABEL.disponible;
          return (
            <View style={styles.carte}>
              <TouchableOpacity
                style={styles.carteHaut}
                onPress={() => navigation.navigate('ProductForm', { productId: item.id })}
              >
                {item.photo_url ? (
                  <Image source={{ uri: item.photo_url }} style={styles.photo} />
                ) : (
                  <View style={[styles.photo, styles.photoVide]}>
                    <Text style={{ fontSize: 28 }}>🌱</Text>
                  </View>
                )}
                <View style={styles.infos}>
                  <Text style={styles.nom}>{item.nom}</Text>
                  <Text style={styles.categorie}>{categorieLabel(item.categorie)}</Text>
                  <Text style={styles.prix}>
                    {formatEuros(item.prix)} · {item.quantite_disponible} en stock
                  </Text>
                  <Text style={[styles.statut, { color: statut.couleur }]}>{statut.texte}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.action}
                  onPress={() => navigation.navigate('ProductForm', { productId: item.id })}
                >
                  <Text style={styles.actionTexte}>Modifier</Text>
                </TouchableOpacity>
                {item.statut === 'retire' ? (
                  <TouchableOpacity style={styles.action} onPress={() => remettreEnLigne(item)}>
                    <Text style={[styles.actionTexte, { color: COULEURS.vert }]}>Remettre en ligne</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.action} onPress={() => confirmerSuppression(item)}>
                    <Text style={[styles.actionTexte, { color: COULEURS.rouge }]}>Retirer</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
      />
      <TouchableOpacity
        style={styles.ajouterBtn}
        onPress={() => navigation.navigate('ProductForm', {})}
      >
        <Text style={styles.ajouterTexte}>+ Nouvelle annonce</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  liste: { padding: 12, gap: 12, paddingBottom: 90 },
  carte: { borderWidth: 1, borderColor: COULEURS.bord, borderRadius: 12, overflow: 'hidden' },
  carteHaut: { flexDirection: 'row' },
  photo: { width: 90, height: 90 },
  photoVide: { backgroundColor: COULEURS.vertClair, justifyContent: 'center', alignItems: 'center' },
  infos: { flex: 1, padding: 12 },
  nom: { fontSize: 15, fontWeight: 'bold' },
  categorie: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 2 },
  prix: { fontSize: 13, marginTop: 4 },
  statut: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  actions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COULEURS.bord },
  action: { flex: 1, padding: 12, alignItems: 'center' },
  actionTexte: { fontSize: 13, fontWeight: '600', color: COULEURS.bleu },
  ajouterBtn: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: COULEURS.vert,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  ajouterTexte: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  vide: { padding: 40, alignItems: 'center' },
  videTitre: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  videTexte: { color: COULEURS.texteDoux, textAlign: 'center' },
});
