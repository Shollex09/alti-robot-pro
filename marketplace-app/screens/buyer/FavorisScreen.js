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
import { COULEURS, categorieLabel, formatEuros } from '../../lib/constants';
import EtatErreur from '../../components/EtatErreur';

export default function FavorisScreen({ navigation }) {
  const { session } = useAuth();
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  const charger = useCallback(async () => {
    const { data, error } = await supabase
      .from('favoris')
      .select('id, product:products(id, nom, categorie, prix, photo_url, statut, quantite_disponible)')
      .eq('acheteur_id', session.user.id)
      .order('created_at', { ascending: false });
    setErreur(error ?? null);
    if (!error) setFavoris((data ?? []).filter((f) => f.product));
    setLoading(false);
  }, [session.user.id]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  async function retirer(favoriId) {
    await supabase.from('favoris').delete().eq('id', favoriId);
    charger();
  }

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
    <FlatList
      data={favoris}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.liste}
      ListEmptyComponent={
        <View style={styles.vide}>
          <Text style={styles.videTitre}>Aucun favori</Text>
          <Text style={styles.videTexte}>
            Ajoute des produits en favori depuis leur fiche pour les retrouver ici.
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        const indisponible =
          item.product.statut !== 'disponible' || item.product.quantite_disponible <= 0;
        return (
          <TouchableOpacity
            style={styles.carte}
            onPress={() =>
              navigation.navigate('Découvrir', {
                screen: 'ProductDetail',
                params: { productId: item.product.id },
              })
            }
          >
            {item.product.photo_url ? (
              <Image source={{ uri: item.product.photo_url }} style={styles.photo} />
            ) : (
              <View style={[styles.photo, styles.photoVide]}>
                <Text style={{ fontSize: 28 }}>🌱</Text>
              </View>
            )}
            <View style={styles.infos}>
              <Text style={styles.nom}>{item.product.nom}</Text>
              <Text style={styles.categorie}>{categorieLabel(item.product.categorie)}</Text>
              <Text style={styles.prix}>{formatEuros(item.product.prix)}</Text>
              {indisponible ? <Text style={styles.epuise}>Plus disponible</Text> : null}
            </View>
            <TouchableOpacity style={styles.retirer} onPress={() => retirer(item.id)}>
              <Text style={styles.retirerTexte}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  liste: { padding: 12, gap: 12 },
  carte: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },
  photo: { width: 80, height: 80 },
  photoVide: { backgroundColor: COULEURS.vertClair, justifyContent: 'center', alignItems: 'center' },
  infos: { flex: 1, padding: 12 },
  nom: { fontSize: 15, fontWeight: 'bold' },
  categorie: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 2 },
  prix: { fontSize: 14, fontWeight: '600', color: COULEURS.vert, marginTop: 4 },
  epuise: { fontSize: 12, color: COULEURS.rouge, marginTop: 4 },
  retirer: { padding: 16 },
  retirerTexte: { fontSize: 18, color: COULEURS.texteDoux },
  vide: { padding: 40, alignItems: 'center' },
  videTitre: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  videTexte: { color: COULEURS.texteDoux, textAlign: 'center' },
});
