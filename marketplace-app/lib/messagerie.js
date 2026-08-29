import { supabase } from './supabase';

// Retrouve la conversation entre ces deux personnes, ou la crée.
// Une seule conversation par paire : on ne repart pas de zéro à chaque produit.
export async function ouvrirConversation({ acheteurId, vendeurId, productId = null }) {
  const { data: existante } = await supabase
    .from('conversations')
    .select('id')
    .eq('acheteur_id', acheteurId)
    .eq('vendeur_id', vendeurId)
    .maybeSingle();

  if (existante) return existante.id;

  const { data, error } = await supabase
    .from('conversations')
    .insert({ acheteur_id: acheteurId, vendeur_id: vendeurId, product_id: productId })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function chargerConversations(userId) {
  const { data, error } = await supabase
    .from('conversations')
    .select(
      `id, acheteur_id, vendeur_id, dernier_message_at,
       acheteur:profiles!conversations_acheteur_id_fkey(id, prenom, photo_url),
       vendeur:profiles!conversations_vendeur_id_fkey(id, prenom, photo_url),
       product:products(nom)`
    )
    .or(`acheteur_id.eq.${userId},vendeur_id.eq.${userId}`)
    .order('dernier_message_at', { ascending: false });
  if (error) throw error;

  // On ajoute l'interlocuteur, plus pratique que de trancher dans chaque écran.
  return (data ?? []).map((c) => ({
    ...c,
    interlocuteur: c.acheteur_id === userId ? c.vendeur : c.acheteur,
  }));
}

export async function chargerMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function envoyerMessage(conversationId, expediteurId, texte) {
  const { error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, expediteur_id: expediteurId, texte: texte.trim() });
  if (error) throw error;
}

export async function marquerLus(conversationId, userId) {
  await supabase
    .from('messages')
    .update({ lu: true })
    .eq('conversation_id', conversationId)
    .neq('expediteur_id', userId)
    .eq('lu', false);
}

export async function compterNonLus(userId) {
  const { data } = await supabase
    .from('conversations')
    .select('id')
    .or(`acheteur_id.eq.${userId},vendeur_id.eq.${userId}`);
  const ids = (data ?? []).map((c) => c.id);
  if (ids.length === 0) return 0;

  const { count } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .in('conversation_id', ids)
    .neq('expediteur_id', userId)
    .eq('lu', false);
  return count ?? 0;
}
