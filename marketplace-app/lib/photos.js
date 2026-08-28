import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from './supabase';

export const BUCKET_PHOTOS = 'photos';

// Ouvre la galerie du téléphone et renvoie l'image choisie (ou null si annulé).
export async function choisirPhoto() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error("Autorisation refusée pour accéder aux photos du téléphone.");
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.6,
    base64: true,
  });
  if (result.canceled) return null;
  return result.assets[0];
}

// Envoie l'image sur Supabase Storage et renvoie son URL publique.
export async function envoyerPhoto(asset, dossier, userId) {
  const extension = asset.uri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const nomFichier = `${dossier}/${userId}/${Date.now()}.${extension}`;
  const contentType = asset.mimeType ?? `image/${extension === 'jpg' ? 'jpeg' : extension}`;

  const { error } = await supabase.storage
    .from(BUCKET_PHOTOS)
    .upload(nomFichier, decode(asset.base64), { contentType, upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET_PHOTOS).getPublicUrl(nomFichier);
  return data.publicUrl;
}
