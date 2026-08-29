# Bloc-notes — à faire avant de publier sur le Play Store

Tout ce qu'on a volontairement laissé de côté pendant le développement, pour ne
pas se noyer. À reprendre le jour de la publication.

Trois niveaux : 🔴 bloquant (l'appli ne marchera pas, ou sera refusée par
Google), 🟠 important (ça marchera, mais mal), 🟢 confort.

---

## 🔴 Bloquant

### Passer d'Expo Go à un vrai build

Expo Go sert au développement. Pour le Play Store il faut un **build EAS** :

- Créer `eas.json` et lancer `npx eas build --platform android`
- Compte Expo gratuit nécessaire (`npx eas login`)
- Le premier build génère une clé de signature — **ne jamais la perdre**, sans
  elle on ne peut plus mettre l'appli à jour sur le Play Store

### Identifiant unique Android

Absent de `app.json` aujourd'hui. À ajouter, et **jamais modifié ensuite** —
c'est l'identité de l'appli sur le Play Store :

```json
"android": { "package": "com.shollex.marketplacejardin" }
```

### Clé Google Maps

La carte des secteurs marche dans Expo Go grâce à la clé d'Expo. Dans un build
il en faut une à nous (gratuite, console Google Cloud → activer *Maps SDK for
Android*) :

```json
"android": { "config": { "googleMaps": { "apiKey": "..." } } }
```

Sans ça : carte grise sur les fiches profil.

### Suppression de compte

Google Play l'exige pour toute appli permettant de créer un compte : il faut un
moyen de supprimer son compte **depuis l'appli**, plus une page web expliquant
la démarche. Rien n'existe encore — à ajouter dans Réglages.

### Politique de confidentialité

Obligatoire, et d'autant plus qu'on collecte position, photos et email. Il faut
une page web publique, et remplir le formulaire *Sécurité des données* du Play
Store en déclarant : email, prénom, position approximative, photos.

### Réactiver la confirmation par email

On l'a désactivée pour tester (Supabase → Authentication → Sign In / Providers →
Email → *Confirm email*). À réactiver avant l'ouverture au public, sinon
n'importe qui peut créer un compte avec l'email d'un autre.

---

## 🟠 Important

### Notifications à distance

Aujourd'hui les notifications sont **locales** : elles n'arrivent que si l'appli
tourne. Pour être prévenu appli fermée, il faut :

- Récupérer le jeton de notification de chaque appareil et le stocker en base
- Une fonction Supabase (Edge Function) déclenchée à l'insertion d'une commande,
  qui appelle le service d'envoi d'Expo

Le socle est déjà là (`lib/notifications.js`, `lib/CommandesContext.js`) — il ne
manque que la partie envoi.

### Icône et écran de démarrage

Ce sont encore ceux d'Expo par défaut. À remplacer par un vrai logo Marketplace
Jardin (`assets/icon.png`, les trois `android-icon-*.png`, `splash-icon.png`).

### Emails en français

Les emails d'inscription partent en anglais avec la mention Supabase. Les
personnaliser demande un **SMTP externe** (Brevo ou Resend ont une offre
gratuite) à configurer dans Supabase → Authentication → SMTP.

### Ménage dans la base

Supprimer les comptes et produits de test (`test@test.com`, etc.) avant
l'ouverture : Supabase → Authentication → Users, et Table Editor.

### Plan Supabase

L'offre gratuite met le projet **en pause après une semaine sans activité** —
l'appli tomberait en panne. Prévoir le passage au plan payant (~25 $/mois) dès
qu'il y a de vrais utilisateurs.

---

### Sortir le projet du dépôt `alti-robot-pro`

L'appli vit aujourd'hui dans un dépôt créé pour le robot de trading, qui héberge
aussi le poulailler. Le nom n'apparaît nulle part pour l'utilisateur, mais un
projet destiné au Play Store mérite son propre dépôt, avec son historique et ses
réglages à lui. À faire au moment de la réorganisation, pas avant : ça oblige à
tout re-cloner.

## 🟢 Confort

- Tester sur plusieurs tailles d'écran et sur un petit téléphone
- Message clair quand le téléphone n'a pas de réseau
- Conditions d'utilisation (CGU) et âge minimum
- Écran d'aide « comment ça marche » pour les nouveaux venus
- Signalement d'une annonce abusive
- Limiter le nombre d'annonces par compte, pour éviter le spam

---

## Reporté à la v2 (décidé au cahier des charges)

- Paiement en ligne (Stripe Connect)
- Abonnement « Pro » vendeur : mise en avant, statistiques avancées, boost
  d'annonce
- Système d'avis et de notation
- Messagerie interne entre acheteur et vendeur
- Alertes push ciblées (« un nouveau producteur près de chez toi »)

---

## Rappel : les scripts SQL

Un nouveau projet Supabase doit rejouer, dans l'ordre, les fichiers de
`marketplace-app/supabase/` : `01` (schéma), `02` (commandes, photos), `03`
(gestion vendeur), `04` (temps réel).
