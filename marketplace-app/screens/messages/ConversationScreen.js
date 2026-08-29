import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { useMessages } from '../../lib/MessagesContext';
import { chargerMessages, envoyerMessage, marquerLus } from '../../lib/messagerie';
import { COULEURS } from '../../lib/constants';

function heure(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function ConversationScreen({ route, navigation }) {
  const { conversationId, prenom } = route.params;
  const { session } = useAuth();
  const { definirConversationOuverte, rafraichir } = useMessages();
  const [messages, setMessages] = useState([]);
  const [texte, setTexte] = useState('');
  const [loading, setLoading] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const liste = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: prenom });
  }, [navigation, prenom]);

  const charger = useCallback(async () => {
    setMessages(await chargerMessages(conversationId));
    setLoading(false);
    await marquerLus(conversationId, session.user.id);
    rafraichir();
  }, [conversationId, session.user.id, rafraichir]);

  useEffect(() => {
    charger();
  }, [charger]);

  // Tant que l'écran est ouvert, pas de notification pour cette conversation.
  useEffect(() => {
    definirConversationOuverte(conversationId);
    return () => definirConversationOuverte(null);
  }, [conversationId, definirConversationOuverte]);

  // Les messages reçus s'affichent sans rafraîchir.
  useEffect(() => {
    const canal = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        ({ new: message }) => {
          setMessages((anciens) =>
            anciens.some((m) => m.id === message.id) ? anciens : [...anciens, message]
          );
          if (message.expediteur_id !== session.user.id) {
            marquerLus(conversationId, session.user.id).then(rafraichir);
          }
        }
      );
    canal.subscribe();
    return () => {
      supabase.removeChannel(canal);
    };
  }, [conversationId, session.user.id, rafraichir]);

  async function envoyer() {
    const contenu = texte.trim();
    if (!contenu) return;
    setEnvoi(true);
    try {
      await envoyerMessage(conversationId, session.user.id, contenu);
      setTexte('');
    } catch (e) {
      Alert.alert('Message non envoyé', e.message);
    } finally {
      setEnvoi(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COULEURS.vert} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={liste}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.liste}
        onContentSizeChange={() => liste.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <Text style={styles.vide}>
            Dis bonjour — par exemple pour ajuster une quantité ou convenir d'un retrait.
          </Text>
        }
        renderItem={({ item }) => {
          const deMoi = item.expediteur_id === session.user.id;
          return (
            <View style={[styles.bulleZone, deMoi ? styles.zoneDroite : styles.zoneGauche]}>
              <View style={[styles.bulle, deMoi ? styles.bulleMoi : styles.bulleAutre]}>
                <Text style={[styles.texte, deMoi && styles.texteMoi]}>{item.texte}</Text>
                <Text style={[styles.heure, deMoi && styles.heureMoi]}>
                  {heure(item.created_at)}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.barre}>
        <TextInput
          style={styles.champ}
          placeholder="Écrire un message"
          value={texte}
          onChangeText={setTexte}
          multiline
          maxLength={2000}
        />
        <TouchableOpacity
          style={[styles.envoyer, (!texte.trim() || envoi) && styles.envoyerInactif]}
          onPress={envoyer}
          disabled={!texte.trim() || envoi}
        >
          <Text style={styles.envoyerTexte}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COULEURS.fondProfil },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  liste: { padding: 12, gap: 8, flexGrow: 1 },
  vide: {
    textAlign: 'center',
    color: COULEURS.texteDoux,
    marginTop: 40,
    paddingHorizontal: 30,
    lineHeight: 20,
  },
  bulleZone: { flexDirection: 'row' },
  zoneGauche: { justifyContent: 'flex-start' },
  zoneDroite: { justifyContent: 'flex-end' },
  bulle: { maxWidth: '78%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bulleMoi: { backgroundColor: COULEURS.vert, borderBottomRightRadius: 4 },
  bulleAutre: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COULEURS.bord,
  },
  texte: { fontSize: 15, color: COULEURS.texte, lineHeight: 20 },
  texteMoi: { color: '#fff' },
  heure: { fontSize: 10, color: COULEURS.texteDoux, marginTop: 4, alignSelf: 'flex-end' },
  heureMoi: { color: 'rgba(255,255,255,0.75)' },
  barre: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    gap: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: COULEURS.bord,
  },
  champ: {
    flex: 1,
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 110,
  },
  envoyer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COULEURS.vert,
    justifyContent: 'center',
    alignItems: 'center',
  },
  envoyerInactif: { backgroundColor: '#b7c4b8' },
  envoyerTexte: { color: '#fff', fontSize: 18 },
});
