import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COULEURS, formatTypeProduction } from '../lib/constants';
import { formatDistance } from '../lib/geo';

function initiale(prenom) {
  return prenom?.[0]?.toUpperCase() ?? '?';
}

function moisAnnee(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// En-tête de fiche profil : bannière, photo ronde qui déborde dessus,
// nom, badge de rôle, secteur, puis une carte de statistiques.
export default function EnteteProfil({
  profil,
  distance,
  secteurTexte,
  nbMisesEnRelation,
  enfant,
}) {
  const estVendeur = profil.role === 'vendeur';
  const production = formatTypeProduction(profil.type_production);

  return (
    <View>
      <View style={styles.banniereZone}>
        <LinearGradient
          colors={estVendeur ? ['#9dc88d', '#cfe3c4'] : ['#a8c0d8', '#d3e0ec']}
          style={styles.banniere}
        />
        <View style={styles.avatarCadre}>
          {profil.photo_url ? (
            <Image source={{ uri: profil.photo_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarVide]}>
              <Text style={styles.avatarInitiale}>{initiale(profil.prenom)}</Text>
            </View>
          )}
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeTexte}>{estVendeur ? 'Producteur' : 'Acheteur'}</Text>
        </View>
      </View>

      <View style={styles.identite}>
        <Text style={styles.prenom}>{profil.prenom}</Text>
        {production ? <Text style={styles.metier}>{production}</Text> : null}
        <Text style={styles.secteur}>
          📍{' '}
          {secteurTexte ??
            (distance == null ? 'Secteur non renseigné' : `Secteur à ${formatDistance(distance)}`)}
        </Text>
        <Text style={styles.confidentialite}>L'adresse exacte n'est jamais partagée.</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValeur}>{moisAnnee(profil.created_at) ?? '—'}</Text>
          <Text style={styles.statLabel}>date d'inscription</Text>
        </View>
        <View style={styles.separateur} />
        <View style={styles.stat}>
          <Text style={styles.statValeur}>{nbMisesEnRelation ?? 0}</Text>
          <Text style={styles.statLabel}>
            {estVendeur ? 'ventes réalisées' : 'achats effectués'}
          </Text>
        </View>
      </View>

      {profil.description ? (
        <View style={styles.carte}>
          <Text style={styles.carteTitre}>Présentation</Text>
          <Text style={styles.description}>{profil.description}</Text>
        </View>
      ) : null}

      {enfant}
    </View>
  );
}

const styles = StyleSheet.create({
  banniereZone: { marginBottom: 52 },
  banniere: { height: 120 },
  avatarCadre: {
    position: 'absolute',
    left: 20,
    bottom: -46,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 55,
  },
  avatar: { width: 92, height: 92, borderRadius: 46 },
  avatarVide: { backgroundColor: COULEURS.vertClair, justifyContent: 'center', alignItems: 'center' },
  avatarInitiale: { fontSize: 38, fontWeight: 'bold', color: COULEURS.vert },
  badge: {
    position: 'absolute',
    right: 16,
    bottom: 12,
    backgroundColor: '#f3e6ff',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  badgeTexte: { fontSize: 12, fontWeight: '600', color: '#6a1b9a' },
  identite: { paddingHorizontal: 20 },
  prenom: { fontSize: 22, fontWeight: 'bold', color: COULEURS.encre },
  metier: { fontSize: 14, color: COULEURS.texteDoux, marginTop: 3 },
  secteur: { fontSize: 14, color: COULEURS.texteDoux, marginTop: 6 },
  confidentialite: { fontSize: 11, color: '#9aa5b1', marginTop: 4 },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: COULEURS.bord,
  },
  stat: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  statValeur: { fontSize: 14, fontWeight: '600', color: COULEURS.encre, textAlign: 'center' },
  statLabel: { fontSize: 11, color: COULEURS.texteDoux, marginTop: 3, textAlign: 'center' },
  separateur: { width: 1, height: 34, backgroundColor: COULEURS.bord },
  carte: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COULEURS.bord,
  },
  carteTitre: { fontSize: 13, fontWeight: 'bold', color: COULEURS.encre, marginBottom: 8 },
  description: { fontSize: 14, color: COULEURS.texte, lineHeight: 21 },
});
