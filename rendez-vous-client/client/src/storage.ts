import { TARIFS_PAR_DEFAUT, type PartieHistorique, type Tarifs } from "./types";

const TARIFS_KEY = "rdv-client:tarifs";
const HISTORIQUE_KEY = "rdv-client:historique";

export function loadTarifs(): Tarifs {
  try {
    const raw = localStorage.getItem(TARIFS_KEY);
    if (!raw) return TARIFS_PAR_DEFAUT;
    return { ...TARIFS_PAR_DEFAUT, ...JSON.parse(raw) };
  } catch {
    return TARIFS_PAR_DEFAUT;
  }
}

export function saveTarifs(tarifs: Tarifs): void {
  try {
    localStorage.setItem(TARIFS_KEY, JSON.stringify(tarifs));
  } catch {
    // stockage indisponible (navigation privée...) : on ignore silencieusement
  }
}

export function loadHistorique(): PartieHistorique[] {
  try {
    const raw = localStorage.getItem(HISTORIQUE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PartieHistorique[];
  } catch {
    return [];
  }
}

export function addToHistorique(partie: PartieHistorique): void {
  try {
    const historique = loadHistorique();
    historique.unshift(partie);
    localStorage.setItem(HISTORIQUE_KEY, JSON.stringify(historique.slice(0, 100)));
  } catch {
    // stockage indisponible : on ignore silencieusement
  }
}
