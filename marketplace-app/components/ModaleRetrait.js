import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { COULEURS, RAYON } from '../lib/constants';

// Confirmer une commande sans dire où venir la chercher ne sert à rien.
// Le vendeur renseigne ici le lieu et le moment ; l'acheteur est le seul
// à les voir, et seulement une fois la commande acceptée.
export default function ModaleRetrait({ visible, commande, onAnnuler, onConfirmer }) {
  const { session } = useAuth();
  const [infos, setInfos] = useState('');
  const [envoi, setEnvoi] = useState(false);

  // On repropose ce qui a été saisi la dernière fois : le lieu change rarement.
  useEffect(() => {
    if (!visible) return;
    let actif = true;
    supabase
      .from('parametres_vendeur')
      .select('retrait_defaut')
      .eq('vendeur_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (actif) setInfos(data?.retrait_defaut ?? '');
      });
    return () => {
      actif = false;
    };
  }, [visible, session.user.id]);

  async function valider() {
    setEnvoi(true);
    const texte = infos.trim();
    if (texte) {
      await supabase
        .from('parametres_vendeur')
        .upsert({ vendeur_id: session.user.id, retrait_defaut: texte, updated_at: new Date() });
    }
    await onConfirmer(texte || null);
    setEnvoi(false);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onAnnuler}>
      <View style={styles.fond}>
        <View style={styles.boite}>
          <Text style={styles.titre}>Où venir chercher ?</Text>
          <Text style={styles.aide}>
            {commande?.acheteur?.prenom
              ? `${commande.acheteur.prenom} recevra ce message avec la confirmation.`
              : "L'acheteur recevra ce message avec la confirmation."}
          </Text>

          <TextInput
            style={styles.champ}
            placeholder={'Ex : 12 rue des Lilas à Bâgé-la-Ville,\nsamedi entre 9h et 12h. Sonner au portail.'}
            value={infos}
            onChangeText={setInfos}
            multiline
          />

          <Text style={styles.note}>
            Ces informations ne sont visibles que par cet acheteur, jamais publiquement.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.annuler} onPress={onAnnuler} disabled={envoi}>
              <Text style={styles.annulerTexte}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.valider} onPress={valider} disabled={envoi}>
              <Text style={styles.validerTexte}>{envoi ? '...' : 'Confirmer la commande'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fond: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 20 },
  boite: { backgroundColor: '#fff', borderRadius: RAYON.carte, padding: 20 },
  titre: { fontSize: 18, fontWeight: '700', color: COULEURS.encre },
  aide: { fontSize: 13, color: COULEURS.texteDoux, marginTop: 4, marginBottom: 14 },
  champ: {
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: RAYON.petit,
    padding: 12,
    minHeight: 96,
    textAlignVertical: 'top',
    fontSize: 15,
    lineHeight: 21,
  },
  note: { fontSize: 11, color: COULEURS.texteDoux, marginTop: 10 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  annuler: {
    flex: 1,
    padding: 13,
    borderRadius: RAYON.petit,
    borderWidth: 1,
    borderColor: COULEURS.bord,
    alignItems: 'center',
  },
  annulerTexte: { color: COULEURS.texteDoux, fontWeight: '600' },
  valider: {
    flex: 1.4,
    padding: 13,
    borderRadius: RAYON.petit,
    backgroundColor: COULEURS.vert,
    alignItems: 'center',
  },
  validerTexte: { color: '#fff', fontWeight: '700' },
});
