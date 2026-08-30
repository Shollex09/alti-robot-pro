# État du prototype — correspondance avec le GDD v0.5

Le prototype (`../index.html`) couvre le périmètre **[V1]** du [GDD](GDD.md).
Ce document dit, section par section, ce qui est réellement codé, ce qui est
partiel, et les valeurs numériques qui ont dû être arbitrées parce que le GDD
ne les fixait pas.

## Vue d'ensemble

| État | Signification |
|---|---|
| ✅ | Implémenté conformément au GDD |
| 🟡 | Implémenté, mais plus simple que ce que décrit le GDD (détail plus bas) |
| ⛔ | Volontairement absent (marqué V2, ou hors périmètre d'un prototype) |

## Section par section

| § | Sujet | État | Note |
|---|---|---|---|
| 1 | Concept, trois piliers | ✅ | Repérer / financer / négocier structurent la boucle |
| 2 | 2 curseurs, 40 profils | ✅ | Budget 20 k / 80 k / 200 k / 500 k × 10 paliers |
| 3 | Progression de réputation | ✅ | Seuils cumulés non linéaires, hausses **et** baisses |
| 4.1–4.4 | Sponsors, critères, contreparties, conflits | ✅ | 5 niveaux, exclusivité de secteur bloquante |
| 4.5 | Sponsors personnels vs écurie | ✅ | En F1 le pilote est payé, les sponsors restent |
| 4.6 | Pilotes payants | ✅ | Le budget apporté compense jusqu'à 22 pts de note |
| 5.1 | Potentiel caché | ✅ | Fourchettes, jamais la valeur exacte — y compris pour son propre pilote |
| 5.2 | Réseau de scouts par région | ⛔ | V2 |
| 5.3 | Managers rivaux | ⛔ | V2 — des **pilotes** rivaux persistants existent en revanche |
| 6 | 9 statistiques en 3 groupes | ✅ | |
| 6.4 | Potentiel, agressivité, réputation, moral, forme | ✅ | |
| 7.1 | Traits de personnalité | ✅ | Les 5 du GDD + « Métronome » et « Meneur d'hommes » |
| 7.2 | Vieillissement, retraite, génération suivante | ✅ | La partie continue avec un nouveau pilote |
| 7.3 | Blessures | ⛔ | V2 |
| 7.4 | Entourage du pilote | ⛔ | V2 — un apport familial forfaitaire existe en karting |
| 8.1 | Échelle karting → F1 | ✅ | Les 9 échelons |
| 8.2 | Superlicence, 40 pts / 3 ans | ✅ | Barème FIA simplifié, âge minimum 18 ans |
| 8.3 | Voies alternatives (FE, WEC…) | ⛔ | V2 |
| 9.1 | Écuries fictives | ✅ | Les 4 nommées + 6 autres en F1, écuries propres par catégorie |
| 9.2 | Offres concurrentes, comparaison | ✅ | Colonnes Salaire / Progression / Risque / Prestige |
| 9.3 | Durée, clause de libération, bonus de fidélité | ✅ | Droits à l'image : V2 |
| 9.4 | Négociation en plusieurs tours | ✅ | 5 leviers, risque de retrait croissant |
| 9.5 | Renvoi | ✅ | Bilan toutes les 4 manches, 3 avertissements |
| 10 | Revenus et dépenses du manager | ✅ | |
| 11 | Développement technique, fiabilité | 🟡 | R&D en un seul curseur, pas réparti châssis/aéro/moteur |
| 12 | Météo, stratégie, qualifs, incidents, circuits réels | 🟡 | Stratégie choisie avant le départ, pas d'arrêts au stand tour par tour |
| 13 | Staff | ✅ | Les 4 rôles V1, 5 niveaux ; coach mental et avocat en V2 |
| 14 | Boîte de réception, comparaison coéquipier | ✅ | Récompenses de fin de saison et historique complet : V2 |
| 15 | Un seul pilote en V1 | ✅ | Le multi-pilotes est affiché comme verrouillé |
| 16 | 2D, pas de 3D | 🟡 | Interface données conforme ; podium illustré, portrait évolutif et animations non faits |
| 17.1 | Formule de progression | ✅ | Formule du GDD à l'identique |
| 17.2 | Note globale | ✅ | Pace ×0,40 + Consistency ×0,30 + Racecraft ×0,30 |
| 17.3 | Résultat de course | ✅ | Pilote ×0,40 + Voiture ×0,35 + Réglages ×0,15 + Aléa ×0,10 |
| 18 | Réglages, optimum caché, retour du pilote | ✅ | Le cœur du week-end ; précision indexée sur l'ingénieur |
| 19 | Économie chiffrée, option A | ✅ | L'argent des sponsors ne passe jamais par la poche du manager |
| 20 | Tons, conférence de presse, messages du pilote, relation | ✅ | |
| 21.1 | Course détaillée ou simulation rapide | ✅ | Choix manche par manche |
| 21.2 | 3 formats de week-end | ✅ | Karting / monoplace / F1 |
| 21.3 | Modèle économique | — | Décision reportée, rien à coder |

## Valeurs arbitrées (à reporter dans le GDD si elles conviennent)

Le GDD chiffre le karting en trois lignes (« régional », « national », « KZ »)
alors que §8.1 en compte cinq échelons. Le prototype interpole :

| Catégorie | Coût saison | Courses | Grille | Victoire | Titre |
|---|---|---|---|---|---|
| Karting Mini | 8 000 € | 6 | 24 | 300 € | 1 500 € |
| Karting Cadet | 14 000 € | 6 | 24 | 400 € | 2 200 € |
| Karting Junior | 22 000 € | 7 | 26 | 800 € | 4 000 € |
| Karting Senior | 35 000 € | 8 | 28 | 1 500 € | 8 000 € |
| Karting KZ | 100 000 € | 8 | 28 | 3 000 € | 15 000 € |
| F4 | 250 000 € | 15 | 22 | 3 000 € | 30 000 € |
| F3 | 900 000 € | 18 | 26 | 15 000 € | 150 000 € |
| F2 | 2 500 000 € | 24 | 22 | 40 000 € | 400 000 € |
| F1 | 0 € | 24 | 20 | salaire | — |

Autres arbitrages :

- **`GAIN_SAISON = 12`, réparti sur le nombre de manches.** Sans cette
  normalisation, une saison de F2 (24 courses) ferait progresser un pilote
  quatre fois plus qu'une saison de karting (6 courses).
- **Niveau exigé par catégorie** (table absente du GDD, mais indispensable) :
  Mini 32 → Cadet 40 → Junior 48 → Senior 55 → KZ 61 → F4 67 → F3 74 → F2 81 → F1 87.
  C'est ce qui fait qu'un pilote au plafond « Moyen » (78) plafonne en F3/F2 et
  ne s'impose jamais en F1, exactement comme prévu au §17.1.
- **Réglages** : chaque paramètre est sur une échelle 1–20 ;
  `Réglages = 100 × (1 − min(1, écartMoyen/9)^1,25)`.
- **Faillite** à −60 000 € de trésorerie.
- **Sponsors** versés par tranches à chaque manche ; la part conditionnelle
  (30 % quand il y a un objectif de résultat) n'est payée qu'en fin de saison.
- **Actions du manager** : 3 par semaine entre deux manches, 6 en intersaison.
- **Renvoi** : l'écurie fait le point toutes les 4 manches, 3 avertissements
  entraînent la rupture — un renvoi est donc impossible sur une saison de
  karting à 6 manches, ce qui est cohérent.

## Ce que les tests ont montré sur l'équilibrage

Un joueur automatique a été écrit pour jouer des carrières complètes
(`docs/` ne le contient pas : c'est un outil de test, pas du code de jeu).
Sur 8 profils × 8 carrières de 15 saisons, avec une politique de staff saine
(masse salariale indexée sur les commissions récentes) :

| Profil | Faillites | Atteint la monoplace | Atteint la F1 | Titres (moy.) |
|---|---|---|---|---|
| Budget faible / Inconnu | 1/8 | 5/8 | 0/8 | 4,5 |
| Budget faible / International | 1/8 | 7/8 | 6/8 | 10,8 |
| Budget moyen / Régional | 0/8 | 8/8 | 3/8 | 6,9 |
| Budget très élevé / Inconnu | 0/8 | 4/8 | 0/8 | 2,5 |
| Budget très élevé / International | 0/8 | 8/8 | 7/8 | 12,9 |

Deux enseignements conformes à l'intention du GDD :

1. **La réputation compte plus que l'argent.** « Budget très élevé / Inconnu »
   ne survit financièrement sans jamais accéder aux bons talents ni aux gros
   sponsors ; « Budget faible / International » atteint la F1 6 fois sur 8.
2. **Le staff est le piège du karting.** Une carrière testée a brûlé 575 000 €
   de salaires pour 18 000 € de commissions sur trois saisons de karting avant
   la faillite. C'est exactement le scénario du §19.9 ; le jeu affiche
   désormais un avertissement quand la masse salariale dépasse les commissions.

## Ce qui reste à faire avant de parler de « jeu »

- Le podium illustré, le portrait de pilote évolutif et les animations du §16.
- Le développement technique réparti sur trois axes (§11).
- Les arrêts aux stands décidés en course (§12).
- Tout le périmètre V2, à commencer par le multi-pilotes (§15) qui est la
  suite logique une fois la boucle validée.
