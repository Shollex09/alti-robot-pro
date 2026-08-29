import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COULEURS, OMBRE, RAYON, categorieLabel, formatEuros } from '../lib/constants';
import { formatDistance } from '../lib/geo';
import Icone from './Icone';

// Carte d'annonce : la photo occupe la place, le nom en vert, la
// description courte en dessous, le prix aligné à droite.
export default function CarteProduit({ produit, distance, vendeurPrenom, onPress, style }) {
  const epuise = produit.statut !== 'disponible' || produit.quantite_disponible <= 0;

  return (
    <TouchableOpacity style={[styles.carte, style]} onPress={onPress} activeOpacity={0.85}>
      {produit.photo_url ? (
        <Image source={{ uri: produit.photo_url }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.photoVide]}>
          <Icone nom="camera" taille={22} couleur={COULEURS.vert} />
        </View>
      )}

      <View style={styles.infos}>
        <View style={styles.hautLigne}>
          <Text style={styles.nom} numberOfLines={1}>
            {produit.nom}
          </Text>
          <Text style={styles.prix}>{formatEuros(produit.prix)}</Text>
        </View>

        {produit.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {produit.description}
          </Text>
        ) : (
          <Text style={styles.description}>{categorieLabel(produit.categorie)}</Text>
        )}

        <View style={styles.basLigne}>
          <View style={styles.etiquette}>
            <Text style={styles.etiquetteTexte}>{categorieLabel(produit.categorie)}</Text>
          </View>
          {epuise ? (
            <View style={[styles.etiquette, styles.etiquetteEpuise]}>
              <Text style={[styles.etiquetteTexte, styles.etiquetteTexteEpuise]}>Épuisé</Text>
            </View>
          ) : null}
          {vendeurPrenom || distance != null ? (
            <Text style={styles.meta} numberOfLines={1}>
              {[vendeurPrenom, distance != null ? formatDistance(distance) : null]
                .filter(Boolean)
                .join(' · ')}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  carte: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: RAYON.carte,
    overflow: 'hidden',
    ...OMBRE,
  },
  photo: { width: 108, height: 108 },
  photoVide: { backgroundColor: COULEURS.vertClair, justifyContent: 'center', alignItems: 'center' },
  infos: { flex: 1, padding: 13, justifyContent: 'center' },
  hautLigne: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  nom: { flex: 1, fontSize: 16, fontWeight: '700', color: COULEURS.vertProfond },
  prix: { fontSize: 15, fontWeight: '700', color: COULEURS.encre },
  description: { fontSize: 12.5, color: COULEURS.texteDoux, marginTop: 3 },
  basLigne: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 9 },
  etiquette: {
    backgroundColor: COULEURS.vertClair,
    borderRadius: RAYON.pilule,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  etiquetteEpuise: { backgroundColor: '#fdecea' },
  etiquetteTexte: { fontSize: 11, fontWeight: '600', color: COULEURS.vertProfond },
  etiquetteTexteEpuise: { color: COULEURS.rouge },
  meta: { flex: 1, fontSize: 11, color: COULEURS.texteDoux, textAlign: 'right' },
});
