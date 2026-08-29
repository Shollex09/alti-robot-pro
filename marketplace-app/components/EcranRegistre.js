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
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { COULEURS, formatEuros } from '../lib/constants';
import ChampDate from './ChampDate';

// Écran commun aux coûts et aux investissements : une date, un libellé
// (texte libre ou liste de choix), un montant, un commentaire.
export default function EcranRegistre({ table, champ, titreAjout, resumeLabel }) {
  const { session } = useAuth();
  const [lignes, setLignes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [valeurChamp, setValeurChamp] = useState(champ.options ? champ.options[0] : '');
  const [montant, setMontant] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [enregistrement, setEnregistrement] = useState(false);

  const charger = useCallback(async () => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('vendeur_id', session.user.id)
      .order('date', { ascending: false });
    setErreur(error ?? null);
    setLignes(data ?? []);
    setLoading(false);
  }, [table, session.user.id]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  const total = useMemo(() => lignes.reduce((s, l) => s + Number(l.montant), 0), [lignes]);

  async function ajouter() {
    const montantNum = Number(montant.replace(',', '.'));
    if (!Number.isFinite(montantNum) || montantNum < 0) {
      Alert.alert('Montant invalide', 'Indique un montant positif.');
      return;
    }
    if (!String(valeurChamp).trim()) {
      Alert.alert(`${champ.label} manquant`, `Renseigne ${champ.label.toLowerCase()}.`);
      return;
    }
    setEnregistrement(true);
    const { error } = await supabase.from(table).insert({
      vendeur_id: session.user.id,
      date,
      [champ.cle]: String(valeurChamp).trim(),
      montant: montantNum,
      commentaire: commentaire.trim() || null,
    });
    setEnregistrement(false);
    if (error) {
      Alert.alert('Erreur', error.message);
      return;
    }
    setMontant('');
    setCommentaire('');
    if (!champ.options) setValeurChamp('');
    setFormulaireOuvert(false);
    charger();
  }

  function supprimer(ligne) {
    Alert.alert('Supprimer cette ligne ?', formatEuros(ligne.montant), [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await supabase.from(table).delete().eq('id', ligne.id);
          charger();
        },
      },
    ]);
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
          Exécute le script supabase/03-gestion-vendeur.sql dans Supabase pour créer la table «{' '}
          {table} ».
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={lignes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.liste}
        ListHeaderComponent={
          <View>
            <View style={styles.resume}>
              <Text style={styles.resumeLabel}>{resumeLabel}</Text>
              <Text style={styles.resumeValeur}>{formatEuros(total)}</Text>
              <Text style={styles.resumeNote}>{lignes.length} ligne(s)</Text>
            </View>

            {formulaireOuvert ? (
              <View style={styles.formulaire}>
                <Text style={styles.formTitre}>{titreAjout}</Text>

                <Text style={styles.label}>Date</Text>
                <ChampDate valeur={date} onChange={setDate} />

                <Text style={styles.label}>{champ.label}</Text>
                {champ.options ? (
                  <View style={styles.options}>
                    {champ.options.map((o) => (
                      <TouchableOpacity
                        key={o}
                        style={[styles.option, valeurChamp === o && styles.optionActive]}
                        onPress={() => setValeurChamp(o)}
                      >
                        <Text
                          style={[
                            styles.optionTexte,
                            valeurChamp === o && styles.optionTexteActif,
                          ]}
                        >
                          {o}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <TextInput
                    style={styles.input}
                    placeholder={champ.placeholder}
                    value={valeurChamp}
                    onChangeText={setValeurChamp}
                  />
                )}

                <Text style={styles.label}>Montant (€)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  placeholder="Ex : 24.90"
                  value={montant}
                  onChangeText={setMontant}
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
                    <Text style={styles.validerTexte}>
                      {enregistrement ? '...' : 'Ajouter'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.ouvrirBtn}
                onPress={() => setFormulaireOuvert(true)}
              >
                <Text style={styles.ouvrirTexte}>+ {titreAjout}</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        ListEmptyComponent={<Text style={styles.vide}>Aucune ligne enregistrée.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.ligne} onLongPress={() => supprimer(item)}>
            <View style={styles.ligneGauche}>
              <Text style={styles.ligneTitre}>{item[champ.cle]}</Text>
              <Text style={styles.ligneDate}>
                {new Date(item.date).toLocaleDateString('fr-FR')}
              </Text>
              {item.commentaire ? (
                <Text style={styles.ligneCommentaire}>{item.commentaire}</Text>
              ) : null}
            </View>
            <Text style={styles.ligneMontant}>{formatEuros(item.montant)}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          lignes.length > 0 ? (
            <Text style={styles.astuce}>Appui long sur une ligne pour la supprimer.</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  resumeNote: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 4 },
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
  formTitre: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: '600', fontSize: 13 },
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
  ligneMontant: { fontSize: 16, fontWeight: 'bold', color: COULEURS.rouge },
  vide: { textAlign: 'center', color: COULEURS.texteDoux, padding: 20 },
  astuce: { textAlign: 'center', color: COULEURS.texteDoux, fontSize: 12, marginTop: 12 },
});
