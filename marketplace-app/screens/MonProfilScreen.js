import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { COULEURS, categorieLabel, formatEuros } from '../lib/constants';
import EnteteProfil from '../components/EnteteProfil';

export default function MonProfilScreen({ navigation }) {
  const { session, profile, estVendeur } = useAuth();
  const [produits, setProduits] = useState([]);
  const [nbMisesEnRelation, setNbMisesEnRelation] = useState(0);
  const [loading, setLoading] = useState(true);

  const charger = useCallback(async () => {
    const colonne = estVendeur ? 'vendeur_id' : 'acheteur_id';
    const [{ count }, { data }] = await Promise.all([
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq(colonne, session.user.id)
        .neq('statut', 'annulee'),
      estVendeur
        ? supabase
            .from('products')
            .select('*')
            .eq('vendeur_id', session.user.id)
            .eq('statut', 'disponible')
            .gt('quantite_disponible', 0)
            .order('created_at', { ascending: false })
        : Promise.resolve({ data: [] }),
    ]);
    setNbMisesEnRelation(count ?? 0);
    setProduits(data ?? []);
    setLoading(false);
  }, [session.user.id, estVendeur]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  if (loading || !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COULEURS.vert} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.contenu}>
      <EnteteProfil
        profil={profile}
        secteurTexte={
          profile.latitude != null ? 'Ton secteur est enregistré' : 'Secteur non renseigné'
        }
        nbMisesEnRelation={nbMisesEnRelation}
      />

      <Text style={styles.apercu}>
        Voici ce que les autres voient de toi — sans ton adresse ni ton email.
      </Text>

      <TouchableOpacity
        style={styles.modifierBtn}
        onPress={() => navigation.navigate('ReglagesProfil')}
      >
        <Text style={styles.modifierTexte}>Modifier mon profil</Text>
      </TouchableOpacity>

      {estVendeur && (
        <>
          <Text style={styles.sectionTitre}>Mes produits en ligne ({produits.length})</Text>
          {produits.length === 0 ? (
            <Text style={styles.vide}>Aucun produit en ligne pour le moment.</Text>
          ) : (
            produits.map((p) => (
              <View key={p.id} style={styles.carte}>
                {p.photo_url ? (
                  <Image source={{ uri: p.photo_url }} style={styles.photo} />
                ) : (
                  <View style={[styles.photo, styles.photoVide]}>
                    <Text style={{ fontSize: 28 }}>🌱</Text>
                  </View>
                )}
                <View style={styles.carteInfos}>
                  <Text style={styles.carteNom}>{p.nom}</Text>
                  <Text style={styles.carteCategorie}>{categorieLabel(p.categorie)}</Text>
                  <Text style={styles.cartePrix}>{formatEuros(p.prix)}</Text>
                </View>
              </View>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: COULEURS.fondProfil },
  contenu: { paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  apercu: {
    fontSize: 12,
    color: COULEURS.texteDoux,
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 24,
  },
  modifierBtn: {
    backgroundColor: COULEURS.encre,
    borderRadius: 26,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
  },
  modifierTexte: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  sectionTitre: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COULEURS.encre,
    marginTop: 24,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  vide: { textAlign: 'center', color: COULEURS.texteDoux, paddingHorizontal: 20 },
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
