import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../lib/AuthContext';
import {
  chargerDonneesVendeur,
  calculerBilan,
  bilanAnnuel,
  anneesDisponibles,
  caParMois,
} from '../../lib/gestion';
import { COULEURS, formatEuros } from '../../lib/constants';
import { Kpi, KpiGrille } from '../../components/Kpi';

const MOIS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const PERIODES = [
  { value: 'tout', label: 'Tout' },
  { value: 'annee', label: 'Cette année' },
  { value: 'mois', label: 'Ce mois' },
];

function bornesPeriode(periode) {
  const maintenant = new Date();
  const annee = maintenant.getFullYear();
  if (periode === 'annee') return [`${annee}-01-01`, `${annee}-12-31`];
  if (periode === 'mois') {
    const mois = String(maintenant.getMonth() + 1).padStart(2, '0');
    return [`${annee}-${mois}-01`, `${annee}-${mois}-31`];
  }
  return [null, null];
}

export default function DashboardScreen() {
  const { session } = useAuth();
  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [periode, setPeriode] = useState('tout');
  const [refreshing, setRefreshing] = useState(false);

  const charger = useCallback(async () => {
    const d = await chargerDonneesVendeur(session.user.id);
    setErreur(d.erreur ?? null);
    setDonnees(d);
    setRefreshing(false);
  }, [session.user.id]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  const [debut, fin] = bornesPeriode(periode);
  const bilan = useMemo(() => (donnees ? calculerBilan(donnees, debut, fin) : null), [donnees, debut, fin]);
  const annuel = useMemo(() => (donnees ? bilanAnnuel(donnees) : []), [donnees]);
  const anneeCourante = new Date().getFullYear();
  const mensuel = useMemo(
    () => (donnees ? caParMois(donnees, anneeCourante) : []),
    [donnees, anneeCourante]
  );
  const maxMois = Math.max(...mensuel, 1);

  const stockTotal = useMemo(
    () =>
      donnees
        ? donnees.produits
            .filter((p) => p.statut !== 'retire')
            .reduce((s, p) => s + Number(p.quantite_disponible) * Number(p.prix), 0)
        : 0,
    [donnees]
  );

  if (!donnees) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COULEURS.vert} />
      </View>
    );
  }

  if (erreur) {
    return (
      <ScrollView contentContainerStyle={styles.center}>
        <Text style={styles.erreurTitre}>Base de données incomplète</Text>
        <Text style={styles.erreurTexte}>
          Exécute le script <Text style={styles.code}>supabase/03-gestion-vendeur.sql</Text> dans
          Supabase (SQL Editor) pour activer coûts, consommation, investissements et ventes directes.
        </Text>
        <Text style={styles.erreurDetail}>{erreur.message}</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            charger();
          }}
        />
      }
    >
      <View style={styles.periodes}>
        {PERIODES.map((p) => (
          <TouchableOpacity
            key={p.value}
            style={[styles.periode, periode === p.value && styles.periodeActive]}
            onPress={() => setPeriode(p.value)}
          >
            <Text style={[styles.periodeTexte, periode === p.value && styles.periodeTexteActif]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.section}>Activité</Text>
      <KpiGrille>
        <Kpi label="Chiffre d'affaires" valeur={formatEuros(bilan.ca)} couleur={COULEURS.vert} />
        <Kpi label="Ventes" valeur={String(bilan.nbVentes)} aide={`${bilan.quantiteVendue} article(s)`} />
        <Kpi label="Coûts" valeur={formatEuros(bilan.couts)} couleur={COULEURS.rouge} />
        <Kpi
          label="Bénéfice"
          valeur={formatEuros(bilan.benefice)}
          couleur={bilan.benefice >= 0 ? COULEURS.vert : COULEURS.rouge}
          aide="ventes − coûts"
        />
      </KpiGrille>

      <Text style={styles.section}>Rentabilité</Text>
      <Text style={styles.sectionAide}>valeur créée = ventes + économies − coûts</Text>
      <KpiGrille>
        <Kpi
          label="Économies (conso perso)"
          valeur={formatEuros(bilan.economies)}
          couleur={COULEURS.vert}
        />
        <Kpi label="Investissements" valeur={formatEuros(bilan.investissements)} />
        <Kpi
          label="Valeur créée"
          valeur={formatEuros(bilan.valeurCreee)}
          couleur={bilan.valeurCreee >= 0 ? COULEURS.vert : COULEURS.rouge}
        />
        <Kpi
          label="Solde"
          valeur={formatEuros(bilan.solde)}
          couleur={bilan.solde >= 0 ? COULEURS.vert : COULEURS.rouge}
          aide="valeur créée − investissements"
        />
        <Kpi
          label="Rentabilité"
          valeur={bilan.rentabilite == null ? '—' : `${Math.round(bilan.rentabilite)} %`}
          aide="valeur créée / investissements"
        />
        <Kpi label="Valeur du stock" valeur={formatEuros(stockTotal)} />
      </KpiGrille>

      <Text style={styles.section}>Chiffre d'affaires {anneeCourante}</Text>
      <View style={styles.graphique}>
        {mensuel.map((valeur, i) => (
          <View key={i} style={styles.barreColonne}>
            <View style={styles.barreZone}>
              <View style={[styles.barre, { height: `${(valeur / maxMois) * 100}%` }]} />
            </View>
            <Text style={styles.barreLabel}>{MOIS[i]}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.graphiqueAide}>
        Plus haute barre : {formatEuros(maxMois)}
      </Text>

      <Text style={styles.section}>Bilan annuel</Text>
      {annuel.length === 0 ? (
        <Text style={styles.vide}>Pas encore de données.</Text>
      ) : (
        <View style={styles.tableau}>
          <View style={[styles.tLigne, styles.tEntete]}>
            <Text style={[styles.tCell, styles.tCellAnnee, styles.tEnteteTexte]}>Année</Text>
            <Text style={[styles.tCell, styles.tEnteteTexte]}>CA</Text>
            <Text style={[styles.tCell, styles.tEnteteTexte]}>Coûts</Text>
            <Text style={[styles.tCell, styles.tEnteteTexte]}>Valeur</Text>
            <Text style={[styles.tCell, styles.tEnteteTexte]}>Cumul</Text>
          </View>
          {annuel.map((ligne) => (
            <View key={ligne.annee} style={styles.tLigne}>
              <Text style={[styles.tCell, styles.tCellAnnee]}>{ligne.annee}</Text>
              <Text style={styles.tCell}>{formatEuros(ligne.ca)}</Text>
              <Text style={styles.tCell}>{formatEuros(ligne.couts)}</Text>
              <Text
                style={[styles.tCell, { color: ligne.valeurCreee >= 0 ? COULEURS.vert : COULEURS.rouge }]}
              >
                {formatEuros(ligne.valeurCreee)}
              </Text>
              <Text
                style={[styles.tCell, { color: ligne.soldeCumule >= 0 ? COULEURS.vert : COULEURS.rouge }]}
              >
                {formatEuros(ligne.soldeCumule)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  erreurTitre: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  erreurTexte: { textAlign: 'center', color: COULEURS.texteDoux, lineHeight: 20 },
  code: { fontWeight: 'bold', color: COULEURS.texte },
  erreurDetail: { marginTop: 16, fontSize: 11, color: COULEURS.texteDoux, textAlign: 'center' },
  periodes: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  periode: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COULEURS.fondDoux,
    alignItems: 'center',
  },
  periodeActive: { backgroundColor: COULEURS.vert },
  periodeTexte: { fontSize: 13, color: COULEURS.texte },
  periodeTexteActif: { color: '#fff', fontWeight: '600' },
  section: { fontSize: 16, fontWeight: 'bold', marginTop: 24, marginBottom: 4 },
  sectionAide: { fontSize: 12, color: COULEURS.texteDoux, marginBottom: 10 },
  graphique: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 130,
    gap: 4,
    marginTop: 8,
  },
  barreColonne: { flex: 1, alignItems: 'center' },
  barreZone: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  barre: { width: '100%', backgroundColor: COULEURS.vert, borderRadius: 3, minHeight: 2 },
  barreLabel: { fontSize: 10, color: COULEURS.texteDoux, marginTop: 4 },
  graphiqueAide: { fontSize: 11, color: COULEURS.texteDoux, marginTop: 6 },
  tableau: { borderWidth: 1, borderColor: COULEURS.bord, borderRadius: 8, overflow: 'hidden' },
  tLigne: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COULEURS.bord },
  tEntete: { backgroundColor: COULEURS.fondDoux },
  tEnteteTexte: { fontWeight: 'bold', color: COULEURS.texte },
  tCell: { flex: 1, padding: 8, fontSize: 11, textAlign: 'right', color: COULEURS.texte },
  tCellAnnee: { flex: 0.7, textAlign: 'left', fontWeight: '600' },
  vide: { color: COULEURS.texteDoux, paddingVertical: 12 },
});
