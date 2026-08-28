import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { COULEURS, formatEuros } from '../../lib/constants';

export default function SalesScreen() {
  const { session } = useAuth();
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);

  const charger = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, product:products(nom), acheteur:profiles!orders_acheteur_id_fkey(prenom)')
      .eq('vendeur_id', session.user.id)
      .order('created_at', { ascending: false });
    setVentes(data ?? []);
    setLoading(false);
  }, [session.user.id]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  const total = useMemo(
    () =>
      ventes
        .filter((v) => v.statut !== 'annulee')
        .reduce((somme, v) => somme + Number(v.prix_total), 0),
    [ventes]
  );

  async function changerStatut(vente, statut) {
    const { error } = await supabase.from('orders').update({ statut }).eq('id', vente.id);
    if (error) {
      Alert.alert('Erreur', error.message);
      return;
    }
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
    <FlatList
      data={ventes}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.liste}
      ListHeaderComponent={
        <View style={styles.resume}>
          <Text style={styles.resumeLabel}>Chiffre d'affaires</Text>
          <Text style={styles.resumeValeur}>{formatEuros(total)}</Text>
          <Text style={styles.resumeNote}>
            {ventes.filter((v) => v.statut !== 'annulee').length} vente(s)
          </Text>
        </View>
      }
      ListEmptyComponent={<Text style={styles.vide}>Aucune vente pour le moment.</Text>}
      renderItem={({ item }) => (
        <View style={styles.carte}>
          <View style={styles.ligne}>
            <Text style={styles.nom}>{item.product?.nom ?? 'Produit supprimé'}</Text>
            <Text style={styles.montant}>{formatEuros(item.prix_total)}</Text>
          </View>
          <Text style={styles.meta}>
            {item.quantite} × pour {item.acheteur?.prenom ?? '?'} ·{' '}
            {new Date(item.created_at).toLocaleDateString('fr-FR')}
          </Text>
          {item.statut === 'commande' ? (
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.action, styles.actionValider]}
                onPress={() => changerStatut(item, 'confirmee')}
              >
                <Text style={styles.actionValiderTexte}>Confirmer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.action, styles.actionAnnuler]}
                onPress={() => changerStatut(item, 'annulee')}
              >
                <Text style={styles.actionAnnulerTexte}>Annuler</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text
              style={[
                styles.statut,
                { color: item.statut === 'confirmee' ? COULEURS.vert : COULEURS.rouge },
              ]}
            >
              {item.statut === 'confirmee' ? '✓ Confirmée' : '✕ Annulée'}
            </Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  liste: { padding: 12, gap: 12 },
  resume: {
    backgroundColor: COULEURS.vertClair,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  resumeLabel: { fontSize: 13, color: COULEURS.texteDoux },
  resumeValeur: { fontSize: 28, fontWeight: 'bold', color: COULEURS.vert, marginTop: 4 },
  resumeNote: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 4 },
  carte: { borderWidth: 1, borderColor: COULEURS.bord, borderRadius: 12, padding: 16, gap: 6 },
  ligne: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nom: { fontSize: 15, fontWeight: 'bold', flex: 1 },
  montant: { fontSize: 15, fontWeight: '600', color: COULEURS.vert },
  meta: { fontSize: 13, color: COULEURS.texteDoux },
  statut: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  action: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  actionValider: { backgroundColor: COULEURS.vert },
  actionValiderTexte: { color: '#fff', fontWeight: '600' },
  actionAnnuler: { borderWidth: 1, borderColor: COULEURS.rouge },
  actionAnnulerTexte: { color: COULEURS.rouge, fontWeight: '600' },
  vide: { textAlign: 'center', color: COULEURS.texteDoux, padding: 20 },
});
