import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import { prevenir } from './notifications';
import { compterNonLus } from './messagerie';

const MessagesContext = createContext(null);

export function MessagesProvider({ children }) {
  const { session, profile } = useAuth();
  const [nonLus, setNonLus] = useState(0);
  // La conversation ouverte à l'écran : inutile de notifier pour elle.
  const conversationOuverte = useRef(null);

  const userId = session?.user?.id ?? null;

  const rafraichir = useCallback(async () => {
    if (!userId) {
      setNonLus(0);
      return;
    }
    try {
      setNonLus(await compterNonLus(userId));
    } catch {
      // Table absente tant que le script 05 n'a pas été exécuté.
      setNonLus(0);
    }
  }, [userId]);

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  useEffect(() => {
    if (!userId || !profile) return;

    const canal = supabase
      .channel(`messages-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async ({ new: message }) => {
          // Les règles de la base ne laissent passer que nos conversations,
          // mais on ignore nos propres envois.
          if (message.expediteur_id === userId) return;
          if (message.conversation_id === conversationOuverte.current) return;

          setNonLus((n) => n + 1);
          const { data: expediteur } = await supabase
            .from('profiles')
            .select('prenom')
            .eq('id', message.expediteur_id)
            .single();
          prevenir(
            `Message de ${expediteur?.prenom ?? 'quelqu\'un'} 💬`,
            message.texte.slice(0, 120)
          );
        }
      );

    canal.subscribe();
    return () => {
      supabase.removeChannel(canal);
    };
  }, [userId, profile]);

  const value = useMemo(
    () => ({
      nonLus,
      rafraichir,
      definirConversationOuverte: (id) => {
        conversationOuverte.current = id;
      },
    }),
    [nonLus, rafraichir]
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error('useMessages doit être utilisé dans un MessagesProvider');
  return ctx;
}
