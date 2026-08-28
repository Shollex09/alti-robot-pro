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

## Structure actuelle

- `App.js` — point d'entrée : affiche l'écran de connexion ou l'écran d'accueil selon que l'utilisateur est connecté
- `lib/supabase.js` — connexion à la base Supabase (URL + clé publique lues dans `.env`)
- `screens/AuthScreen.js` — inscription / connexion, avec choix du rôle (vendeur / acheteur)
- `screens/HomeScreen.js` — écran d'accueil provisoire après connexion
- `.env` — URL et clé publique du projet Supabase (clé "publishable", sans danger à committer)
- `app.json` — configuration Expo (nom de l'appli, icône...)

Base de données Supabase : 4 tables (`profiles`, `products`, `orders`, `favoris`), avec décrément automatique du stock à chaque commande et règles de confidentialité (Row Level Security).

⚠️ Pour tester l'inscription sans confirmation par email, désactive "Confirm email" dans le dashboard Supabase : **Authentication → Sign In / Providers → Email**.

## Prochaines étapes (pas encore faites)

- Écran de création/édition de profil (géolocalisation, photo, description)
- Écrans produits, stock, ventes, clients (v1), voir le cahier des charges
