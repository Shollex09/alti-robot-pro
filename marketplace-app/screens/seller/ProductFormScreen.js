import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { choisirPhoto, envoyerPhoto } from '../../lib/photos';
import { CATEGORIES, COULEURS } from '../../lib/constants';

export default function ProductFormScreen({ route, navigation }) {
  const productId = route.params?.productId;
  const { session } = useAuth();
  const [nom, setNom] = useState('');
  const [categorie, setCategorie] = useState('legume');
  const [quantite, setQuantite] = useState('');
  const [prix, setPrix] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState(null);
  const [nouvellePhoto, setNouvellePhoto] = useState(null);
  const [chargement, setChargement] = useState(!!productId);
  const [enregistrement, setEnregistrement] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: productId ? "Modifier l'annonce" : 'Nouvelle annonce' });
    if (!productId) return;
    supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()
      .then(({ data }) => {
        if (data) {
          setNom(data.nom);
          setCategorie(data.categorie);
          setQuantite(String(data.quantite_disponible));
          setPrix(String(data.prix));
          setDescription(data.description ?? '');
          setPhotoUrl(data.photo_url);
        }
        setChargement(false);
      });
  }, [productId, navigation]);

  async function selectionnerPhoto() {
    try {
      const asset = await choisirPhoto();
      if (asset) setNouvellePhoto(asset);
    } catch (e) {
      Alert.alert('Photo', e.message);
    }
  }

  async function enregistrer() {
    if (!nom.trim()) return Alert.alert('Nom manquant', 'Donne un nom à ton produit.');
    const quantiteNum = Number(quantite.replace(',', '.'));
    const prixNum = Number(prix.replace(',', '.'));
    if (!Number.isFinite(quantiteNum) || quantiteNum < 0)
      return Alert.alert('Quantité invalide', 'Indique une quantité positive.');
    if (!Number.isFinite(prixNum) || prixNum < 0)
      return Alert.alert('Prix invalide', 'Indique un prix positif.');

    setEnregistrement(true);
    try {
      let url = photoUrl;
      if (nouvellePhoto) {
        url = await envoyerPhoto(nouvellePhoto, 'produits', session.user.id);
      }

      const valeurs = {
        nom: nom.trim(),
        categorie,
        quantite_disponible: quantiteNum,
        prix: prixNum,
        description: description.trim() || null,
        photo_url: url,
      };

      if (productId) {
        // Une annonce réapprovisionnée redevient visible automatiquement.
        const { error } = await supabase
          .from('products')
          .update({ ...valeurs, statut: quantiteNum > 0 ? 'disponible' : 'epuise' })
          .eq('id', productId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert({ ...valeurs, vendeur_id: session.user.id });
        if (error) throw error;
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erreur', e.message);
    } finally {
      setEnregistrement(false);
    }
  }

  if (chargement) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COULEURS.vert} />
      </View>
    );
  }

  const apercu = nouvellePhoto?.uri ?? photoUrl;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.photoZone} onPress={selectionnerPhoto}>
        {apercu ? (
          <Image source={{ uri: apercu }} style={styles.photo} />
        ) : (
          <View style={styles.photoVide}>
            <Text style={styles.photoVideTexte}>📷</Text>
            <Text style={styles.photoVideLabel}>Ajouter une photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Nom du produit *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : Tomates anciennes"
        value={nom}
        onChangeText={setNom}
      />

      <Text style={styles.label}>Catégorie *</Text>
      <View style={styles.categories}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c.value}
            style={[styles.categorie, categorie === c.value && styles.categorieActive]}
            onPress={() => setCategorie(c.value)}
          >
            <Text style={[styles.categorieTexte, categorie === c.value && styles.categorieTexteActif]}>
              {c.emoji} {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Quantité disponible *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : 12"
        keyboardType="numeric"
        value={quantite}
        onChangeText={setQuantite}
      />

      <Text style={styles.label}>Prix à l'unité (€) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : 2.50"
        keyboardType="decimal-pad"
        value={prix}
        onChangeText={setPrix}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Variété, mode de culture, conditions de retrait..."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.enregistrerBtn} onPress={enregistrer} disabled={enregistrement}>
        <Text style={styles.enregistrerTexte}>
          {enregistrement ? 'Enregistrement...' : 'Enregistrer'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photoZone: { marginBottom: 8 },
  photo: { width: '100%', height: 180, borderRadius: 12 },
  photoVide: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: COULEURS.vertClair,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COULEURS.vert,
  },
  photoVideTexte: { fontSize: 40 },
  photoVideLabel: { color: COULEURS.vert, fontWeight: '600', marginTop: 8 },
  label: { marginTop: 16, marginBottom: 8, fontWeight: '600', color: COULEURS.texte },
  input: {
    borderWidth: 1,
    borderColor: COULEURS.bord,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categorie: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COULEURS.fondDoux,
  },
  categorieActive: { backgroundColor: COULEURS.vert },
  categorieTexte: { color: COULEURS.texte },
  categorieTexteActif: { color: '#fff', fontWeight: '600' },
  enregistrerBtn: {
    marginTop: 32,
    backgroundColor: COULEURS.vert,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  enregistrerTexte: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
