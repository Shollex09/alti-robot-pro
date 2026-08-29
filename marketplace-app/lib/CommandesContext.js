import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import { preparerNotifications, prevenir } from './notifications';
import { formatEuros } from './constants';

const CommandesContext = createContext(null);

export function CommandesProvider({ children }) {
  const { session, profile, estVendeur } = useAuth();
  const [enAttente, setEnAttente] = useState(0);
  const [misesAJourAchats, setMisesAJourAchats] = useState(0);

  const userId = session?.user?.id ?? null;

  // Nombre de commandes reçues encore à confirmer : sert de pastille sur l'onglet.
  const rafraichir = useCallback(async () => {
    if (!userId || !estVendeur) {
      setEnAttente(0);
      return;
    }
    const { count } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('vendeur_id', userId)
      .eq('statut', 'commande');
    setEnAttente(count ?? 0);
  }, [userId, estVendeur]);

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  useEffect(() => {
    if (!userId || !profile) return;
    preparerNotifications();

    const canal = supabase.channel(`commandes-${userId}`);

    if (estVendeur) {
      // Une nouvelle commande arrive : on prévient et on incrémente la pastille.
      canal.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `vendeur_id=eq.${userId}`,
        },
        async ({ new: commande }) => {
          setEnAttente((n) => n + 1);
          const { data: produit } = await supabase
            .from('products')
            .select('nom')
            .eq('id', commande.product_id)
            .single();
          prevenir(
            'Nouvelle commande 🧺',
            `${commande.quantite} × ${produit?.nom ?? 'un produit'} — ${formatEuros(
              commande.prix_total
            )}`
          );
        }
      );
    }

    // Côté acheteur : on suit ce que le vendeur décide de la commande.
    canal.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `acheteur_id=eq.${userId}`,
      },
      ({ new: commande, old }) => {
        if (commande.statut === old?.statut) return;
        setMisesAJourAchats((n) => n + 1);
        if (commande.statut === 'confirmee') {
          prevenir(
            'Commande confirmée',
            commande.infos_retrait?.trim()
              ? `Retrait : ${commande.infos_retrait.trim().slice(0, 140)}`
              : 'Le producteur a confirmé ta réservation. Ouvre « Mes achats » pour le retrait.'
          );
        } else if (commande.statut === 'annulee') {
          prevenir('Commande annulée', 'Le producteur n\'a pas pu honorer ta réservation.');
        }
      }
    );

    canal.subscribe();
    return () => {
      supabase.removeChannel(canal);
    };
  }, [userId, profile, estVendeur]);

  const value = useMemo(
    () => ({
      enAttente,
      misesAJourAchats,
      rafraichir,
      marquerAchatsVus: () => setMisesAJourAchats(0),
    }),
    [enAttente, misesAJourAchats, rafraichir]
  );

  return <CommandesContext.Provider value={value}>{children}</CommandesContext.Provider>;
}

export function useCommandes() {
  const ctx = useContext(CommandesContext);
  if (!ctx) throw new Error('useCommandes doit être utilisé dans un CommandesProvider');
  return ctx;
}
