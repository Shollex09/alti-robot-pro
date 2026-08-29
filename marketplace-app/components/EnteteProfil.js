import { View, Text, Image, StyleSheet } from 'react-native';
import { COULEURS, OMBRE, RAYON, parseTypeProduction, categorieLabel } from '../lib/constants';
import { formatDistance } from '../lib/geo';
import Icone from './Icone';

function initiale(prenom) {
  return prenom?.[0]?.toUpperCase() ?? '?';
}

function moisAnnee(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

// En-tête de fiche profil : photo de couverture, photo ronde qui déborde
// dessus, nom, ce que la personne produit, secteur, puis les repères de
// confiance (ancienneté, nombre de ventes).
export default function EnteteProfil({
  profil,
  distance,
  secteurTexte,
  nbMisesEnRelation,
  enfant,
}) {
  const estVendeur = profil.role === 'vendeur';
  const productions = parseTypeProduction(profil.type_production);

  return (
    <View>
      <View style={styles.banniereZone}>
        {profil.couverture_url ? (
          <Image source={{ uri: profil.couverture_url }} style={styles.banniere} />
        ) : (
          <View style={[styles.banniere, styles.banniereVide]} />
        )}
        <View style={styles.avatarCadre}>
          {profil.photo_url ? (
            <Image source={{ uri: profil.photo_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarVide]}>
              <Text style={styles.avatarInitiale}>{initiale(profil.prenom)}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.identite}>
        <Text style={styles.prenom}>{profil.prenom}</Text>
        <View style={styles.ligneSecteur}>
          <Icone nom="position" taille={14} couleur={COULEURS.texteDoux} />
          <Text style={styles.secteur}>
            {secteurTexte ??
              (distance == null ? 'Secteur non renseigné' : `À ${formatDistance(distance)}`)}
          </Text>
        </View>

        {estVendeur && productions.length > 0 ? (
          <View style={styles.etiquettes}>
            {productions.map((p) => (
              <View key={p} style={styles.etiquette}>
                <Text style={styles.etiquetteTexte}>{categorieLabel(p)}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValeur}>{moisAnnee(profil.created_at) ?? '—'}</Text>
          <Text style={styles.statLabel}>inscrit depuis</Text>
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
          <Text style={styles.description}>{profil.description}</Text>
        </View>
      ) : null}

      {enfant}
    </View>
  );
}

const styles = StyleSheet.create({
  banniereZone: { marginBottom: 50 },
  banniere: { height: 165, width: '100%' },
  banniereVide: { backgroundColor: COULEURS.vertClair },
  avatarCadre: {
    position: 'absolute',
    left: 20,
    bottom: -44,
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 52,
    ...OMBRE,
  },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  avatarVide: { backgroundColor: COULEURS.vertClair, justifyContent: 'center', alignItems: 'center' },
  avatarInitiale: { fontSize: 36, fontWeight: '700', color: COULEURS.vert },
  identite: { paddingHorizontal: 20 },
  prenom: { fontSize: 23, fontWeight: '700', color: COULEURS.encre, letterSpacing: -0.3 },
  ligneSecteur: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  secteur: { fontSize: 14, color: COULEURS.texteDoux },
  etiquettes: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  etiquette: {
    backgroundColor: COULEURS.vertClair,
    borderRadius: RAYON.pilule,
    paddingVertical: 5,
    paddingHorizontal: 11,
  },
  etiquetteTexte: { fontSize: 12, color: COULEURS.vertProfond, fontWeight: '600' },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: RAYON.carte,
    marginHorizontal: 16,
    marginTop: 18,
    paddingVertical: 16,
    ...OMBRE,
  },
  stat: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  statValeur: { fontSize: 14, fontWeight: '700', color: COULEURS.encre, textAlign: 'center' },
  statLabel: { fontSize: 11, color: COULEURS.texteDoux, marginTop: 3, textAlign: 'center' },
  separateur: { width: 1, height: 32, backgroundColor: COULEURS.bord },
  carte: {
    backgroundColor: '#fff',
    borderRadius: RAYON.carte,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 18,
    ...OMBRE,
  },
  description: { fontSize: 14, color: COULEURS.texte, lineHeight: 22 },
});
