import { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COULEURS } from '../lib/constants';

// Champ de date : on appuie dessus, le calendrier du téléphone s'ouvre.
// La valeur circule au format "AAAA-MM-JJ", celui attendu par la base.
export default function ChampDate({ valeur, onChange }) {
  const [ouvert, setOuvert] = useState(false);
  const dateObjet = valeur ? new Date(`${valeur}T12:00:00`) : new Date();

  function auChangement(event, choisie) {
    if (Platform.OS === 'android') setOuvert(false);
    if (event.type === 'dismissed' || !choisie) return;
    const iso = new Date(choisie.getTime() - choisie.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    onChange(iso);
  }

  return (
    <>
      <TouchableOpacity style={styles.champ} onPress={() => setOuvert(true)}>
        <Text style={styles.texte}>
          📅 {dateObjet.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </Text>
      </TouchableOpacity>
      {ouvert && (
        <DateTimePicker value={dateObjet} mode="date" display="default" onChange={auChangement} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  champ: {
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: 8,
    padding: 12,
  },
  texte: { fontSize: 15, color: COULEURS.texte },
});
