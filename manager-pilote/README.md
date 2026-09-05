# Manager de Pilote

Prototype jouable d'une simulation de gestion : vous êtes le **manager d'un pilote**,
pas le pilote. Vous repérez un jeune en karting, vous trouvez l'argent pour le faire
rouler, et vous négociez sa carrière jusqu'à la Formule 1 — s'il en a le talent et
si vous trouvez les sponsors.

## Lancer le jeu

Ouvrez `index.html` dans un navigateur. Aucune installation, aucune dépendance,
aucun serveur. La partie est sauvegardée dans le navigateur (localStorage) et
peut être exportée en fichier JSON depuis l'onglet Sauvegarde.

Installable comme application sur mobile (PWA) et jouable hors ligne.

## La boucle de jeu

1. **Créer la partie** — deux curseurs indépendants : budget de départ (4 niveaux)
   et réputation de manager (10 paliers). 40 profils de départ, qui ne se jouent
   pas du tout de la même façon.
2. **Repérer un pilote** — votre scout ne vous donne jamais la valeur exacte d'un
   jeune, seulement une fourchette. Elle se resserre si vous payez des observations
   et si vous recrutez un meilleur scout.
3. **Trouver un baquet** — plusieurs écuries peuvent faire une offre. Vous comparez
   salaire, vitesse de progression, risque de renvoi et prestige, et vous négociez.
   Chaque relance peut faire fuir l'écurie.
4. **Financer la saison** — c'est le vrai métier. L'argent des sponsors ne va pas
   dans votre poche : il alimente une caisse qui paie engagements, pneus et
   transport. Vous ne touchez que 15 % de commission. Si la caisse est vide, c'est
   votre trésorerie qui comble.
5. **Faire la course** — essais avec réglages à trouver à l'aveugle, qualifications,
   stratégie, course. Ou simulation rapide, manche par manche, à votre choix.
6. **Gérer l'humain** — conférences de presse, discussions avec le pilote dont
   l'effet dépend de sa personnalité, messages auxquels il faut répondre.
   Un pilote mal suivi change de manager.

## Documentation

- [`docs/GDD.md`](docs/GDD.md) — le document de conception (v0.5)
- [`docs/ETAT_PROTOTYPE.md`](docs/ETAT_PROTOTYPE.md) — ce qui est réellement codé,
  section par section, et les valeurs numériques arbitrées

## Contenu

Toutes les écuries sont fictives. Les circuits sont réels et cités par leur nom
(Salbris, Spa-Francorchamps, Monza, Suzuka…), sans aucun logo ni marque officielle.

## Technique

Un seul fichier `index.html` : HTML, CSS et JavaScript vanilla, sans build ni
dépendance, à l'image des autres applications de ce dépôt.
