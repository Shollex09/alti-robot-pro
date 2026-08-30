# État du prototype — correspondance avec le GDD v0.7

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
| 8.2 | Conditions de changement de catégorie | ✅ | Les 3 conditions cumulatives, la voie du pilote payant, la descente |
| 8.3 | Superlicence, 40 pts / 3 ans | ✅ | Barème du §8.3 repris tel quel, âge minimum 18 ans |
| 8.4 | Voies alternatives (FE, WEC…) | ⛔ | V2 |
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
| 18 | Réglages, optimum caché, retour du pilote | ✅ | Le cœur du week-end ; précision indexée sur l'ingénieur. Chaque run essayé reste rappelable avant la course |
| 19 | Économie chiffrée, option A | ✅ | L'argent des sponsors ne passe jamais par la poche du manager |
| 20 | Tons, conférence de presse, messages du pilote, relation | ✅ | 20 questions de presse, tirées selon le résultat, avec leurs propres réponses |
| 21.1 | Course détaillée ou simulation rapide | ✅ | Choix manche par manche |
| 21.2 | 3 formats de week-end | ✅ | Karting / monoplace / F1 |
| 21.3 | Modèle économique | — | Décision reportée, rien à coder |
| 22 | Structure du manager (locaux, académie, Team Principal) | ⛔ | V2 / V3 |
| 23 | Direction artistique et interface | ⛔ | V2 — le §23.1 demande explicitement de ne pas y toucher avant validation du gameplay |

## §8.2 — comment les trois conditions sont codées

Le GDD décrit 6 paliers pour les 9 échelons de l'échelle §8.1. Les trois premiers
passages de karting partagent la ligne « régional → national » :

| Catégorie visée | Résultat exigé | Superlicence | Âge conseillé |
|---|---|---|---|
| Karting Cadet | Top 5 | — | 10-13 |
| Karting Junior | Top 5 | — | 10-14 |
| Karting Senior | Top 5 | — | 12-16 |
| Karting KZ | Top 3 | — | 13-15 |
| F4 | Top 5 en KZ, ou titre | — | 15-17 |
| F3 | Top 6 | 12 pts | 17-19 |
| F2 | Top 5 | 25 pts | 18-21 |
| F1 | Top 4 | 40 pts | 19-24 |

- **Condition 1, le résultat sportif** : filtre les offres de montée avant même
  qu'une écurie se manifeste.
- **Condition 2, le budget sécurisé** : seuls les sponsors sous contrat comptent
  (option A du §19.1 — la trésorerie du manager n'est pas le budget du pilote).
  Si l'apport n'est pas couvert mais que la trésorerie comble le manque, la
  signature reste possible en se portant garant, avec un avertissement explicite ;
  sinon elle est refusée et le jeu renvoie vers l'onglet Sponsors.
- **Condition 3, une écurie disposée** : c'est l'existence d'une offre. L'âge
  conseillé y joue : hors fenêtre, l'appétit des écuries chute, et un pilote qui
  reste 3 saisons ou plus dans la même catégorie perd encore en attractivité.

**Voie du pilote payant** : le budget sécurisé assouplit le résultat exigé de
`min(6, budget / coût de la saison × 6)` places. Il n'assouplit **jamais** la
superlicence, à aucun palier — le GDD ne l'autorise explicitement que pour le
résultat sportif, et présente les 40 points de F1 comme une règle FIA. Cette
lecture stricte est à confirmer si vous vouliez que l'argent puisse aussi acheter
les 12 et 25 points de F3 et F2.

**Descente** : quand aucune offre ne vient, le baquet de secours redescend jusqu'à
la première catégorie réellement finançable, chez l'écurie la plus modeste, qui
prend 35 % du budget à sa charge. Le bas de l'échelle est toujours accessible :
il n'existe aucune situation sans issue.

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
- **Temps de piste** : 5 runs d'essais par week-end (6 en F1), plus 1 par
  tranche de 2 niveaux d'ingénieur de course — soit 5 à 7. Le §18 ne chiffrait
  pas ce budget ; à 3 runs, trouver un réglage à 4 paramètres relevait du hasard.
  Chaque run essayé est conservé et peut être remonté sur la voiture à tout
  moment du week-end, y compris une fois le temps de piste épuisé.
- **Fatigue** : plusieurs semaines séparent deux manches, le pilote récupère
  donc `9 + 2,5 × niveau du préparateur` entre chaque course. Sans cette
  récupération, un manager qui utilise tout son temps de piste voyait la
  fatigue saturer à 100 dès la 6e manche — il était puni d'utiliser la
  fonctionnalité. Un run d'essais coûte désormais 0 à 2 points de fatigue
  (contre 1 à 3), une course 6 à 12, une séance d'entraînement 7 à 13.
  Sur une saison de 24 manches : fatigue finale ~32 sans rien forcer, 100 en
  s'entraînant chaque semaine sans préparateur, ~46 avec un préparateur moyen.
- **Écart de matériel entre écuries** : il se creuse en montant l'échelle —
  15 points d'écart en karting, 20 en F4, 24 en F3, 27 en F2, 40 en F1. En
  karting les châssis sont proches et tout se joue au pilote ; en F1 la voiture
  décide largement. Mesuré : un pilote noté 85 gagne en Karting Junior quelle que
  soit son écurie, tandis qu'un pilote noté 92 en F3 finit 1,6e avec la meilleure
  voiture et 15,2e avec la plus faible. C'est le §17.3 rendu lisible.
- **Simulation rapide** : l'ingénieur règle seul, à `54 + 5,5 × niveau ± 6`,
  soit au niveau des écuries adverses ou juste en dessous. Travailler les essais
  soi-même reste le seul moyen de dépasser 90.
- **Réglages de l'IA** : `62 + 0,55 × (voiture − 60) ± 7`. Les écuries adverses
  ont elles aussi des ingénieurs et le même temps de piste ; sans ce
  relèvement, le joueur passé à 5-7 runs se retrouvait seul à bien régler sa
  voiture et les 40 profils de départ se mettaient à se ressembler.
- **Ce que chaque niveau d'ingénieur achète** (GDD §18.3). Le principe : sans
  ingénieur, il n'existe aucune *mesure* du réglage — seulement le ressenti du
  pilote, qui se trompe. C'est ce qui justifie le salaire.

  | Niveau | Sensations remontées | Seuil de détection | Ce qu'il dit | Mesure du réglage |
  |---|---|---|---|---|
  | 0 (gratuit) | 2 | 4 crans | le symptôme seul | un ressenti (« il n'est pas à l'aise ») |
  | 1 | 2 | 4 crans | le symptôme seul | ressenti, ± 9 |
  | 2 | 3 | 3 crans | + le correctif | ressenti, ± 7 |
  | 3 | 4 | 2 crans | + le correctif | fourchette ± 5 |
  | 4 | tous | 2 crans | + l'ampleur en crans | fourchette ± 2,5 |
  | 5 | tous | 1 cran | + l'ampleur exacte | le chiffre exact |

  Mesuré sur un joueur qui suit son pilote et l'aide-mémoire : réglage final de
  81/100 sans ingénieur, 90 au niveau 2, 97 au niveau 3, 99 au niveau 4, 100 au
  niveau 5. Courbe croissante à rendements décroissants — le dernier niveau coûte
  12 000 €/mois pour trois points.

  Un aide-mémoire symptôme → paramètre est affiché en permanence pendant les
  essais : c'est de la connaissance métier, pas l'information cachée du §18
  (laquelle reste la *valeur* optimale du circuit).
- **Conférence de presse** : 20 questions réparties en 6 situations (victoire,
  podium, points, course neutre, contre-performance, abandon), tirées au sort
  sans répétition immédiate. Chaque question porte ses propres réponses : une
  victoire ne propose pas « reconnaître l'échec ». Les effets restent ceux du
  §20.2 sur les trois mêmes jauges, via une table de 8 postures.

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

## Retours de test et suites données

Premier passage de jeu réel par l'auteur, deux points remontés, tous deux corrigés :

1. **« Même quand il y a de bons résultats les commentaires de la presse sont
   les mêmes. »** Exact : il n'y avait qu'une seule question par type de
   résultat, et les quatre mêmes réponses pour toutes. Remplacé par un tirage
   dans 20 questions situées, chacune avec ses réponses propres.
2. **« Trois essais pour trouver la combinaison, c'est très dur. »** Exact
   aussi, surtout en karting : 4 paramètres × 20 crans en 3 runs, sans
   ingénieur pour orienter. Temps de piste porté à 5-7 runs, meilleur réglage
   rappelable d'un bouton avant les qualifs et avant la course, et
   aide-mémoire symptôme → paramètre affiché en permanence.

Deux effets de bord mesurés et corrigés dans la foulée.

Le premier : avec 5-7 runs, le joueur était le seul de la grille à bien régler
sa voiture, et les profils de départ se sont mis à se ressembler — « budget
très élevé / Inconnu », qui n'atteignait jamais la F1, y arrivait une fois sur
deux. Le niveau de réglage des écuries adverses a été relevé en conséquence :
travailler ses essais reste très payant (18,5e de moyenne en négligeant les
réglages, 11,4e en les travaillant, soit 7 places d'écart), mais la piste n'est
plus au joueur tout seul. Après correction, « budget très élevé / Inconnu »
retombe à 2,0 titres par carrière contre 2,5 avant les deux fonctionnalités.

À noter pour l'équilibrage : un réglage à 95/100 vaut autant qu'à 100/100
(11,4e contre 12,4e, l'écart est du bruit). Chercher la combinaison parfaite
n'est pas nécessaire, ce qui répond au fond du retour initial.

Le second : un défaut qui existait déjà, mais que 3 runs masquaient :
**rien ne faisait récupérer le pilote entre deux manches.** En utilisant les
nouveaux runs, la fatigue saturait à 100 dès la 6e course et la forme tombait
à 41 pour le reste de la saison — le joueur était puni d'utiliser la
fonctionnalité qu'il venait de demander. Corrigé par une récupération passive
entre les manches, avec un test de non-régression dédié.

## Deuxième passage de jeu, retours et suites

1. **« L'ingénieur ne me sert à rien. »** Exact, et c'était structurel : le score
   du réglage était affiché en clair (« Réglages 88/100 ») à chaque run. On
   pouvait donc optimiser au chiffre sans jamais lire le pilote, ce qui annulait
   la raison d'être du poste. La mesure est devenue un service de l'ingénieur —
   voir la table ci-dessus. S'y ajoutait une incohérence : au niveau 2 le pilote
   nommait bien le correctif, mais le commentaire affirmait que l'ingénieur
   « reste évasif ». Les seuils des deux textes sont désormais alignés.

2. **Le vivier proposait des pilotes non finançables** (levier 2 activé à la
   demande). Un manager de réputation 5 disposant de 20 000 € se voyait offrir un
   pilote déjà engagé en F3, dont la saison coûte 900 000 €. Le vivier ne propose
   plus de pilote installé que si sa catégorie est finançable au regard de la
   trésorerie et du potentiel de sponsors du palier de réputation. Effet mesuré
   sur le profil « budget faible + réputation 5 » : de 7 faillites sur 10 à 2 sur 8,
   avec 6 accès à la F1 sur 8. À réputation 9, les pilotes de F2 restent proposés,
   puisque le potentiel de sponsors couvre réellement la saison — le profil
   « budget faible + International » du §2.2 garde donc tout son intérêt.

## Suites données au GDD v0.7

La v0.7 apporte une seule mécanique [V1] nouvelle, le **§8.2**, implémentée ici.
Le §22 (locaux, académie, Team Principal) est marqué V2/V3. Le §23 (direction
artistique, référence Motorsport Manager) est marqué V2 et son §23.1 demande
explicitement que l'interface ne soit pas travaillée avant validation du
gameplay : le prototype garde donc son habillage actuel, qui diverge de la
référence visuelle (accent rouge plutôt que turquoise, pas de découpes en
diagonale). C'est un écart assumé, à traiter le jour où le §23 passera en chantier.

L'implémentation du §8.2 a révélé deux défauts du modèle de course, tous deux
corrigés :

1. **L'écart de matériel entre écuries de karting était aussi large qu'en F1**
   (57 à 88). Conséquence : un pilote noté 86 finissait 11e en KZ contre un
   plateau à 61. Une fois le §8.2 en place, ce défaut devenait bloquant — le
   résultat sportif exigé pour monter devenait inatteignable pour qui n'avait pas
   le meilleur matériel, même en karting.
2. **La simulation rapide donnait au joueur des réglages à 34-44** alors que les
   écuries adverses venaient d'être relevées à 62-85. Un tiers des carrières de
   test tournaient avec 30 points de handicap sur une variable qui pèse 15 % de
   la performance, ce qui invalidait les mesures d'équilibrage précédentes.
3. **Le baquet de secours pouvait renvoyer un pilote de 17 ans en Karting Mini**,
   dont la limite d'âge est 13 ans. La descente respecte désormais un plancher
   d'âge : un pilote de 17 ans ne redescend pas plus bas que le Karting Junior,
   un pilote de 24 ans pas plus bas que la KZ.

Le profil « budget faible + réputation 5 » faisait faillite dans 8 cas sur 8 :
à ce palier le vivier propose un pilote déjà engagé en F3 (900 k€ de saison) à
un manager qui dispose de 20 k€. Signer ce pilote est un piège que le §8.2 rend
maintenant visible avant la signature — et la descente corrigée offre une porte
de sortie crédible. Le profil retombe à 4 faillites sur 8, avec 4 accès à la F1 :
dur, comme le §2.2 l'annonce pour cette combinaison, mais jouable.

## Ce qui reste à faire avant de parler de « jeu »

- Le podium illustré, le portrait de pilote évolutif et les animations du §16.
- Le développement technique réparti sur trois axes (§11).
- Les arrêts aux stands décidés en course (§12).
- Tout le périmètre V2, à commencer par le multi-pilotes (§15) qui est la
  suite logique une fois la boucle validée.
