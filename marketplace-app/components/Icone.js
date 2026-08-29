import { Feather } from '@expo/vector-icons';
import { COULEURS } from '../lib/constants';

// Toutes les icônes passent par ici : changer de jeu d'icônes plus tard
// ne touchera qu'à ce fichier, pas aux vingt écrans qui les utilisent.
const NOMS = {
  decouvrir: 'compass',
  achats: 'shopping-bag',
  favoris: 'star',
  favoriPlein: 'star',
  messages: 'message-circle',
  vendre: 'package',
  profil: 'user',
  reglages: 'settings',
  bilan: 'bar-chart-2',
  annonces: 'tag',
  stock: 'box',
  ventes: 'trending-up',
  clients: 'users',
  gestion: 'more-horizontal',
  couts: 'credit-card',
  consommation: 'home',
  investissements: 'tool',
  export: 'download',
  position: 'map-pin',
  photo: 'camera',
  envoyer: 'send',
  ajouter: 'plus',
  retirer: 'x',
  signaler: 'flag',
  deconnexion: 'log-out',
  supprimer: 'trash-2',
  fleche: 'chevron-right',
  retour: 'chevron-left',
  reseau: 'wifi-off',
  alerte: 'alert-triangle',
  panier: 'shopping-cart',
  valider: 'check',
};

export default function Icone({ nom, taille = 20, couleur = COULEURS.texte, style }) {
  return <Feather name={NOMS[nom] ?? nom} size={taille} color={couleur} style={style} />;
}
