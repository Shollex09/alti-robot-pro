import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { COULEURS, categorieLabel, formatEuros } from '../../lib/constants';

export default function StockScreen() {
  const { session } = useAuth();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [produitReappro, setProduitReappro] = useState(null);
  const [quantiteAjout, setQuantiteAjout] = useState('');
  const [enregistrement, setEnregistrement] = useState(false);

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

  async function reapprovisionner() {
    const quantiteNum = Number(quantiteAjout.replace(',', '.'));
    if (!Number.isFinite(quantiteNum) || quantiteNum <= 0) {
      Alert.alert('Quantité invalide', 'Indique une quantité positive.');
      return;
    }
    setEnregistrement(true);
    const { error } = await supabase.from('reapprovisionnements').insert({
      vendeur_id: session.user.id,
      product_id: produitReappro.id,
      quantite: quantiteNum,
    });
    setEnregistrement(false);
    if (error) {
      Alert.alert('Erreur', error.message);
      return;
    }
    setProduitReappro(null);
    setQuantiteAjout('');
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
        ListHeaderComponent={
          <View style={styles.resume}>
            <Text style={styles.resumeLabel}>Valeur totale du stock</Text>
            <Text style={styles.resumeValeur}>{formatEuros(valeurTotale)}</Text>
            <Text style={styles.resumeNote}>
              Le stock baisse tout seul à chaque vente ou consommation, et remonte quand tu
              réapprovisionnes.
            </Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.vide}>Aucun produit en stock.</Text>}
        renderItem={({ item }) => {
          const alerte = item.quantite_disponible <= 0;
          const faible = !alerte && item.quantite_disponible <= 3;
          return (
            <View style={styles.ligne}>
              <View style={styles.ligneGauche}>
                <Text style={styles.nom}>{item.nom}</Text>
                <Text style={styles.categorie}>{categorieLabel(item.categorie)}</Text>
              </View>
              <View style={styles.ligneMilieu}>
                <Text
                  style={[
                    styles.quantite,
                    faible && styles.quantiteFaible,
                    alerte && styles.quantiteAlerte,
                  ]}
                >
                  {item.quantite_disponible}
                </Text>
                <Text style={styles.valeur}>
                  {formatEuros(item.quantite_disponible * item.prix)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.ajoutBtn}
                onPress={() => {
                  setProduitReappro(item);
                  setQuantiteAjout('');
                }}
              >
                <Text style={styles.ajoutTexte}>+</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <Modal
        visible={!!produitReappro}
        transparent
        animationType="fade"
        onRequestClose={() => setProduitReappro(null)}
      >
        <View style={styles.modalFond}>
          <View style={styles.modalBoite}>
            <Text style={styles.modalTitre}>Réapprovisionner</Text>
            <Text style={styles.modalProduit}>{produitReappro?.nom}</Text>
            <Text style={styles.modalAide}>
              Stock actuel : {produitReappro?.quantite_disponible}
            </Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              placeholder="Quantité à ajouter"
              value={quantiteAjout}
              onChangeText={setQuantiteAjout}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.annulerBtn}
                onPress={() => setProduitReappro(null)}
              >
                <Text style={styles.annulerTexte}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.validerBtn}
                onPress={reapprovisionner}
                disabled={enregistrement}
              >
                <Text style={styles.validerTexte}>{enregistrement ? '...' : 'Ajouter'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COULEURS.bord,
    gap: 12,
  },
  ligneGauche: { flex: 1 },
  ligneMilieu: { alignItems: 'flex-end' },
  nom: { fontSize: 15, fontWeight: '600' },
  categorie: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 2 },
  quantite: { fontSize: 18, fontWeight: 'bold', color: COULEURS.vert },
  quantiteFaible: { color: '#ef6c00' },
  quantiteAlerte: { color: COULEURS.rouge },
  valeur: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 2 },
  ajoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COULEURS.vert,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ajoutTexte: { color: '#fff', fontSize: 24, fontWeight: 'bold', lineHeight: 28 },
  vide: { textAlign: 'center', color: COULEURS.texteDoux, padding: 20 },
  modalFond: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modalBoite: { backgroundColor: '#fff', borderRadius: 14, padding: 20 },
  modalTitre: { fontSize: 18, fontWeight: 'bold' },
  modalProduit: { fontSize: 15, marginTop: 6 },
  modalAide: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 4, marginBottom: 14 },
  modalInput: {
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 18 },
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
});
