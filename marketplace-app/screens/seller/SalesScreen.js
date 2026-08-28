import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { useCommandes } from '../../lib/CommandesContext';
import { chargerDonneesVendeur, toutesLesVentes } from '../../lib/gestion';
import { COULEURS, formatEuros } from '../../lib/constants';
import ChampDate from '../../components/ChampDate';

export default function SalesScreen() {
  const { session } = useAuth();
  const { rafraichir: rafraichirPastille } = useCommandes();
  const [donnees, setDonnees] = useState(null);
  const [commandesBrutes, setCommandesBrutes] = useState([]);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [produitId, setProduitId] = useState(null);
  const [clientNom, setClientNom] = useState('');
  const [quantite, setQuantite] = useState('');
  const [prix, setPrix] = useState('');
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [enregistrement, setEnregistrement] = useState(false);

  const charger = useCallback(async () => {
    const d = await chargerDonneesVendeur(session.user.id);
    setDonnees(d);
    setCommandesBrutes(d.commandes);
    rafraichirPastille();
  }, [session.user.id, rafraichirPastille]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  const ventes = useMemo(() => (donnees ? toutesLesVentes(donnees) : []), [donnees]);
  const total = useMemo(() => ventes.reduce((s, v) => s + v.total, 0), [ventes]);
  const enAttente = commandesBrutes.filter((c) => c.statut === 'commande');
  const produits = (donnees?.produits ?? []).filter((p) => p.statut !== 'retire');

  async function changerStatut(commandeId, statut) {
    const { error } = await supabase.from('orders').update({ statut }).eq('id', commandeId);
    if (error) return Alert.alert('Erreur', error.message);
    charger();
  }

  function choisirProduit(p) {
    setProduitId(p.id);
    if (!prix) setPrix(String(p.prix));
  }

  async function ajouterVenteDirecte() {
    const quantiteNum = Number(quantite.replace(',', '.'));
    const prixNum = Number(prix.replace(',', '.'));
    if (!produitId) return Alert.alert('Produit manquant', 'Choisis le produit vendu.');
    if (!clientNom.trim()) return Alert.alert('Client manquant', 'Indique le nom de l\'acheteur.');
    if (!Number.isFinite(quantiteNum) || quantiteNum <= 0)
      return Alert.alert('Quantité invalide', 'Indique une quantité positive.');
    if (!Number.isFinite(prixNum) || prixNum < 0)
      return Alert.alert('Prix invalide', 'Indique un prix positif.');

    setEnregistrement(true);
    const { error } = await supabase.from('ventes_directes').insert({
      vendeur_id: session.user.id,
      product_id: produitId,
      date,
      client_nom: clientNom.trim(),
      quantite: quantiteNum,
      prix_unitaire: prixNum,
    });
    setEnregistrement(false);
    if (error) return Alert.alert('Erreur', error.message);

    setClientNom('');
    setQuantite('');
    setPrix('');
    setProduitId(null);
    setFormulaireOuvert(false);
    charger();
  }

  function supprimerVenteDirecte(vente) {
    Alert.alert('Supprimer cette vente ?', 'La quantité sera remise en stock.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('ventes_directes').delete().eq('id', vente.id);
          charger();
        },
      },
    ]);
  }

  if (!donnees) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COULEURS.vert} />
      </View>
    );
  }

  return (
    <FlatList
      data={ventes}
      keyExtractor={(item) => `${item.source}-${item.id}`}
      contentContainerStyle={styles.liste}
      ListHeaderComponent={
        <View>
          <View style={styles.resume}>
            <Text style={styles.resumeLabel}>Chiffre d'affaires</Text>
            <Text style={styles.resumeValeur}>{formatEuros(total)}</Text>
            <Text style={styles.resumeNote}>{ventes.length} vente(s), appli et direct confondus</Text>
          </View>

          {enAttente.length > 0 && (
            <View style={styles.attenteBloc}>
              <Text style={styles.attenteTitre}>
                {enAttente.length} commande(s) à confirmer
              </Text>
              {enAttente.map((c) => (
                <View key={c.id} style={styles.attenteCarte}>
                  <Text style={styles.attenteNom}>
                    {c.product?.nom ?? 'Produit supprimé'} — {c.quantite} ×
                  </Text>
                  <Text style={styles.attenteMeta}>
                    pour {c.acheteur?.prenom ?? '?'} · {formatEuros(c.prix_total)}
                  </Text>
                  <View style={styles.attenteActions}>
                    <TouchableOpacity
                      style={[styles.action, styles.actionValider]}
                      onPress={() => changerStatut(c.id, 'confirmee')}
                    >
                      <Text style={styles.actionValiderTexte}>Confirmer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.action, styles.actionAnnuler]}
                      onPress={() => changerStatut(c.id, 'annulee')}
                    >
                      <Text style={styles.actionAnnulerTexte}>Annuler</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {formulaireOuvert ? (
            <View style={styles.formulaire}>
              <Text style={styles.formTitre}>Vente en direct</Text>
              <Text style={styles.aide}>
                Pour une vente faite de la main à la main, hors appli.
              </Text>

              <Text style={styles.label}>Date</Text>
              <ChampDate valeur={date} onChange={setDate} />

              <Text style={styles.label}>Produit vendu</Text>
              {produits.length === 0 ? (
                <Text style={styles.aide}>Crée d'abord une annonce.</Text>
              ) : (
                <View style={styles.options}>
                  {produits.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.option, produitId === p.id && styles.optionActive]}
                      onPress={() => choisirProduit(p)}
                    >
                      <Text
                        style={[styles.optionTexte, produitId === p.id && styles.optionTexteActif]}
                      >
                        {p.nom}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={styles.label}>Nom de l'acheteur</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex : Martine"
                value={clientNom}
                onChangeText={setClientNom}
              />

              <Text style={styles.label}>Quantité</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex : 12"
                value={quantite}
                onChangeText={setQuantite}
              />

              <Text style={styles.label}>Prix à l'unité (€)</Text>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                placeholder="Ex : 0.40"
                value={prix}
                onChangeText={setPrix}
              />

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.annulerBtn}
                  onPress={() => setFormulaireOuvert(false)}
                >
                  <Text style={styles.annulerTexte}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.validerBtn}
                  onPress={ajouterVenteDirecte}
                  disabled={enregistrement}
                >
                  <Text style={styles.validerTexte}>{enregistrement ? '...' : 'Ajouter'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.ouvrirBtn} onPress={() => setFormulaireOuvert(true)}>
              <Text style={styles.ouvrirTexte}>+ Vente en direct</Text>
            </TouchableOpacity>
          )}
        </View>
      }
      ListEmptyComponent={<Text style={styles.vide}>Aucune vente pour le moment.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.carte}
          onLongPress={() => item.source === 'directe' && supprimerVenteDirecte(item)}
        >
          <View style={styles.ligne}>
            <Text style={styles.nom}>{item.produit}</Text>
            <Text style={styles.montant}>{formatEuros(item.total)}</Text>
          </View>
          <Text style={styles.meta}>
            {item.quantite} × pour {item.client} ·{' '}
            {new Date(item.date).toLocaleDateString('fr-FR')}
          </Text>
          <Text style={styles.source}>
            {item.source === 'appli'
              ? item.statut === 'confirmee'
                ? '📱 Appli · ✓ confirmée'
                : '📱 Appli · en attente'
              : '🤝 Vente en direct'}
          </Text>
        </TouchableOpacity>
      )}
      ListFooterComponent={
        ventes.length > 0 ? (
          <Text style={styles.astuce}>
            Appui long sur une vente en direct pour la supprimer.
          </Text>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  liste: { padding: 16, gap: 10 },
  resume: {
    backgroundColor: COULEURS.vertClair,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  resumeLabel: { fontSize: 13, color: COULEURS.texteDoux },
  resumeValeur: { fontSize: 26, fontWeight: 'bold', color: COULEURS.vert, marginTop: 4 },
  resumeNote: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 4, textAlign: 'center' },
  attenteBloc: { marginBottom: 12, gap: 8 },
  attenteTitre: { fontSize: 14, fontWeight: 'bold', color: '#ef6c00' },
  attenteCarte: {
    borderWidth: 1,
    borderColor: '#ffcc80',
    backgroundColor: '#fff8e1',
    borderRadius: 10,
    padding: 12,
  },
  attenteNom: { fontSize: 15, fontWeight: '600' },
  attenteMeta: { fontSize: 13, color: COULEURS.texteDoux, marginTop: 2 },
  attenteActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  action: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  actionValider: { backgroundColor: COULEURS.vert },
  actionValiderTexte: { color: '#fff', fontWeight: '600' },
  actionAnnuler: { borderWidth: 1, borderColor: COULEURS.rouge },
  actionAnnulerTexte: { color: COULEURS.rouge, fontWeight: '600' },
  ouvrirBtn: {
    backgroundColor: COULEURS.vert,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  ouvrirTexte: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  formulaire: {
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  formTitre: { fontSize: 16, fontWeight: 'bold' },
  label: { marginTop: 12, marginBottom: 6, fontWeight: '600', fontSize: 13 },
  aide: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 4 },
  input: { borderWidth: 1, borderColor: COULEURS.bord, borderRadius: 8, padding: 10, fontSize: 15 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COULEURS.fondDoux,
  },
  optionActive: { backgroundColor: COULEURS.vert },
  optionTexte: { fontSize: 13, color: COULEURS.texte },
  optionTexteActif: { color: '#fff', fontWeight: '600' },
  formActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  annulerBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COULEURS.bord,
    alignItems: 'center',
  },
  annulerTexte: { color: COULEURS.texteDoux, fontWeight: '600' },
  validerBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COULEURS.vert,
    alignItems: 'center',
  },
  validerTexte: { color: '#fff', fontWeight: 'bold' },
  carte: { borderWidth: 1, borderColor: COULEURS.bord, borderRadius: 12, padding: 14, gap: 4 },
  ligne: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nom: { fontSize: 15, fontWeight: 'bold', flex: 1 },
  montant: { fontSize: 15, fontWeight: '600', color: COULEURS.vert },
  meta: { fontSize: 13, color: COULEURS.texteDoux },
  source: { fontSize: 11, color: COULEURS.texteDoux },
  vide: { textAlign: 'center', color: COULEURS.texteDoux, padding: 20 },
  astuce: { textAlign: 'center', color: COULEURS.texteDoux, fontSize: 12, marginTop: 12 },
});
