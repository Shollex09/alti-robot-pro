import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COULEURS } from '../lib/constants';

// Une panne réseau ne doit pas ressembler à une liste vide : sans ça,
// l'utilisateur croit qu'il n'y a aucun produit autour de lui.
function estPanneReseau(erreur) {
  const message = String(erreur?.message ?? '');
  return /network|fetch|timeout|connexion|connection/i.test(message);
}

export default function EtatErreur({ erreur, onReessayer }) {
  const reseau = estPanneReseau(erreur);

  return (
    <View style={styles.zone}>
      <Text style={styles.emoji}>{reseau ? '📡' : '⚠️'}</Text>
      <Text style={styles.titre}>
        {reseau ? 'Pas de connexion' : 'Chargement impossible'}
      </Text>
      <Text style={styles.texte}>
        {reseau
          ? "Vérifie ta connexion internet, puis réessaie."
          : "Quelque chose s'est mal passé de notre côté."}
      </Text>
      {!reseau && erreur?.message ? (
        <Text style={styles.detail}>{erreur.message}</Text>
      ) : null}
      {onReessayer ? (
        <TouchableOpacity style={styles.bouton} onPress={onReessayer}>
          <Text style={styles.boutonTexte}>Réessayer</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  zone: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emoji: { fontSize: 44, marginBottom: 14 },
  titre: { fontSize: 17, fontWeight: 'bold', color: COULEURS.encre, marginBottom: 8 },
  texte: { color: COULEURS.texteDoux, textAlign: 'center', lineHeight: 20 },
  detail: { color: '#9aa5b1', fontSize: 11, textAlign: 'center', marginTop: 10 },
  bouton: {
    marginTop: 22,
    backgroundColor: COULEURS.vert,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  boutonTexte: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
