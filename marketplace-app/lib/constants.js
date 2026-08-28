export const CATEGORIES = [
  { value: 'legume', label: 'Légume', emoji: '🥕' },
  { value: 'fruit', label: 'Fruit', emoji: '🍎' },
  { value: 'oeuf', label: 'Œuf', emoji: '🥚' },
  { value: 'autre', label: 'Autre', emoji: '🌿' },
];

export function categorieLabel(value) {
  const c = CATEGORIES.find((c) => c.value === value);
  return c ? `${c.emoji} ${c.label}` : value;
}

// Le type de production est stocké en texte : "legume,oeuf".
export function parseTypeProduction(valeur) {
  if (!valeur) return [];
  return valeur
    .split(',')
    .map((v) => v.trim())
    .filter((v) => CATEGORIES.some((c) => c.value === v));
}

export function formatTypeProduction(valeur) {
  const choisies = parseTypeProduction(valeur);
  if (choisies.length > 0) return choisies.map(categorieLabel).join(' · ');
  // Ancien format libre saisi à la main : on l'affiche tel quel.
  return valeur || null;
}

export const COULEURS = {
  vert: '#2e7d32',
  vertClair: '#e8f5e9',
  bleu: '#1565c0',
  rouge: '#c62828',
  texte: '#1a1a1a',
  texteDoux: '#666',
  bord: '#e0e0e0',
  fond: '#fff',
  fondDoux: '#f7f7f7',
  // Fond bleuté des pages de profil, dans l'esprit d'AlloVoisins
  fondProfil: '#f2f7fd',
  encre: '#16283c',
};

export function formatEuros(montant) {
  return `${Number(montant).toFixed(2).replace('.', ',')} €`;
}
