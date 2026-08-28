import { supabase } from './supabase';

export const CATEGORIES_COUTS = [
  'Semences / plants',
  'Nourriture animale',
  'Vétérinaire',
  'Terreau / engrais',
  'Matériel',
  'Eau / Électricité',
  'Carburant',
  'Emballage',
  'Autre',
];

// Récupère en une fois tout ce qui sert aux calculs de l'espace vendeur.
export async function chargerDonneesVendeur(vendeurId) {
  const [produits, commandes, ventesDirectes, couts, consommations, investissements, reappros] =
    await Promise.all([
      supabase.from('products').select('*').eq('vendeur_id', vendeurId),
      supabase
        .from('orders')
        .select('*, product:products(nom), acheteur:profiles!orders_acheteur_id_fkey(id, prenom)')
        .eq('vendeur_id', vendeurId),
      supabase
        .from('ventes_directes')
        .select('*, product:products(nom)')
        .eq('vendeur_id', vendeurId),
      supabase.from('couts').select('*').eq('vendeur_id', vendeurId),
      supabase
        .from('consommations')
        .select('*, product:products(nom)')
        .eq('vendeur_id', vendeurId),
      supabase.from('investissements').select('*').eq('vendeur_id', vendeurId),
      supabase
        .from('reapprovisionnements')
        .select('*, product:products(nom)')
        .eq('vendeur_id', vendeurId),
    ]);

  return {
    produits: produits.data ?? [],
    commandes: commandes.data ?? [],
    ventesDirectes: ventesDirectes.data ?? [],
    couts: couts.data ?? [],
    consommations: consommations.data ?? [],
    investissements: investissements.data ?? [],
    reappros: reappros.data ?? [],
    // Une table absente signifie que le script 03 n'a pas encore été exécuté.
    erreur: [produits, commandes, ventesDirectes, couts, consommations, investissements, reappros]
      .map((r) => r.error)
      .find(Boolean),
  };
}

// Les commandes de l'appli et les ventes en direct forment un seul flux de ventes.
export function toutesLesVentes(donnees) {
  const depuisCommandes = donnees.commandes
    .filter((c) => c.statut !== 'annulee')
    .map((c) => ({
      id: c.id,
      source: 'appli',
      date: c.created_at.slice(0, 10),
      client: c.acheteur?.prenom ?? 'Inconnu',
      clientId: c.acheteur_id,
      produit: c.product?.nom ?? 'Produit supprimé',
      quantite: Number(c.quantite),
      total: Number(c.prix_total),
      statut: c.statut,
    }));

  const depuisDirect = donnees.ventesDirectes.map((v) => ({
    id: v.id,
    source: 'directe',
    date: v.date,
    client: v.client_nom,
    clientId: `direct:${v.client_nom.trim().toLowerCase()}`,
    produit: v.product?.nom ?? 'Produit supprimé',
    quantite: Number(v.quantite),
    total: Number(v.quantite) * Number(v.prix_unitaire),
    commentaire: v.commentaire,
  }));

  return [...depuisCommandes, ...depuisDirect].sort((a, b) => b.date.localeCompare(a.date));
}

export function economieConsommation(c) {
  return Number(c.quantite) * Number(c.prix_estime);
}

function dansPeriode(date, debut, fin) {
  return (!debut || date >= debut) && (!fin || date <= fin);
}

// Mêmes formules que le poulailler :
//   bénéfice     = ventes − coûts
//   valeur créée = ventes + économies − coûts
//   solde        = valeur créée − investissements
export function calculerBilan(donnees, debut = null, fin = null) {
  const ventes = toutesLesVentes(donnees).filter((v) => dansPeriode(v.date, debut, fin));
  const ca = ventes.reduce((s, v) => s + v.total, 0);
  const quantiteVendue = ventes.reduce((s, v) => s + v.quantite, 0);

  const couts = donnees.couts
    .filter((c) => dansPeriode(c.date, debut, fin))
    .reduce((s, c) => s + Number(c.montant), 0);

  const economies = donnees.consommations
    .filter((c) => dansPeriode(c.date, debut, fin))
    .reduce((s, c) => s + economieConsommation(c), 0);

  const investissements = donnees.investissements
    .filter((i) => dansPeriode(i.date, debut, fin))
    .reduce((s, i) => s + Number(i.montant), 0);

  const benefice = ca - couts;
  const valeurCreee = ca + economies - couts;
  const solde = valeurCreee - investissements;
  const rentabilite = investissements > 0 ? (valeurCreee / investissements) * 100 : null;

  return {
    ca,
    quantiteVendue,
    nbVentes: ventes.length,
    couts,
    economies,
    investissements,
    benefice,
    valeurCreee,
    solde,
    rentabilite,
  };
}

export function anneesDisponibles(donnees) {
  const dates = [
    ...toutesLesVentes(donnees).map((v) => v.date),
    ...donnees.couts.map((c) => c.date),
    ...donnees.consommations.map((c) => c.date),
    ...donnees.investissements.map((i) => i.date),
  ].filter(Boolean);
  return [...new Set(dates.map((d) => Number(d.slice(0, 4))))].sort((a, b) => a - b);
}

// Bilan année par année, avec le solde qui se cumule d'une année sur l'autre.
export function bilanAnnuel(donnees) {
  let cumule = 0;
  const lignes = anneesDisponibles(donnees).map((annee) => {
    const bilan = calculerBilan(donnees, `${annee}-01-01`, `${annee}-12-31`);
    cumule += bilan.solde;
    return { annee, ...bilan, soldeCumule: cumule };
  });
  return lignes.reverse();
}

// Classement des clients, toutes ventes confondues (appli + direct).
export function classementClients(donnees) {
  const parClient = new Map();
  for (const vente of toutesLesVentes(donnees)) {
    const actuel = parClient.get(vente.clientId) ?? {
      id: vente.clientId,
      nom: vente.client,
      source: vente.source,
      nbAchats: 0,
      quantite: 0,
      total: 0,
      derniere: null,
    };
    actuel.nbAchats += 1;
    actuel.quantite += vente.quantite;
    actuel.total += vente.total;
    if (!actuel.derniere || vente.date > actuel.derniere) actuel.derniere = vente.date;
    parClient.set(vente.clientId, actuel);
  }
  return [...parClient.values()].sort((a, b) => b.total - a.total);
}

// Chiffre d'affaires mois par mois, pour l'année demandée.
export function caParMois(donnees, annee) {
  const mois = Array.from({ length: 12 }, () => 0);
  for (const vente of toutesLesVentes(donnees)) {
    if (Number(vente.date.slice(0, 4)) !== annee) continue;
    mois[Number(vente.date.slice(5, 7)) - 1] += vente.total;
  }
  return mois;
}
