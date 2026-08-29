import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { COULEURS } from '../lib/constants';

const MOTIFS = [
  'Produit interdit à la vente',
  'Photo ou description trompeuse',
  'Prix abusif',
  'Annonce en double',
  'Contenu inapproprié',
  'Autre',
];

export default function BoutonSignaler({ productId = null, profilId = null }) {
  const { session } = useAuth();
  const [ouvert, setOuvert] = useState(false);
  const [motif, setMotif] = useState(MOTIFS[0]);
  const [details, setDetails] = useState('');
  const [envoi, setEnvoi] = useState(false);

  async function envoyer() {
    setEnvoi(true);
    const { error } = await supabase.from('signalements').insert({
      auteur_id: session.user.id,
      product_id: productId,
      profil_signale_id: profilId,
      motif,
      details: details.trim() || null,
    });
    setEnvoi(false);

    if (error) {
      // Un doublon signifie que ce signalement a déjà été envoyé.
      const dejaSignale = /duplicate key|unicite/i.test(error.message);
      Alert.alert(
        dejaSignale ? 'Déjà signalé' : 'Signalement impossible',
        dejaSignale ? 'Tu as déjà signalé cette annonce.' : error.message
      );
      if (dejaSignale) setOuvert(false);
      return;
    }

    setOuvert(false);
    setDetails('');
    Alert.alert('Merci', 'Ton signalement a bien été transmis. Nous allons le regarder.');
  }

  return (
    <>
      <TouchableOpacity onPress={() => setOuvert(true)}>
        <Text style={styles.lien}>⚑ Signaler cette annonce</Text>
      </TouchableOpacity>

      <Modal visible={ouvert} transparent animationType="fade" onRequestClose={() => setOuvert(false)}>
        <View style={styles.fond}>
          <View style={styles.boite}>
            <Text style={styles.titre}>Signaler</Text>
            <Text style={styles.aide}>Pourquoi signales-tu cette annonce ?</Text>

            <View style={styles.motifs}>
              {MOTIFS.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.motif, motif === m && styles.motifActif]}
                  onPress={() => setMotif(m)}
                >
                  <Text style={[styles.motifTexte, motif === m && styles.motifTexteActif]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.champ}
              placeholder="Précisions (facultatif)"
              value={details}
              onChangeText={setDetails}
              multiline
            />

            <View style={styles.actions}>
              <TouchableOpacity style={styles.annuler} onPress={() => setOuvert(false)}>
                <Text style={styles.annulerTexte}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.valider} onPress={envoyer} disabled={envoi}>
                <Text style={styles.validerTexte}>{envoi ? '...' : 'Envoyer'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  lien: { color: COULEURS.texteDoux, fontSize: 12, textAlign: 'center', marginTop: 24 },
  fond: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 20 },
  boite: { backgroundColor: '#fff', borderRadius: 14, padding: 20 },
  titre: { fontSize: 18, fontWeight: 'bold', color: COULEURS.encre },
  aide: { fontSize: 13, color: COULEURS.texteDoux, marginTop: 4, marginBottom: 14 },
  motifs: { gap: 6 },
  motif: { padding: 11, borderRadius: 8, backgroundColor: COULEURS.fondDoux },
  motifActif: { backgroundColor: COULEURS.vertClair, borderWidth: 1, borderColor: COULEURS.vert },
  motifTexte: { fontSize: 13, color: COULEURS.texte },
  motifTexteActif: { color: COULEURS.vert, fontWeight: '600' },
  champ: {
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: 8,
    padding: 10,
    marginTop: 14,
    minHeight: 64,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  annuler: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COULEURS.bord,
    alignItems: 'center',
  },
  annulerTexte: { color: COULEURS.texteDoux, fontWeight: '600' },
  valider: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COULEURS.rouge,
    alignItems: 'center',
  },
  validerTexte: { color: '#fff', fontWeight: 'bold' },
});
