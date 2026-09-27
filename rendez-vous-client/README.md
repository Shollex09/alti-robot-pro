# Rendez-vous Client — simulateur de vente pour paysagiste

Application d'entraînement commercial pour Alex'Térieur Jardin & Création : tu
fais un rendez-vous chantier simulé face à un client joué par Claude, tu
chiffres ton devis, le client accepte / refuse / négocie, puis tu reçois un
débriefing noté avec des conseils.

**V1** : niveaux, tirage du client, conversation écrite, notes de chantier,
devis, réponse du client (oui / non / négociation), débriefing noté.

## Architecture

```
rendez-vous-client/
  client/   React + Vite + TypeScript + Tailwind (mobile-first)
  server/   Express + TypeScript — proxy vers l'API Anthropic (clé API côté serveur uniquement)
```

Le front ne parle jamais directement à l'API Anthropic : il appelle le petit
serveur Express (`/api/...`), qui construit les prompts et appelle Claude avec
`ANTHROPIC_API_KEY` (jamais exposée au navigateur).

Le front garde l'état de la partie en mémoire (fiche client secrète,
conversation, devis...) et le renvoie à chaque appel serveur — pas besoin de
session côté serveur pour la V1. Les réglages de tarifs et l'historique des
parties sont stockés dans le `localStorage` du navigateur.

### Flux d'une partie

1. `POST /api/client/generate` — génère une fiche client secrète (JSON) + les
   infos publiques visibles par le joueur (prénom, commune, motif d'appel...).
2. `POST /api/conversation/message` — à chaque message du paysagiste, renvoie
   la réponse du client + confiance + infos de chantier révélées.
3. `POST /api/devis/response` — le client réagit au devis chiffré : accepte /
   refuse / négocie.
4. `POST /api/devis/negotiate` — en cas de négociation, quelques échanges
   supplémentaires (max 4 tours) jusqu'à une décision finale.
5. `POST /api/debrief` — génère le débriefing complet (notes par critère,
   fiche client révélée, moments clés, conseils), en tenant compte des tarifs
   configurés pour juger la rentabilité du devis.

## Lancer le projet en développement

Il faut deux terminaux (le serveur et le front).

### 1. Serveur

```bash
cd server
cp .env.example .env
# éditer .env et renseigner ANTHROPIC_API_KEY (et éventuellement CLAUDE_MODEL)
npm install
npm run dev
```

Le serveur démarre sur `http://localhost:3001`.

### 2. Client

```bash
cd client
npm install
npm run dev
```

Le client démarre sur `http://localhost:5173` (Vite proxy `/api` vers le
serveur sur le port 3001, voir `client/vite.config.ts`).

Ouvre l'app sur ton téléphone en te connectant à l'IP de ton ordinateur sur le
même réseau (`http://<ip-locale>:5173`) pour tester le rendu mobile.

## Variables d'environnement (serveur)

Voir `server/.env.example` :

- `ANTHROPIC_API_KEY` — clé API Anthropic (obligatoire, jamais côté client).
- `CLAUDE_MODEL` — modèle Claude à utiliser (par défaut `claude-opus-5`).
- `PORT` — port du serveur Express (par défaut `3001`).

Voir aussi `client/.env.example` — `VITE_API_BASE_URL` n'est utile qu'en
production (client et serveur hébergés séparément, voir plus haut) ; en
développement local, laisse-la vide.

## Déployer en ligne (pour tester sur ton téléphone)

Pas besoin d'ordinateur pour tester l'app une fois qu'elle est en ligne : tout
se fait depuis le tableau de bord d'un hébergeur, dans le navigateur de ton
téléphone. [Render](https://render.com) a un plan gratuit qui convient bien
(deux services séparés, l'un pour le serveur, l'un pour le client).

1. **Crée un compte** sur render.com (bouton « Sign up », connexion possible
   directement avec ton compte GitHub — ça prend une minute).
2. **Déploie le serveur** : New → Web Service → connecte le dépôt
   `alti-robot-pro` → renseigne :
   - Branch : `claude/rendez-vous-client-simulator-ux0c15` (ou `master` une
     fois le PR mergé)
   - Root Directory : `rendez-vous-client/server`
   - Build Command : `npm install && npm run build`
   - Start Command : `npm start`
   - Onglet Environment → ajoute `ANTHROPIC_API_KEY` (ta clé) et
     éventuellement `CLAUDE_MODEL`. Pas besoin de renseigner `PORT`, Render le
     fournit automatiquement.
   - Déploie, puis note l'URL donnée par Render (ex :
     `https://rendez-vous-client-api.onrender.com`).
3. **Déploie le client** : New → Static Site → même dépôt → renseigne :
   - Branch : la même que ci-dessus
   - Root Directory : `rendez-vous-client/client`
   - Build Command : `npm install && npm run build`
   - Publish Directory : `dist`
   - Onglet Environment → ajoute `VITE_API_BASE_URL` avec l'URL du serveur
     obtenue à l'étape 2 (sans `/` à la fin).
   - Déploie.
4. **Ouvre l'URL du site statique** (celle du client, ex :
   `https://rendez-vous-client.onrender.com`) directement sur ton téléphone.

Le plan gratuit de Render met le service serveur en veille après quelques
minutes d'inactivité : le tout premier appel après une pause peut prendre
30-60 secondes le temps qu'il se réveille (patiente sur l'écran de génération
du client).

## Réglages de tarifs

Depuis l'écran d'accueil → « Réglages de tarifs », tu peux ajuster :

- ton taux horaire entretien (tonte, taille, débroussaillage, élagage),
- ton taux horaire aménagement (terrassement, allées, pavage, clôture, drainage),
- ton coefficient d'achat sur les matériaux/fournitures.

Ces valeurs servent uniquement à ce que le débriefing juge la rentabilité de
tes devis (critère « Justesse du prix ») — elles ne sont jamais montrées au
client simulé.

## Suite du développement (V2 / V3)

- **V2** : dictée vocale (Web Speech API `SpeechRecognition`), voix du client
  (`speechSynthesis`), jauge de confiance en direct pendant la conversation.
- **V3** : historique et progression plus détaillés, mode « client réel »
  (décrire un vrai rendez-vous pour que l'IA le rejoue), PWA installable
  (manifest + service worker).

Le bouton « Rejouer le même client » (même fiche secrète, nouvelle approche) et
un mini historique des parties (localStorage) sont déjà inclus en V1 car peu
coûteux à ajouter.
