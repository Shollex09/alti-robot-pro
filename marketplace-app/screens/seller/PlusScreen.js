import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../../lib/AuthContext';
import {
  chargerDonneesVendeur,
  toutesLesVentes,
  economieConsommation,
} from '../../lib/gestion';
import { COULEURS } from '../../lib/constants';

const ENTREES = [
  { ecran: 'Clients', emoji: '👥', titre: 'Mes clients', aide: 'Classement automatique des acheteurs' },
  { ecran: 'Couts', emoji: '💸', titre: 'Coûts', aide: 'Semences, nourriture, matériel...' },
  {
    ecran: 'Consommation',
    emoji: '🏠',
    titre: 'Consommation personnelle',
    aide: 'Ce que tu gardes pour toi, valorisé en économies',
  },
  {
    ecran: 'Investissements',
    emoji: '🔧',
    titre: 'Investissements',
    aide: 'Serre, poulailler, outillage...',
  },
];

// Échappe une valeur pour le format CSV (guillemets doublés).
function champCsv(valeur) {
  const texte = valeur == null ? '' : String(valeur);
  return `"${texte.replace(/"/g, '""')}"`;
}

function versCsv(entetes, lignes) {
  return [entetes, ...lignes].map((l) => l.map(champCsv).join(';')).join('\n');
}

export default function PlusScreen({ navigation }) {
  const { session } = useAuth();
  const [exportEnCours, setExportEnCours] = useState(false);

  async function exporter() {
    setExportEnCours(true);
    try {
      const donnees = await chargerDonneesVendeur(session.user.id);
      if (donnees.erreur) throw donnees.erreur;

      const sections = [];

      sections.push('VENTES');
      sections.push(
        versCsv(
          ['Date', 'Produit', 'Client', 'Quantité', 'Total (€)', 'Origine'],
          toutesLesVentes(donnees).map((v) => [
            v.date,
            v.produit,
            v.client,
            v.quantite,
            v.total.toFixed(2),
            v.source === 'appli' ? 'Appli' : 'Direct',
          ])
        )
      );

      sections.push('\nCOÛTS');
      sections.push(
        versCsv(
          ['Date', 'Catégorie', 'Montant (€)', 'Commentaire'],
          donnees.couts.map((c) => [c.date, c.categorie, Number(c.montant).toFixed(2), c.commentaire])
        )
      );

      sections.push('\nCONSOMMATION PERSONNELLE');
      sections.push(
        versCsv(
          ['Date', 'Produit', 'Quantité', 'Prix estimé (€)', 'Économie (€)'],
          donnees.consommations.map((c) => [
            c.date,
            c.product?.nom ?? '',
            c.quantite,
            Number(c.prix_estime).toFixed(2),
            economieConsommation(c).toFixed(2),
          ])
        )
      );

      sections.push('\nINVESTISSEMENTS');
      sections.push(
        versCsv(
          ['Date', 'Libellé', 'Montant (€)', 'Commentaire'],
          donnees.investissements.map((i) => [
            i.date,
            i.libelle,
            Number(i.montant).toFixed(2),
            i.commentaire,
          ])
        )
      );

      sections.push('\nSTOCK');
      sections.push(
        versCsv(
          ['Produit', 'Catégorie', 'Quantité', 'Prix (€)', 'Valeur (€)', 'Statut'],
          donnees.produits.map((p) => [
            p.nom,
            p.categorie,
            p.quantite_disponible,
            Number(p.prix).toFixed(2),
            (p.quantite_disponible * p.prix).toFixed(2),
            p.statut,
          ])
        )
      );

      const contenu = sections.join('\n');
      const nom = `marketplace-jardin-${new Date().toISOString().slice(0, 10)}.csv`;
      const fichier = new FileSystem.File(FileSystem.Paths.cache, nom);
      fichier.create({ overwrite: true });
      fichier.write(contenu);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fichier.uri, {
          mimeType: 'text/csv',
          dialogTitle: 'Exporter mes données',
        });
      } else {
        Alert.alert('Export créé', `Fichier enregistré : ${nom}`);
      }
    } catch (e) {
      Alert.alert('Export impossible', e.message);
    } finally {
      setExportEnCours(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {ENTREES.map((e) => (
        <TouchableOpacity
          key={e.ecran}
          style={styles.entree}
          onPress={() => navigation.navigate(e.ecran)}
        >
          <Text style={styles.emoji}>{e.emoji}</Text>
          <View style={styles.entreeTexte}>
            <Text style={styles.entreeTitre}>{e.titre}</Text>
            <Text style={styles.entreeAide}>{e.aide}</Text>
          </View>
          <Text style={styles.fleche}>›</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.section}>Sauvegarde</Text>
      <TouchableOpacity style={styles.exportBtn} onPress={exporter} disabled={exportEnCours}>
        <Text style={styles.exportTexte}>
          {exportEnCours ? 'Préparation...' : '💾 Exporter mes données (CSV)'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.exportAide}>
        Un fichier tableur avec tes ventes, coûts, consommation, investissements et stock. Ouvrable
        dans Excel ou Google Sheets.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10, paddingBottom: 40 },
  entree: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: 12,
    padding: 16,
    gap: 14,
  },
  emoji: { fontSize: 24 },
  entreeTexte: { flex: 1 },
  entreeTitre: { fontSize: 15, fontWeight: '600' },
  entreeAide: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 2 },
  fleche: { fontSize: 24, color: COULEURS.texteDoux },
  section: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  exportBtn: {
    backgroundColor: COULEURS.bleu,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  exportTexte: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  exportAide: { fontSize: 12, color: COULEURS.texteDoux, lineHeight: 18 },
});
