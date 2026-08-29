import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { COULEURS, formatEuros } from '../../lib/constants';
import EtatErreur from '../../components/EtatErreur';

const STATUTS = {
  commande: { label: 'En attente', couleur: '#ef6c00' },
  confirmee: { label: 'Confirmée', couleur: COULEURS.vert },
  annulee: { label: 'Annulée', couleur: COULEURS.rouge },
};

export default function MyOrdersScreen({ navigation }) {
  const { session } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  const charger = useCallback(async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(
        '*, product:products(id, nom, photo_url), vendeur:profiles!orders_vendeur_id_fkey(prenom)'
      )
      .eq('acheteur_id', session.user.id)
      .order('created_at', { ascending: false });
    setErreur(error ?? null);
    if (!error) setCommandes(data ?? []);
    setLoading(false);
  }, [session.user.id]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

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
      data={commandes}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.liste}
      ListEmptyComponent={
        <View style={styles.vide}>
          <Text style={styles.videTitre}>Aucune commande</Text>
          <Text style={styles.videTexte}>Tes réservations apparaîtront ici.</Text>
        </View>
      }
      renderItem={({ item }) => {
        const statut = STATUTS[item.statut] ?? STATUTS.commande;
        return (
          <TouchableOpacity
            style={styles.carte}
            onPress={() =>
              item.product &&
              navigation.navigate('Découvrir', {
                screen: 'ProductDetail',
                params: { productId: item.product.id },
              })
            }
          >
            <View style={styles.ligne}>
              <Text style={styles.nom}>{item.product?.nom ?? 'Produit supprimé'}</Text>
              <Text style={[styles.statut, { color: statut.couleur }]}>{statut.label}</Text>
            </View>
            <Text style={styles.meta}>
              {item.quantite} × chez {item.vendeur?.prenom ?? '?'}
            </Text>
            <View style={styles.ligne}>
              <Text style={styles.date}>
                {new Date(item.created_at).toLocaleDateString('fr-FR')}
              </Text>
              <Text style={styles.total}>{formatEuros(item.prix_total)}</Text>
            </View>

            {item.statut === 'confirmee' ? (
              <View style={styles.retrait}>
                <Text style={styles.retraitTitre}>Où venir chercher</Text>
                <Text style={styles.retraitTexte}>
                  {item.infos_retrait?.trim()
                    ? item.infos_retrait
                    : `${item.vendeur?.prenom ?? 'Le producteur'} n'a pas précisé le lieu — écris-lui pour convenir du retrait.`}
                </Text>
                <Text style={styles.retraitNote}>
                  Le règlement se fait sur place, directement au producteur.
                </Text>
              </View>
            ) : null}
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
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  ligne: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nom: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  statut: { fontSize: 13, fontWeight: '600' },
  meta: { fontSize: 13, color: COULEURS.texteDoux },
  date: { fontSize: 12, color: COULEURS.texteDoux },
  total: { fontSize: 15, fontWeight: '600', color: COULEURS.vert },
  retrait: {
    backgroundColor: COULEURS.vertClair,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  retraitTitre: { fontSize: 12, fontWeight: '700', color: COULEURS.vertProfond },
  retraitTexte: { fontSize: 14, color: COULEURS.texte, marginTop: 5, lineHeight: 20 },
  retraitNote: { fontSize: 11, color: COULEURS.texteDoux, marginTop: 8 },
  vide: { padding: 40, alignItems: 'center' },
  videTitre: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  videTexte: { color: COULEURS.texteDoux },
});
