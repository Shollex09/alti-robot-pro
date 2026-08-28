import { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { COULEURS, categorieLabel, formatEuros } from '../../lib/constants';

export default function StockScreen({ navigation }) {
  const { session } = useAuth();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  const charger = useCallback(async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('vendeur_id', session.user.id)
      .neq('statut', 'retire')
      .order('nom');
    setProduits(data ?? []);
    setLoading(false);
  }, [session.user.id]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  const valeurTotale = useMemo(
    () => produits.reduce((somme, p) => somme + p.quantite_disponible * p.prix, 0),
    [produits]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COULEURS.vert} />
      </View>
    );
  }

  return (
    <FlatList
      data={produits}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.liste}
      ListHeaderComponent={
        <View style={styles.resume}>
          <Text style={styles.resumeLabel}>Valeur totale du stock</Text>
          <Text style={styles.resumeValeur}>{formatEuros(valeurTotale)}</Text>
          <Text style={styles.resumeNote}>
            Le stock se met à jour tout seul à chaque réservation.
          </Text>
        </View>
      }
      ListEmptyComponent={<Text style={styles.vide}>Aucun produit en stock.</Text>}
      renderItem={({ item }) => {
        const alerte = item.quantite_disponible <= 0;
        const faible = !alerte && item.quantite_disponible <= 3;
        return (
          <TouchableOpacity
            style={styles.ligne}
            onPress={() =>
              navigation.navigate('MyProducts', {
                screen: 'ProductForm',
                params: { productId: item.id },
              })
            }
          >
            <View style={styles.ligneGauche}>
              <Text style={styles.nom}>{item.nom}</Text>
              <Text style={styles.categorie}>{categorieLabel(item.categorie)}</Text>
            </View>
            <View style={styles.ligneDroite}>
              <Text
                style={[
                  styles.quantite,
                  alerte && styles.quantiteAlerte,
                  faible && styles.quantiteFaible,
                ]}
              >
                {item.quantite_disponible}
              </Text>
              <Text style={styles.valeur}>
                {formatEuros(item.quantite_disponible * item.prix)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  liste: { padding: 12 },
  resume: {
    backgroundColor: COULEURS.vertClair,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  resumeLabel: { fontSize: 13, color: COULEURS.texteDoux },
  resumeValeur: { fontSize: 28, fontWeight: 'bold', color: COULEURS.vert, marginTop: 4 },
  resumeNote: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 8, textAlign: 'center' },
  ligne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COULEURS.bord,
  },
  ligneGauche: { flex: 1 },
  ligneDroite: { alignItems: 'flex-end' },
  nom: { fontSize: 15, fontWeight: '600' },
  categorie: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 2 },
  quantite: { fontSize: 18, fontWeight: 'bold', color: COULEURS.vert },
  quantiteFaible: { color: '#ef6c00' },
  quantiteAlerte: { color: COULEURS.rouge },
  valeur: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 2 },
  vide: { textAlign: 'center', color: COULEURS.texteDoux, padding: 20 },
});
