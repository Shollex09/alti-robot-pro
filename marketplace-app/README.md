# Marketplace Jardin

Application mobile (React Native + Expo) — marketplace locale de produits du jardin, mettant en relation producteurs particuliers et acheteurs proches d'eux géographiquement.

Voir le cahier des charges complet dans les documents du projet pour le détail des fonctionnalités v1.

## Étape 1 — Installer ce qu'il faut sur ton ordinateur

Pour lancer cette appli sur ton téléphone via **Expo Go**, il te faut sur TON ordinateur (pas ici, dans le cloud) :

1. **Node.js** (version 20 ou plus) — télécharge-le sur https://nodejs.org (choisis la version "LTS").
   Vérifie l'installation avec :
   ```bash
   node -v
   npm -v
   ```
2. **L'application Expo Go** sur ton téléphone Android — installe-la depuis le Play Store.
3. Un **compte Expo** (gratuit) — tu le crées directement dans l'app Expo Go ou sur https://expo.dev, ça sert à relier ton téléphone à ton ordinateur pendant le développement.

Aucune autre installation globale n'est nécessaire : `npx` (fourni avec Node.js) télécharge et lance les outils Expo à la demande.

## Étape 2 — Récupérer le projet et le lancer

Sur ton ordinateur, dans un terminal :

```bash
git clone https://github.com/Shollex09/alti-robot-pro.git
cd alti-robot-pro/marketplace-app
npm install
npx expo start
```

Un QR code apparaît dans le terminal. Scanne-le avec l'appli **Expo Go** sur ton téléphone (Android : bouton "Scan QR code" dans Expo Go). L'appli doit s'ouvrir et afficher "🌱 Marketplace Jardin".

Si ça fonctionne, on peut passer à la suite (création du projet Supabase, puis les écrans un par un).

## Étape 3 — mettre à jour la base Supabase

Avant de lancer la version complète, exécute une fois le script
`supabase/02-marketplace.sql` dans **Supabase → SQL Editor → New query → Run**.
Il ajoute le droit pour un vendeur de confirmer/annuler une commande, le
garde-fou anti-survente, le retour du stock à l'annulation, et le stockage des
photos.

⚠️ Pour tester l'inscription sans confirmation par email, désactive "Confirm email"
dans **Authentication → Sign In / Providers → Email**.

## Structure du projet

```
App.js                    point d'entrée : connexion → profil → appli
navigation/
  RootNavigator.js        onglets (Découvrir, Achats, Favoris, Vendre, Réglages)
lib/
  supabase.js             connexion à Supabase (URL + clé publique dans .env)
  AuthContext.js          session et profil partagés dans toute l'appli
  geo.js                  calcul de distance entre deux points GPS
  photos.js               choix et envoi des photos vers Supabase Storage
  constants.js            catégories, couleurs, formats
screens/
  AuthScreen.js           inscription / connexion + choix du rôle
  ProfileScreen.js        complétion du profil (position GPS)
  SettingsScreen.js       réglages, photo, rayon, "devenir vendeur", déconnexion
  buyer/
    ProductsListScreen.js  produits autour de moi, filtre par catégorie
    ProductDetailScreen.js fiche produit, favori, réservation
    SellerProfileScreen.js vitrine publique d'un producteur
    MyOrdersScreen.js      historique de mes commandes
    FavorisScreen.js       produits mis en favori
  seller/
    MyProductsScreen.js    mes annonces (créer / modifier / retirer)
    ProductFormScreen.js   formulaire d'annonce avec photo
    StockScreen.js         stock par produit et valeur totale
    SalesScreen.js         historique des ventes, confirmer / annuler
    ClientsScreen.js       classement automatique des clients
supabase/
  01-schema-initial.sql   schéma de départ (référence)
  02-marketplace.sql      complément à exécuter
```

Base de données : 4 tables (`profiles`, `products`, `orders`, `favoris`), stock
décrémenté automatiquement à chaque commande, et règles de confidentialité
(Row Level Security) — l'adresse exacte n'est jamais stockée, seulement une
position GPS arrondie au centième de degré (~1 km).

## Reporté à la v2 (volontairement)

Paiement en ligne (Stripe Connect), abonnement Pro, notifications push, avis /
notation, messagerie interne.
