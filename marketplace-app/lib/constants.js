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

// Palette volontairement à l'écart du vert Material par défaut : un vert
// végétal plus chaud, beaucoup de blanc, et des gris légèrement verdis.
export const COULEURS = {
  vert: '#2f8f46',
  vertVif: '#43a047',
  vertClair: '#eaf5ec',
  vertProfond: '#1f5c30',
  bleu: '#1565c0',
  rouge: '#c0392b',
  ambre: '#e08b17',
  texte: '#1c2b21',
  texteDoux: '#6b7770',
  bord: '#e4eae5',
  fond: '#ffffff',
  fondDoux: '#f4f7f4',
  fondProfil: '#f7faf7',
  encre: '#1c2b21',
};

// Rayons et ombres partagés, pour que toutes les cartes se ressemblent.
export const RAYON = { carte: 16, petit: 10, pilule: 999 };

export const OMBRE = {
  shadowColor: '#1c2b21',
  shadowOpacity: 0.07,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
};

export function formatEuros(montant) {
  return `${Number(montant).toFixed(2).replace('.', ',')} €`;
}
