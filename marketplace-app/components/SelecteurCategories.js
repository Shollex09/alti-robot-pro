import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CATEGORIES, COULEURS } from '../lib/constants';

// Cases à cocher rondes : plusieurs catégories peuvent être sélectionnées.
export default function SelecteurCategories({ valeurs, onChange }) {
  function basculer(valeur) {
    onChange(
      valeurs.includes(valeur) ? valeurs.filter((v) => v !== valeur) : [...valeurs, valeur]
    );
  }

  return (
    <View style={styles.liste}>
      {CATEGORIES.map((c) => {
        const coche = valeurs.includes(c.value);
        return (
          <TouchableOpacity
            key={c.value}
            style={styles.ligne}
            onPress={() => basculer(c.value)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: coche }}
          >
            <View style={[styles.rond, coche && styles.rondCoche]}>
              {coche ? <Text style={styles.marque}>✓</Text> : null}
            </View>
            <Text style={styles.label}>
              {c.emoji} {c.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  liste: { gap: 4 },
  ligne: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  rond: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: COULEURS.bord,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rondCoche: { backgroundColor: COULEURS.vert, borderColor: COULEURS.vert },
  marque: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  label: { fontSize: 16, color: COULEURS.texte },
});
