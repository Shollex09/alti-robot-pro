import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { COULEURS, formatEuros } from '../../lib/constants';
import ChampDate from '../../components/ChampDate';

export default function ConsommationScreen() {
  const { session } = useAuth();
  const [lignes, setLignes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [produitId, setProduitId] = useState(null);
  const [quantite, setQuantite] = useState('');
  const [prix, setPrix] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [enregistrement, setEnregistrement] = useState(false);

  const charger = useCallback(async () => {
    const [{ data: consos, error }, { data: prods }] = await Promise.all([
      supabase
        .from('consommations')
        .select('*, product:products(nom)')
        .eq('vendeur_id', session.user.id)
        .order('date', { ascending: false }),
      supabase
        .from('products')
        .select('id, nom, prix, quantite_disponible')
        .eq('vendeur_id', session.user.id)
        .neq('statut', 'retire')
        .order('nom'),
    ]);
    setErreur(error ?? null);
    setLignes(consos ?? []);
    setProduits(prods ?? []);
    setLoading(false);
  }, [session.user.id]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  const totalEconomies = useMemo(
    () => lignes.reduce((s, l) => s + Number(l.quantite) * Number(l.prix_estime), 0),
    [lignes]
  );

  function choisirProduit(p) {
    setProduitId(p.id);
    // Par défaut, on valorise ce qu'on consomme au prix de vente du produit.
    if (!prix) setPrix(String(p.prix));
  }

  async function ajouter() {
    const quantiteNum = Number(quantite.replace(',', '.'));
    const prixNum = Number(prix.replace(',', '.'));
    if (!produitId) return Alert.alert('Produit manquant', 'Choisis le produit consommé.');
    if (!Number.isFinite(quantiteNum) || quantiteNum <= 0)
      return Alert.alert('Quantité invalide', 'Indique une quantité positive.');
    if (!Number.isFinite(prixNum) || prixNum < 0)
      return Alert.alert('Prix invalide', 'Indique un prix estimatif positif.');

    setEnregistrement(true);
    const { error } = await supabase.from('consommations').insert({
      vendeur_id: session.user.id,
      product_id: produitId,
      date,
      quantite: quantiteNum,
      prix_estime: prixNum,
      commentaire: commentaire.trim() || null,
    });
    setEnregistrement(false);
    if (error) return Alert.alert('Erreur', error.message);

    setQuantite('');
    setPrix('');
    setCommentaire('');
    setProduitId(null);
    setFormulaireOuvert(false);
    charger();
  }

  function supprimer(ligne) {
    Alert.alert(
      'Supprimer cette consommation ?',
      'La quantité sera remise en stock.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await supabase.from('consommations').delete().eq('id', ligne.id);
            charger();
          },
        },
      ]
    );
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
      <View style={styles.center}>
        <Text style={styles.erreurTitre}>Table manquante</Text>
        <Text style={styles.erreurTexte}>
          Exécute le script supabase/03-gestion-vendeur.sql dans Supabase pour activer la
          consommation personnelle.
        </Text>
      </View>
    );
  }

  const produitChoisi = produits.find((p) => p.id === produitId);

  return (
    <FlatList
      data={lignes}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.liste}
      ListHeaderComponent={
        <View>
          <View style={styles.resume}>
            <Text style={styles.resumeLabel}>Économies réalisées</Text>
            <Text style={styles.resumeValeur}>{formatEuros(totalEconomies)}</Text>
            <Text style={styles.resumeNote}>
              Ce que tu consommes sort du stock sans rentrée d'argent, mais compte comme une
              économie dans ton bilan.
            </Text>
          </View>

          {formulaireOuvert ? (
            <View style={styles.formulaire}>
              <Text style={styles.formTitre}>Enregistrer une consommation</Text>

              <Text style={styles.label}>Date</Text>
              <ChampDate valeur={date} onChange={setDate} />

              <Text style={styles.label}>Produit consommé</Text>
              {produits.length === 0 ? (
                <Text style={styles.aide}>Crée d'abord une annonce dans « Annonces ».</Text>
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
              {produitChoisi ? (
                <Text style={styles.aide}>
                  Stock disponible : {produitChoisi.quantite_disponible}
                </Text>
              ) : null}

              <Text style={styles.label}>Quantité consommée</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex : 6"
                value={quantite}
                onChangeText={setQuantite}
              />

              <Text style={styles.label}>Prix estimatif à l'unité (€)</Text>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                placeholder="Ex : 0.40"
                value={prix}
                onChangeText={setPrix}
              />

              <Text style={styles.label}>Commentaire</Text>
              <TextInput
                style={styles.input}
                placeholder="Facultatif"
                value={commentaire}
                onChangeText={setCommentaire}
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
                  onPress={ajouter}
                  disabled={enregistrement}
                >
                  <Text style={styles.validerTexte}>{enregistrement ? '...' : 'Ajouter'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.ouvrirBtn} onPress={() => setFormulaireOuvert(true)}>
              <Text style={styles.ouvrirTexte}>+ Enregistrer une consommation</Text>
            </TouchableOpacity>
          )}
        </View>
      }
      ListEmptyComponent={<Text style={styles.vide}>Aucune consommation enregistrée.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.ligne} onLongPress={() => supprimer(item)}>
          <View style={styles.ligneGauche}>
            <Text style={styles.ligneTitre}>{item.product?.nom ?? 'Produit supprimé'}</Text>
            <Text style={styles.ligneDate}>
              {new Date(item.date).toLocaleDateString('fr-FR')} · {item.quantite} ×{' '}
              {formatEuros(item.prix_estime)}
            </Text>
            {item.commentaire ? (
              <Text style={styles.ligneCommentaire}>{item.commentaire}</Text>
            ) : null}
          </View>
          <Text style={styles.ligneMontant}>
            {formatEuros(Number(item.quantite) * Number(item.prix_estime))}
          </Text>
        </TouchableOpacity>
      )}
      ListFooterComponent={
        lignes.length > 0 ? (
          <Text style={styles.astuce}>Appui long sur une ligne pour la supprimer.</Text>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  erreurTitre: { fontSize: 17, fontWeight: 'bold', marginBottom: 10 },
  erreurTexte: { textAlign: 'center', color: COULEURS.texteDoux, lineHeight: 20 },
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
  resumeNote: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 8, textAlign: 'center' },
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
  aide: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 6 },
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
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: 10,
    padding: 14,
  },
  ligneGauche: { flex: 1 },
  ligneTitre: { fontSize: 15, fontWeight: '600' },
  ligneDate: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 2 },
  ligneCommentaire: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 4, fontStyle: 'italic' },
  ligneMontant: { fontSize: 16, fontWeight: 'bold', color: COULEURS.vert },
  vide: { textAlign: 'center', color: COULEURS.texteDoux, padding: 20 },
  astuce: { textAlign: 'center', color: COULEURS.texteDoux, fontSize: 12, marginTop: 12 },
});
