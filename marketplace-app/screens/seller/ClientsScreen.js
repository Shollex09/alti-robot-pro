import { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { COULEURS, formatEuros } from '../../lib/constants';

export default function ClientsScreen() {
  const { session } = useAuth();
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);

  const charger = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, acheteur:profiles!orders_acheteur_id_fkey(id, prenom)')
      .eq('vendeur_id', session.user.id)
      .neq('statut', 'annulee');
    setVentes(data ?? []);
    setLoading(false);
  }, [session.user.id]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  // Le classement se calcule tout seul à partir des ventes, comme dans le poulailler.
  const clients = useMemo(() => {
    const parClient = new Map();
    for (const vente of ventes) {
      const id = vente.acheteur_id;
      const actuel = parClient.get(id) ?? {
        id,
        prenom: vente.acheteur?.prenom ?? 'Inconnu',
        nbAchats: 0,
        quantite: 0,
        total: 0,
        derniere: null,
      };
      actuel.nbAchats += 1;
      actuel.quantite += Number(vente.quantite);
      actuel.total += Number(vente.prix_total);
      if (!actuel.derniere || vente.created_at > actuel.derniere) actuel.derniere = vente.created_at;
      parClient.set(id, actuel);
    }
    return [...parClient.values()].sort((a, b) => b.total - a.total);
  }, [ventes]);

  const caTotal = useMemo(() => clients.reduce((s, c) => s + c.total, 0), [clients]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COULEURS.vert} />
      </View>
    );
  }

  return (
    <FlatList
      data={clients}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.liste}
      ListHeaderComponent={
        <Text style={styles.entete}>
          {clients.length} client(s) · classés par montant acheté
        </Text>
      }
      ListEmptyComponent={<Text style={styles.vide}>Aucun client pour le moment.</Text>}
      renderItem={({ item, index }) => (
        <View style={styles.carte}>
          <View style={styles.rang}>
            <Text style={styles.rangTexte}>{index + 1}</Text>
          </View>
          <View style={styles.infos}>
            <Text style={styles.prenom}>{item.prenom}</Text>
            <Text style={styles.meta}>
              {item.nbAchats} achat(s) · {item.quantite} article(s)
            </Text>
            <Text style={styles.derniere}>
              Dernier achat : {new Date(item.derniere).toLocaleDateString('fr-FR')}
            </Text>
          </View>
          <View style={styles.droite}>
            <Text style={styles.total}>{formatEuros(item.total)}</Text>
            <Text style={styles.part}>
              {caTotal > 0 ? Math.round((item.total / caTotal) * 100) : 0} % du CA
            </Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  liste: { padding: 12, gap: 10 },
  entete: { color: COULEURS.texteDoux, fontSize: 13, marginBottom: 6 },
  carte: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  rang: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COULEURS.vertClair,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangTexte: { fontWeight: 'bold', color: COULEURS.vert },
  infos: { flex: 1 },
  prenom: { fontSize: 15, fontWeight: 'bold' },
  meta: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 2 },
  derniere: { fontSize: 11, color: COULEURS.texteDoux, marginTop: 2 },
  droite: { alignItems: 'flex-end' },
  total: { fontSize: 15, fontWeight: '600', color: COULEURS.vert },
  part: { fontSize: 11, color: COULEURS.texteDoux, marginTop: 2 },
  vide: { textAlign: 'center', color: COULEURS.texteDoux, padding: 20 },
});
