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
};

export function formatEuros(montant) {
  return `${Number(montant).toFixed(2).replace('.', ',')} €`;
}
