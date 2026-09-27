import type { ChantierType, Devis, DevisLigne } from "../types";

export function ligneTotalHT(ligne: DevisLigne): number {
  return ligne.quantite * ligne.prixUnitaireHT;
}

export function ligneTotalTTC(ligne: DevisLigne): number {
  return ligneTotalHT(ligne) * (1 + ligne.tva / 100);
}

export function devisTotaux(devis: Devis): {
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
} {
  const totalHT = devis.lignes.reduce((sum, l) => sum + ligneTotalHT(l), 0);
  const totalTTC = devis.lignes.reduce((sum, l) => sum + ligneTotalTTC(l), 0);
  return { totalHT, totalTVA: totalTTC - totalHT, totalTTC };
}

export function formatEuros(montant: number): string {
  return montant.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
}

const CHANTIERS_ENTRETIEN: ChantierType[] = [
  "taille_haie",
  "elagage_abattage",
  "engazonnement",
  "debroussaillage",
  "entretien_annuel",
  "massifs_plantations",
];

/**
 * Suggestion de TVA par défaut : 10% pour l'entretien d'un logement de plus
 * de 2 ans, 20% pour la création/l'aménagement neuf. Reste modifiable par
 * ligne dans le devis.
 */
export function tvaSuggeree(chantierType: ChantierType): 10 | 20 {
  return CHANTIERS_ENTRETIEN.includes(chantierType) ? 10 : 20;
}
