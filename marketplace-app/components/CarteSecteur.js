import { View, Text, StyleSheet } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import { COULEURS } from '../lib/constants';

// Rayon du cercle affiché, en mètres. La position enregistrée est déjà
// arrondie au centième de degré (~1 km) : le cercle couvre largement cette
// imprécision, pour montrer un secteur et jamais une adresse.
const RAYON_SECTEUR_M = 1800;

export default function CarteSecteur({ latitude, longitude, titre = 'Secteur' }) {
  if (latitude == null || longitude == null) return null;

  return (
    <View style={styles.carte}>
      <Text style={styles.titre}>{titre}</Text>
      <View style={styles.cadre}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.09,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          toolbarEnabled={false}
        >
          <Circle
            center={{ latitude, longitude }}
            radius={RAYON_SECTEUR_M}
            strokeColor="rgba(46,125,50,0.6)"
            fillColor="rgba(46,125,50,0.18)"
            strokeWidth={2}
          />
        </MapView>
      </View>
      <Text style={styles.note}>
        Zone approximative : ni l'adresse ni le point exact ne sont partagés.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  carte: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COULEURS.bord,
  },
  titre: { fontSize: 13, fontWeight: 'bold', color: COULEURS.encre, marginBottom: 10 },
  cadre: { height: 180, borderRadius: 10, overflow: 'hidden' },
  map: { flex: 1 },
  note: { fontSize: 11, color: '#9aa5b1', marginTop: 8 },
});
