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
  RootNavigator.js        onglets (Découvrir, Achats, Favoris, Messages, Vendre, Profil)
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
  messages/
    ConversationsScreen.js liste des discussions
    ConversationScreen.js  fil de discussion
  seller/
    DashboardScreen.js     bilan : CA, coûts, bénéfice, rentabilité, bilan annuel
    MyProductsScreen.js    mes annonces (créer / modifier / retirer)
    ProductFormScreen.js   formulaire d'annonce avec photo
    StockScreen.js         stock par produit, valeur, réapprovisionnement
    SalesScreen.js         ventes appli + ventes en direct, confirmer / annuler
    ClientsScreen.js       classement automatique des clients
    CoutsScreen.js         dépenses par catégorie
    ConsommationScreen.js  ce que le producteur garde pour lui (économies)
    InvestissementsScreen.js  matériel, serre, outillage
    PlusScreen.js          menu de gestion + export CSV
supabase/
  01-schema-initial.sql   schéma de départ (référence)
  02-marketplace.sql      commandes, anti-survente, photos
  03-gestion-vendeur.sql  coûts, consommation, investissements, ventes directes
  04-notifications.sql    temps réel sur les commandes
  05-messagerie.sql       conversations acheteur / producteur
  06-compte-et-signalements.sql  suppression de compte, signalements
```

## Notifications

Le vendeur est prévenu dès qu'une commande arrive : notification sur le
téléphone et pastille sur les onglets Vendre et Ventes. L'acheteur est prévenu
quand sa commande est confirmée ou annulée. Tout passe par le temps réel de
Supabase (`04-notifications.sql`).

⚠️ Depuis le SDK 53, les notifications **à distance** (appli fermée) ne
fonctionnent plus dans Expo Go : il faut un build de développement. Les
notifications **locales** utilisées ici marchent tant que l'appli tourne, y
compris en arrière-plan récent. Le passage aux notifications à distance se fera
au moment de préparer la publication.

## Messagerie

Un acheteur peut contacter un producteur depuis une fiche produit ou sa vitrine,
pour ajuster une quantité ou convenir d'un retrait. Une seule conversation par
paire, quel que soit le produit ; les messages arrivent en direct et déclenchent
une notification (`05-messagerie.sql`).

## Espace vendeur : la logique du poulailler

L'onglet « Vendre » reprend le fonctionnement de l'app Gestion du Poulailler,
avec les mêmes formules calculées automatiquement :

- **bénéfice** = ventes − coûts
- **valeur créée** = ventes + économies − coûts
- **solde** = valeur créée − investissements
- **rentabilité** = valeur créée / investissements

Le stock est tenu par la base de données, pas par l'appli : chaque commande,
vente en direct, consommation personnelle ou réapprovisionnement le met à jour
tout seul, et une commande annulée remet la quantité en stock.

Base de données : 4 tables (`profiles`, `products`, `orders`, `favoris`), stock
décrémenté automatiquement à chaque commande, et règles de confidentialité
(Row Level Security) — l'adresse exacte n'est jamais stockée, seulement une
position GPS arrondie au centième de degré (~1 km).

Sur les fiches profil, cette position n'est jamais montrée comme un point : la
carte affiche un cercle de 1,8 km de rayon, plus large que l'imprécision déjà
appliquée, et la carte n'est ni déplaçable ni zoomable.

## Avant de publier

Voir `AVANT-PUBLICATION.md` : la liste de tout ce qu'il reste à faire le jour de
la mise sur le Play Store (build EAS, clé Google Maps, politique de
confidentialité, notifications à distance...).

## Compte et signalements

Chacun peut supprimer définitivement son compte depuis les réglages — profil,
annonces, commandes et messages partent en cascade. Une annonce peut être
signalée depuis sa fiche ; les signalements se relisent dans Supabase
(`06-compte-et-signalements.sql`).

## Reporté à la v2 (volontairement)

Paiement en ligne (Stripe Connect), abonnement Pro, notifications push, avis /
notation.
