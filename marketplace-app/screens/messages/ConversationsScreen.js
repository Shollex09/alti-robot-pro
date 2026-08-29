import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../lib/AuthContext';
import { useMessages } from '../../lib/MessagesContext';
import { chargerConversations } from '../../lib/messagerie';
import { COULEURS } from '../../lib/constants';
import Icone from '../../components/Icone';

function quand(iso) {
  const date = new Date(iso);
  const maintenant = new Date();
  const memeJour = date.toDateString() === maintenant.toDateString();
  return memeJour
    ? date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

export default function ConversationsScreen({ navigation }) {
  const { session } = useAuth();
  const { rafraichir } = useMessages();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  const charger = useCallback(async () => {
    try {
      setConversations(await chargerConversations(session.user.id));
      setErreur(null);
    } catch (e) {
      setErreur(e);
    }
    setLoading(false);
    rafraichir();
  }, [session.user.id, rafraichir]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COULEURS.vert} />
      </View>
    );
  }

  if (erreur) {
    return (
      <View style={styles.center}>
        <Text style={styles.erreurTitre}>Messagerie non activée</Text>
        <Text style={styles.erreurTexte}>
          Exécute le script supabase/05-messagerie.sql dans Supabase pour activer les
          conversations.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id}
      contentContainerStyle={conversations.length === 0 ? styles.videConteneur : null}
      ListEmptyComponent={
        <View style={styles.vide}>
          <Icone nom="messages" taille={38} couleur={COULEURS.texteDoux} />
          <Text style={styles.videTitre}>Aucune conversation</Text>
          <Text style={styles.videTexte}>
            Depuis la fiche d'un produit, appuie sur « Contacter » pour poser une question au
            producteur.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.ligne}
          onPress={() =>
            navigation.navigate('Conversation', {
              conversationId: item.id,
              prenom: item.interlocuteur?.prenom ?? 'Conversation',
            })
          }
        >
          {item.interlocuteur?.photo_url ? (
            <Image source={{ uri: item.interlocuteur.photo_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarVide]}>
              <Text style={styles.avatarInitiale}>
                {item.interlocuteur?.prenom?.[0]?.toUpperCase() ?? '?'}
              </Text>
            </View>
          )}
          <View style={styles.infos}>
            <Text style={styles.prenom}>{item.interlocuteur?.prenom ?? 'Inconnu'}</Text>
            {item.product?.nom ? (
              <Text style={styles.produit}>À propos de : {item.product.nom}</Text>
            ) : null}
          </View>
          <Text style={styles.date}>{quand(item.dernier_message_at)}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  erreurTitre: { fontSize: 17, fontWeight: 'bold', marginBottom: 10 },
  erreurTexte: { textAlign: 'center', color: COULEURS.texteDoux, lineHeight: 20 },
  videConteneur: { flexGrow: 1, justifyContent: 'center' },
  vide: { alignItems: 'center', padding: 40 },

  videTitre: { fontSize: 17, fontWeight: '600', marginTop: 12, marginBottom: 8 },
  videTexte: { color: COULEURS.texteDoux, textAlign: 'center', lineHeight: 20 },
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COULEURS.bord,
  },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarVide: {
    backgroundColor: COULEURS.vertClair,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitiale: { fontSize: 20, fontWeight: 'bold', color: COULEURS.vert },
  infos: { flex: 1 },
  prenom: { fontSize: 16, fontWeight: '600', color: COULEURS.encre },
  produit: { fontSize: 12, color: COULEURS.texteDoux, marginTop: 2 },
  date: { fontSize: 11, color: COULEURS.texteDoux },
});
