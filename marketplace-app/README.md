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

- `App.js` — écran de démarrage (provisoire, à remplacer écran par écran)
- `app.json` — configuration Expo (nom de l'appli, icône...)

## Prochaines étapes (pas encore faites)

- Création du projet Supabase (base de données, authentification, stockage photos)
- Écran inscription / connexion avec choix du rôle (vendeur / acheteur)
- Écran de création de profil (géolocalisation)
- Écrans produits, stock, ventes, clients (v1), voir le cahier des charges
