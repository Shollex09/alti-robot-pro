import { View, Text, StyleSheet } from 'react-native';
import { COULEURS } from '../lib/constants';

export function Kpi({ label, valeur, couleur, aide }) {
  return (
    <View style={styles.kpi}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.valeur, couleur ? { color: couleur } : null]}>{valeur}</Text>
      {aide ? <Text style={styles.aide}>{aide}</Text> : null}
    </View>
  );
}

export function KpiGrille({ children }) {
  return <View style={styles.grille}>{children}</View>;
}

const styles = StyleSheet.create({
  grille: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpi: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: COULEURS.fondDoux,
    borderRadius: 12,
    padding: 14,
  },
  label: { fontSize: 12, color: COULEURS.texteDoux },
  valeur: { fontSize: 20, fontWeight: 'bold', color: COULEURS.texte, marginTop: 4 },
  aide: { fontSize: 11, color: COULEURS.texteDoux, marginTop: 2 },
});
