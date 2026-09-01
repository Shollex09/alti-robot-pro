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
| 5.2 | Réseau de scouts par région | ✅ | Huit régions, antennes payantes, écoles de pilotage locales |
| 5.3 | Managers rivaux | ✅ | Six managers IA signent dans le même vivier ; convoitise annoncée, classement des managers |
| 6 | 9 statistiques en 3 groupes | ✅ | |
| 6.4 | Potentiel, agressivité, réputation, moral, forme | ✅ | |
| 7.1 | Traits de personnalité | ✅ | Les 5 du GDD + « Métronome » et « Meneur d'hommes » |
| 7.2 | Vieillissement, retraite, génération suivante | ✅ | La partie continue avec un nouveau pilote |
| 7.3 | Blessures | ✅ | Cinq blessures, gravité liée à la catégorie, forfaits et convalescence |
| 7.4 | Entourage du pilote | ✅ | Quatre entourages : plus la famille paie, plus elle décide |
| 8.1 | Échelle karting → F1 | ✅ | Les 9 échelons |
| 8.2 | Conditions de changement de catégorie | ✅ | Les 3 conditions cumulatives, la voie du pilote payant, la descente |
| 8.3 | Superlicence, 40 pts / 3 ans | ✅ | Barème du §8.3 repris tel quel, âge minimum 18 ans |
| 8.4 | Voies alternatives | ✅ | Formule E, Endurance, IndyCar, Super Formula — le pilote y est payé |
| 9.1 | Écuries fictives | ✅ | Les 4 nommées + 6 autres en F1, écuries propres par catégorie |
| 9.2 | Offres concurrentes, comparaison | ✅ | Colonnes Salaire / Progression / Risque / Prestige |
| 9.3 | Durée, clause de libération, bonus de fidélité | ✅ | Droits à l'image : V2 |
| 9.4 | Négociation en plusieurs tours | ✅ | 5 leviers, risque de retrait croissant |
| 9.5 | Renvoi | ✅ | Bilan toutes les 4 manches, 3 avertissements |
| 10 | Revenus et dépenses du manager | ✅ | |
| 11 | Développement technique, fiabilité | ✅ | R&D répartie sur trois axes, pondérés par le type de circuit |
| 12 | Météo, stratégie, qualifs, incidents, circuits réels | ✅ | Stratégie avant le départ **et** un arbitrage à mi-course |
| 13 | Staff | ✅ | Les 4 rôles V1, 5 niveaux ; coach mental et avocat en V2 |
| 14 | Boîte de réception, comparaison coéquipier | ✅ | Récompenses de fin de saison et historique complet : V2 |
| 15 | Nombre de pilotes gérés (déblocage par réputation) | ✅ | Table complète : 1 / 2 / 3 / 5 pilotes selon le palier, calendrier commun |
| 16 | 2D, pas de 3D | ✅ | Portrait de pilote généré et vieillissant, podium illustré, scène de signature, animations sobres |
| 17.1 | Formule de progression | ✅ | Formule du GDD à l'identique |
| 17.2 | Note globale | ✅ | Pace ×0,40 + Consistency ×0,30 + Racecraft ×0,30 |
| 17.3 | Résultat de course | ✅ | Pilote ×0,40 + Voiture ×0,35 + Réglages ×0,15 + Aléa ×0,10 |
| 18 | Réglages, optimum caché, retour du pilote | ✅ | Le cœur du week-end ; précision indexée sur l'ingénieur. Chaque run essayé reste rappelable avant la course |
| 19 | Économie chiffrée, option A | ✅ | L'argent des sponsors ne passe jamais par la poche du manager |
| 20 | Tons, conférence de presse, messages du pilote, relation | ✅ | 20 questions de presse, tirées selon le résultat, avec leurs propres réponses |
| 21.1 | Course détaillée ou simulation rapide | ✅ | Choix manche par manche |
| 21.2 | 3 formats de week-end | ✅ | Karting / monoplace / F1 |
| 21.3 | Modèle économique | — | Décision reportée, rien à coder |
| 22.1 | Locaux et bureaux | ✅ | Quatre locaux à trois niveaux ; ils conditionnent la capacité de gestion |
| 22.2 | Académie de pilotes | ✅ | Formation d'enfants de 8 à 12 ans, potentiel réel connu, revente |
| 22.3 | Devenir Team Principal en F1 | ⛔ | V3 — le GDD l'écarte lui-même du périmètre |
| 23.1 | Interface après validation du gameplay | ✅ | Condition remplie : la boucle a été jouée et validée avant d'y toucher |
| 23.2 | Référence visuelle Motorsport Manager | ✅ | Découpes en diagonale, vignettes, densité réduite sur l'accueil |

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
- **L'âge est une quatrième ligne affichée**, et la table du §8.2 en est la seule
  source de vérité (`ageAutoriseMontee`). Les bornes d'âge des catégories, écrites
  avant le §8.2, ne servent plus qu'à peupler les grilles adverses et à borner la
  descente. On tolère un an avant la fenêtre conseillée, pour les talents précoces.

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
- **Temps de piste** : 3 runs d'essais par week-end (4 en F1), plus 1 par
  tranche de 2 niveaux d'ingénieur de course — soit 3 à 6. Le §18 ne chiffrait
  pas ce budget. Trois runs sont volontairement courts : quand c'est trop juste,
  la réponse est de recruter un ingénieur, qui achète à la fois du temps de piste
  et de la précision. Chaque run essayé est conservé et peut être remonté sur la
  voiture à tout moment du week-end, y compris une fois le temps de piste épuisé.
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

  Mesuré sur un joueur qui suit son pilote et l'aide-mémoire, temps de piste
  inclus : 3 runs et 75/100 sans ingénieur, 4 runs et 81 au niveau 1, 4 et 89 au
  niveau 2, 5 et 97 au niveau 3, 5 et 99 au niveau 4, 6 runs et 100 au niveau 5.
  Courbe croissante à rendements décroissants — le dernier niveau coûte
  12 000 €/mois pour un demi-point.

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
   ingénieur pour orienter. Meilleur réglage rappelable d'un bouton avant les
   qualifs et avant la course, et aide-mémoire symptôme → paramètre affiché en
   permanence. Le temps de piste avait été porté à 5-7 runs, puis **ramené à 3**
   au passage suivant : une fois le rappel et l'aide-mémoire en place, l'auteur a
   jugé 3 essais satisfaisants, l'ingénieur devenant la réponse quand c'est trop
   juste. Les runs supplémentaires sont donc passés du barème de base au barème
   de l'ingénieur.

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

## §11 — la R&D répartie sur trois axes

Le §11 veut un « budget R&D réparti entre châssis, aérodynamique, moteur ».
C'était un curseur unique qui montait la performance de la voiture, sans choix.

Trois axes désormais, et chaque type de circuit en privilégie un :

| Type de circuit | Châssis | Aéro / train roulant | Moteur |
|---|---|---|---|
| Rapide | 15 % | 20 % | **65 %** |
| Technique | **55 %** | 35 % | 10 % |
| Mixte | 34 % | 33 % | 33 % |

En karting, l'axe « aérodynamique » devient « train roulant » — il n'y a pas
d'aéro sur un kart. Le calendrier étant connu d'avance, la modale affiche le
mix des circuits restants et nomme l'axe le plus rentable.

**Deux pièges rencontrés en réglant ça, et qui méritent d'être notés :**

1. La première version ajoutait un rendement décroissant *par axe*. Résultat
   mesuré : cibler le bon axe ne rapportait strictement rien de plus que
   répartir également (71,63 contre 71,70). C'est mathématique — comme les poids
   somment à 1, répartir capte 100 % de chaque euro, alors que se spécialiser
   n'en capte que le poids de l'axe. Le rendement décroissant par axe empêchait
   la concentration de compenser. Il a été retiré ; seul le rendement sur la
   dépense totale subsiste.
2. Ce rendement global était une pénalité *linéaire*, qui finissait par passer
   sous zéro : après quelques investissements, un euro de plus ne rapportait
   plus rien du tout, même sur un axe vierge. Remplacé par une décroissance
   asymptotique, qui ralentit sans jamais annuler.

Effet mesuré après correction, base de voiture 70 en F3 :

| Part du budget de saison | Mauvais axe | Répartition égale | Bon axe |
|---|---|---|---|
| 5 % | 71,2 | 71,4 | 71,5 |
| 15 % | 72,9 | 73,3 | 73,7 |
| 30 % | 74,7 | 75,2 | 75,8 |

Sur un calendrier **homogène** (tous les circuits rapides), l'écart devient
décisif : 80,2 en ciblant le moteur contre 75,2 en répartissant et 72,3 en se
trompant d'axe. Lire son calendrier paie quand il est tranché, et le choix est
presque neutre quand il est équilibré — c'est la forme recherchée.

En karting l'effet reste dérisoire (moins d'un point), faute de budget : c'est
cohérent avec le §19.8, où la phase 1 est celle de la survie.

Le coût est réel : la R&D se paie sur la caisse de saison, donc elle concurrence
directement le paiement des manches. Mesuré sur 24 carrières, avec et sans R&D :
+0,3 à +0,8 titre par carrière quand on peut se le permettre, et une faillite
supplémentaire sur le profil le plus serré.

## §11 — la réglementation évolutive

Le §11 demandait aussi, en V2, des « changements de règles (aéro, plafond
budgétaire) d'une saison à l'autre, obligeant à réadapter la stratégie ».

La fédération publie désormais un règlement technique par saison, dans **deux
univers séparés** : le karting et la monoplace (les voies alternatives du §8.4
courent sous le règlement monoplace). Un règlement aéro n'a aucun sens sur un
kart, un châssis homologué unique n'en a aucun en F1.

Dix règlements, chacun déplaçant un curseur sur lequel le joueur avait bâti sa
saison précédente :

| Règlement | Univers | Ce qu'il change |
|---|---|---|
| Règlement inchangé | les deux | rien — toutes les saisons ne sont pas une remise à plat |
| Refonte aérodynamique | monoplace | plateau resserré de 42 %, l'aéro pèse ×1,7 et le moteur ×0,5, engagement +8 % |
| Gel des moteurs | monoplace | axe moteur bloqué à 4, châssis et aéro revalorisés, fiabilité +3, engagement −6 % |
| Plafond budgétaire | les deux | R&D plafonnée à 15 % du budget d'engagement, plateau resserré de 30 %, engagement −14 % |
| Dérégulation technique | monoplace | plafond d'axe porté à 26, écarts entre écuries **creusés** de 30 %, engagement +16 % |
| Nouveau manufacturier | les deux | usure ×1,4, incidents ×1,15, fiabilité −2 |
| Renforcement sécurité | les deux | blessures ×0,45, incidents ×0,82, engagement +7 % |
| Quota de propulseurs | monoplace | fiabilité −6, le moteur repasse ×1,4 |
| Châssis homologué unique | karting | plateau resserré de 55 %, axe châssis bloqué à 5 |
| Moteur homologué unique | karting | plateau resserré de 35 %, axe moteur bloqué à 4, fiabilité +4 |

**Le règlement tombe à l'intersaison, avant les offres de baquet et avant le
premier euro de R&D.** C'est la condition pour qu'on puisse s'y adapter au lieu
de le subir : sous une refonte aéro, une écurie modeste redevient jouable ; sous
une dérégulation, prendre le baquet le moins cher condamne la saison.

Une règle tient **environ deux saisons** (50 % de chance de changer chaque
intersaison, mesuré 0,49 sur 600 tirages) et un tirage ne redonne jamais celle
qui est en place — sans quoi « évolutive » ne veut rien dire.

### Trois points d'implémentation qui n'étaient pas évidents

1. **Le règlement d'une saison est figé à l'engagement**, comme le nombre de
   manches l'avait été pour le §15. Sans ce gel, un changement de règles à
   l'intersaison réécrivait rétroactivement une saison encore ouverte dans un
   autre dossier : avec plusieurs pilotes, les saisons ne se terminent pas
   toutes en même temps.
2. **Les poids de R&D sont renormalisés.** Un règlement redistribue la valeur
   entre les trois axes, il ne rend pas la R&D globalement plus ou moins
   rentable. Sans renormalisation, « refonte aérodynamique » aurait
   silencieusement affaibli toute la R&D de 21 % sur un tracé rapide, ce que
   rien n'annonçait au joueur.
3. **Un axe au plafond refuse désormais l'argent** au lieu de le rogner en
   silence. C'était déjà vrai du plafond ordinaire (18) : on pouvait investir
   200 000 € sur un axe saturé et ne rien recevoir. La modale grise les
   montants au-dessus du plafond budgétaire restant et remplace les boutons
   d'un axe bloqué par « Axe au plafond — plus rien à en tirer ».

### Effet mesuré

Casse mécanique du pilote sur 150 saisons de F3 par règlement (≈1 500 manches
chacune, la fiabilité et l'usure étant les seuls canaux assez peu bruités pour
être mesurés à cette échelle) :

| Règlement | Casse mécanique | Abandons toutes causes |
|---|---|---|
| Inchangé | 6,0 % | 13,3 % |
| Nouveau manufacturier | 9,7 % | 16,3 % |
| Quota de propulseurs | 9,6 % | 16,8 % |
| Gel des moteurs | 4,0 % | 10,7 % |

Sur le plateau, l'écart entre la meilleure et la pire écurie de karting passe de
15 points à 7 sous châssis unique ; en F1, la dérégulation le fait au contraire
grimper.

Sur l'équilibrage général, 8 profils × 8 carrières × 15 saisons, avec le même
bot dans les deux cas — une fois le règlement figé sur « inchangé », une fois
tiré normalement :

| | Règlement figé | Réglementation active |
|---|---|---|
| Faillites | 6 / 64 | 2 / 64 |
| Accès à la monoplace | 6–8 / 8 | 6–8 / 8 |
| Accès à la F1 | 1–8 / 8 | 1–8 / 8 |
| Titres par carrière | 7,5 à 11,4 | 8,5 à 11,3 |

**La conclusion honnête est qu'à cette taille d'échantillon on ne les distingue
pas** : le bruit entre deux séries de 8 carrières est plus grand que l'effet. La
réglementation ajoute de la variance saison par saison — une année de
dérégulation coûte 16 % de plus, une année de plafond 14 % de moins — sans
déplacer l'enveloppe de la carrière. C'était l'intention : réadapter sa
stratégie, pas subir un handicap.

### Test

`unit20.js` : 81 assertions sur le catalogue, le tirage (couverture complète des
deux catalogues, jamais deux fois la même règle d'affilée, durée moyenne), le
gel du règlement dans une saison en cours, le resserrement et le creusement du
plateau, la fiabilité, la conservation de la somme des poids de R&D pour chaque
règlement et chaque type de circuit, les plafonds d'axe, le plafond budgétaire
(y compris le fait que la caisse ne soit débitée que de ce qui a été accepté),
le coût d'engagement (y compris l'apport réclamé au joueur dans les offres de
baquet, qui doit suivre le coût réglementaire), les blessures, la casse mesurée
sur 600 saisons, la migration d'une partie antérieure et douze intersaisons
enchaînées.
`browser10.js` vérifie dans le navigateur l'encart du tableau de bord, les axes
plafonnés, le grisage des montants au-delà du plafond budgétaire et l'arrivée
des annonces dans la messagerie.

Le bot de carrière a été mis au niveau en même temps : il lit maintenant les
poids corrigés, évite les axes bloqués et respecte le plafond budgétaire. Sans
cette mise à jour, la mesure d'équilibrage aurait décrit un joueur qui ignore le
règlement, pas un joueur compétent.

## §12 — la décision de mi-course

Le §12 demande que la stratégie se décide « avant **et pendant** la course ».
Seul l'avant existait : une course détaillée se résumait à un bouton Départ,
ce qui lui ôtait tout intérêt face à la simulation rapide du §21.1.

La course se joue désormais en deux temps. On prépare la grille et les
performances, le manager arbitre un événement à mi-course, puis on résout. Cinq
événements, tirés selon la situation réelle de la course :

| Événement | Se déclenche | Options |
|---|---|---|
| Voiture de sécurité | neutralisation, hors karting | rentrer au stand / rester en piste |
| La pluie arrive | piste évolutive | changer maintenant / attendre un tour |
| La piste sèche | course sous la pluie | repasser en slicks / finir sur ces pneus |
| Usure des pneus | toujours disponible | gérer / pousser |
| Bagarre pour la position | dans les premiers | tenter / suivre / assurer |

Chaque option modifie la performance de la seconde moitié et le risque
d'abandon. Deux d'entre elles dépendent du pilote : tenter un dépassement paie
selon son Dépassement, attendre sous la pluie selon son Adaptabilité — de quoi
rendre les statistiques du §6 lisibles au moment où elles comptent.

Mesuré sur 120 courses, en forçant l'une puis l'autre option : 18,9e de moyenne
avec 54 arrivées sur 60 d'un côté, 16,1e avec 47 arrivées sur 60 de l'autre.
Le compromis position / risque est donc réel sans qu'une option domine.

Le karting ne se voit jamais proposer d'arrêt au stand, et la simulation rapide
n'est jamais interrompue — c'est ce qui distingue les deux modes du §21.1.

## §12 — les essais libres

Le §12 demandait aussi, en V2, un « week-end complet en trois temps (EL /
Qualifs / Course) ».

La séance existait de nom — et seulement en F1, où elle dupliquait purement et
simplement l'écran des essais de réglages. Un clic pour rien.

Elle porte maintenant **une décision, et une seule** : quatre programmes, un
seul choix, aucune marche arrière, et des effets qui courent sur tout le reste
du week-end.

| Programme | Ce qu'il fait |
|---|---|
| 🔧 Travail des réglages | un run d'essais supplémentaire |
| 🗺️ Repérage du tracé | le bruit de mesure sur le retour du stand tombe à 40 % |
| ⏱️ Simulation de course | casse mécanique ×0,82 et +1,2 de rythme en course |
| 🛑 Séance au ralenti | risque d'accrochage ×0,78, et le pilote récupère 6 de fatigue |

Le week-end passe donc à trois temps en karting (EL / Essais / Course) et à
quatre en monoplace (EL / Essais / Qualifs / Course), au lieu de deux et trois.

**Trois choix de conception qui méritent d'être notés :**

1. **On ne quitte pas la séance sans avoir décidé.** `etapeSuivante` refuse
   d'avancer tant qu'aucun programme n'est retenu, et l'écran ne propose aucun
   bouton « passer ». Sans cela, la séance redevenait exactement ce qu'on
   voulait supprimer : un clic pour rien.
2. **La simulation rapide ne choisit aucun programme.** Elle n'en tire donc
   aucun bénéfice. C'est la contrepartie du §21.1 : simuler reste plus rapide,
   jouer reste plus payant.
3. **Un seul programme est conseillé à la fois, et il dit pourquoi.** La
   première version en marquait trois sur quatre comme « conseillé ici », ce
   qui ne conseillait plus rien. Le conseil regarde maintenant l'état réel :
   fatigue au-dessus de 55 → séance au ralenti ; pas d'ingénieur → repérage ;
   catégorie de niveau 4 ou plus → simulation de course ; sinon réglages.

Les effets ne valent que pour notre voiture : la grille adverse n'en profite
jamais.

### Effet mesuré

Sur le repérage du tracé, écart moyen entre le score réel d'un réglage et le
score affiché au stand, ingénieur de niveau 2, sur 30 week-ends chacun :
**2,96 sans repérage contre 1,28 avec** — soit une lecture deux fois plus juste.
Vérifié aussi dans le navigateur (2,96 → 1,28 sur 40 week-ends).

Sur la course, en rejouant 12 000 fois la même manche en ne changeant que le
programme retenu :

| Programme | Casse mécanique | Accrochages |
|---|---|---|
| Aucun | 6,6 % | 6,0 % |
| ⏱️ Simulation de course | 5,5 % | 6,0 % (inchangé) |
| 🛑 Séance au ralenti | 6,6 % (inchangée) | 4,4 % |

(40 000 résolutions par ligne. Le tableau se lit dans les deux sens : chaque
programme agit sur son canal et laisse l'autre intact, ce que le test vérifie.)

### Test

`unit21.js` : 48 assertions sur la structure du week-end dans les quatre
formats, le catalogue, le refus d'avancer sans programme, le run supplémentaire,
l'atténuation du bruit de mesure (y compris son affichage en fourchette et le
cas de l'ingénieur au sommet, où il n'y a rien à atténuer), la fatigue dans les
deux sens, les effets en course mesurés par résolution directe, l'absence
d'effet sur la grille adverse, la neutralité de la simulation rapide, une saison
complète jouée de bout en bout en karting, F3, F1 et endurance, et la reprise
d'un week-end enregistré avant le §12 — ancien format d'étapes, aucun
programme — qui doit rester jouable tel quel.
`browser11.js` rejoue la séance par de vrais clics et vérifie le week-end
complet.

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

## Troisième passage de jeu : une montée bloquée en silence

**« Je ne peux pas dépasser le Karting Junior, j'ai déjà gagné 3 fois. »**
Diagnostic à pilote constant, 200 tirages par facteur : les sponsors n'y étaient
pour rien, le nombre de titres non plus. **C'était l'âge — 0 % d'offres à 12 et
13 ans, 98 % dès 14 ans.**

Deux tables se contredisaient. La fenêtre du §8.2 pour le Karting Senior est
12-16 ans, et le panneau l'affichait ainsi ; mais la génération d'offres lisait
`ageMin` de la table des catégories, écrite avant le §8.2, qui exigeait 15 ans
(donc 14 avec la tolérance). Un champion de 13 ans était donc refusé partout,
sans qu'aucun écran ne le dise.

Corrigé sur trois plans :

1. Les bornes d'âge du karting sont alignées sur le §8.2 (Cadet 10, Junior 11,
   Senior 12, KZ 13 au lieu de 11/13/15/15).
2. La montée ne lit plus qu'une seule table, celle du §8.2.
3. **L'âge devient une condition affichée** dans le panneau, avec sa coche : il
   ne peut plus bloquer sans le dire. Le panneau en compte désormais quatre.

Vérifié sur toute l'échelle, avec la réputation qu'on a réellement à chaque
étage : un champion au bon âge reçoit une offre de montée dans 95 à 100 % des
cas, de Karting Mini jusqu'à la F1.

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

## §16 — la couche visuelle

Le §23.1 demande de ne travailler l'habillage qu'« après validation du gameplay,
jamais avant ». La condition est remplie : la boucle a été jouée sur plusieurs
sessions et validée. Tout est en SVG écrit à la volée — aucune image à produire,
aucun fichier à charger, la page reste un seul fichier.

### Portrait de pilote

`portraitPilote(p, opt)` dessine un visage déterministe à partir de l'identité du
pilote : `traitsPortrait()` tire teint, cheveux, coupe (4 variantes), couleur des
yeux, largeur du visage, épaisseur des sourcils et forme des oreilles d'un hachage
stable. Le même pilote donne toujours le même visage, sans rien stocker en
sauvegarde.

Le portrait vieillit avec le pilote, ce qui donne à une carrière de quinze ans
une trace visible :

| Âge | Ce qui change |
|---|---|
| < 18 ans | Visage plus rond et plus large, sourire un peu plus marqué |
| ≥ 19 ans | Une barbe naissante apparaît, et s'affirme avec les années |
| > 32 ans | Rides du front et patte d'oie, cheveux qui grisonnent |
| 43 ans | Grisonnement maximal (75 % vers le gris) |

La palette de cheveux ne contient **aucun gris** : un jeune de 14 ans ne doit pas
naître avec des cheveux blancs, le grisonnement ne vient que de l'âge.

La combinaison reprend la couleur de l'écurie. Les 34 écuries ont reçu un champ
`coul`. `coulPilote()` prend celle de la saison en cours, et à défaut celle du
contrat déjà signé — sans quoi le portrait redevenait gris entre la signature et
le lancement de la saison.

### Podium

`scenePodium(pos, noms)` s'affiche au débrief quand le pilote finit dans les
trois. Le pilote est debout sur sa marche, aux couleurs de son écurie, avec le
trophée posé à côté de lui en cas de victoire, et vingt confettis animés.

Quatre défauts de géométrie relevés en lisant les captures, et corrigés :

1. **Le trophée se dessinait en haut à gauche du cadre.** L'animation CSS pose un
   `transform`, qui écrase l'attribut `transform` du SVG. Le placement vit
   maintenant sur un groupe parent, l'animation sur un groupe enfant.
2. **La troisième marche dépassait du cadre** (x 166 + 56 > 200). Géométrie
   refaite : `viewBox` 200×132, marches de 52 aux abscisses 12 / 74 / 136.
3. **Le portrait arrivait sous forme de `<svg>` imbriqué**, donc avec son fond
   opaque et son propre recadrage : un carré sombre autour de la tête. Le mode
   `opt.integre` renvoie le dessin nu, sans balise `<svg>` ni fond.
4. **La combinaison et la marche avaient exactement la même couleur**, le pilote
   disparaissait dedans. La marche du vainqueur est assombrie de 45 % et cerclée
   d'un trait à la couleur pleine — ce qui la distingue aussi des marches
   neutres pour les livrées argentées.

Un cinquième défaut ne venait pas du podium mais du portrait lui-même : la nuque
se réduisait à une pastille au niveau du col, la tête flottait au-dessus des
épaules dès que le fond devenait transparent. Le cou va maintenant du menton au
col, avec une ombre sous le menton, et les épaules ont été remontées.

### Animations

Trois seulement, toutes sobres : la chute des confettis, la levée du trophée, et
l'entrée de la carte de signature. Les délais des confettis sont **négatifs**,
donc la chute est déjà entamée au premier rendu — sans quoi la scène s'ouvre sur
un ciel vide. Le tout est désactivé sous `prefers-reduced-motion: reduce`.

### Ce que la simulation rapide coûte

Mesuré au passage, sur 8 profils × 8 carrières × 15 saisons : un bot qui utilise
la simulation rapide à **toutes** les courses n'atteint la F1 que dans 0 à 2 cas
sur 8 (contre 4 à 8 en course détaillée) et gagne 1 à 3 titres au lieu de 8 à 12.
L'écart vient des réglages : la simulation rapide plafonne à 88 (54 + 5,5 par
niveau d'ingénieur), le travail d'essais atteint 95. C'est conforme au §18 et au
§21.1 — travailler les essais est le levier du manager — et aucun joueur humain
ne joue quinze saisons en simulation rapide intégrale. Rien n'a donc été
rééquilibré, mais le chiffre est noté ici pour ne pas être redécouvert plus tard.

### Test

`unit8.js` couvre le §16 : 35 assertions sur le déterminisme du portrait, le
mode intégré, le vieillissement, l'absence de gris dans la palette, la présence
d'une couleur sur les 34 écuries, la livrée héritée du contrat hors saison, et
le fait que rien du podium ne sorte du cadre pour les trois positions.

Le harnais de test lisait un `game.js` extrait à la main, qui pouvait être
périmé — les tests passaient alors sur du code ancien. Il lit maintenant
`index.html` directement.

## §15 — plusieurs pilotes gérés

Premier morceau du V2, et le plus structurant : tout le reste du V2 (académie,
locaux, managers rivaux) suppose qu'un manager suit plusieurs pilotes.

### Le nombre de places vient de la réputation

Table du GDD appliquée telle quelle :

| Réputation | Pilotes suivis |
|---|---|
| 1 – 3 | 1 |
| 4 – 6 | 2 |
| 7 – 8 | 3 |
| 9 – 10 | 5 |

Une place se libère aussi quand un pilote prend sa retraite : le dossier reste
vide et attend un successeur, la partie ne retombe au repérage que si la
structure se vide entièrement.

### Les dossiers

Un « dossier » réunit ce qui appartient à un pilote : le pilote, son contrat, sa
saison, son week-end, ses sponsors et ses offres. Le reste — argent, réputation,
staff, messagerie, calendrier — appartient au manager et reste commun.

Le dossier actif est recopié à plat sur l'état (`S.pilote`, `S.saison`…), si bien
que les 300 références écrites pour un pilote unique continuent de fonctionner
sans indirection. `syncDossier()` renvoie l'état à plat dans le tableau,
`activerDossier()` fait le mouvement inverse, `pourChaqueDossier()` exécute un
traitement dans le contexte de chacun. Toute opération qui parcourt les dossiers
commence donc par une synchronisation ; `saveGame()` le fait systématiquement.

### Le calendrier commun

Les pilotes gérés n'ont pas le même nombre de manches : 6 en Karting Mini, 24 en
F2. La saison du manager compte donc autant de **tours** que le plus long des
calendriers engagés, et chaque pilote y répartit ses courses régulièrement — un
pilote de karting court 7 fois sur 24 tours, aux tours 0, 4, 7, 10, 14, 17, 21.
Avec un seul pilote, un tour vaut une course : le déroulé est identique à la V1.

Le tour n'avance que lorsque tous les pilotes engagés dessus ont couru. Le
bureau indique qui court encore, et la barre du haut porte une pastille sur les
dossiers concernés.

**Un piège rencontré et corrigé.** Le nombre de tours était d'abord recalculé à
la volée à partir des saisons en cours. Quand le pilote au calendrier le plus
long se faisait renvoyer en milieu d'année, ce total s'effondrait *sous* le tour
courant et clôturait d'un coup la saison de tous les autres. Mesuré : une saison
karting + F2 s'arrêtait au tour 11 sur 24, le pilote de karting bloqué à 4
courses sur 7. Le nombre de tours est maintenant arrêté au moment où les saisons
sont engagées et ne bouge plus de l'année ; la saison se clôture soit au dernier
tour, soit dès qu'il ne reste plus une seule course à disputer.

### La charge de gestion

Le GDD demande que gérer plus de pilotes rapporte plus, mais coûte plus. Les
commissions s'additionnent naturellement, et chaque pilote a sa propre saison à
financer avec ses propres sponsors. En face, les actions hebdomadaires passent de
3 à `3 + (pilotes − 1)` : la hausse est volontairement sous-linéaire, si bien que
chaque pilote reçoit moins d'attention qu'un pilote unique. Le staff, lui, reste
commun et sert tout le monde.

### Mettre un pilote en retrait

En karting, un pilote ne rapporte quasiment aucune commission : les primes sont
minuscules et le salaire est nul, c'est le pilote qui paie pour rouler. Sa saison
se finance sur ses seuls sponsors et le manager comble le manque. Un second
pilote de karting est donc une **dépense**, pas un revenu — il ne paiera qu'en
atteignant la monoplace. Mesuré : engager systématiquement un second pilote
faisait passer la trésorerie de +62 k€ à −17 k€ en quatre saisons.

Le joueur peut maintenant refuser de l'engager pour l'année. Une saison blanche
ne coûte rien, mais elle est perdue : pas de progression, pas de points de
superlicence, et le pilote le prend mal (moral −14, relation −10). Si personne
n'est engagé, l'année se passe d'un bouton. Le vivier prévient explicitement de
l'économie du karting avant de signer un second pilote.

### La phase, vue du dossier

La phase globale mène le calendrier, mais deux pilotes peuvent en être à des
points différents : l'un court, l'autre cherche encore un baquet. `phaseDossier()`
donne la phase du dossier actif, et c'est elle qui décide de l'écran de bureau.
Sans cela, signer un second pilote en pleine saison plantait le bureau — il
cherchait le calendrier d'une saison qui n'existait pas encore.

### Deux limites d'âge qui ne s'appliquaient pas

Le bot multi-pilotes a fait remonter deux trous dans les règles d'âge du §8.1,
tous deux invisibles avec un pilote unique bien géré.

**La descente d'offre ne vérifiait pas l'âge.** `genererOffres()` proposait
systématiquement la catégorie du dessous comme porte de sortie, sans regarder si
le pilote y était encore admissible. Un pilote de 22 ans recevait donc des offres
en Karting Mini, dont la limite est 13 ans. Le baquet de secours, lui, avait bien
son plancher — la règle existait à un endroit et manquait à l'autre.

**Le plancher d'âge du baquet de secours ne jouait que vers le bas.** Sa boucle
`while(niv > plancher)` ne s'exécutait pas quand le pilote était *déjà* sous le
plancher, et renvoyait alors sa catégorie actuelle. Un pilote qui avait dépassé
la limite d'âge de sa catégorie y restait donc indéfiniment : mesuré, un pilote
courait en Karting Senior jusqu'à 30 ans, pour une limite à 22.

Rester dans sa catégorie est maintenant conditionné à l'âge, la descente aussi,
et le plancher pousse vers le haut quand il le faut — c'est l'âge qui fait monter
l'échelle du karting, comme dans la réalité. Mesuré après correction : sur 180
saisons simulées, plus une seule course hors limite d'âge (16 avant).

L'effet sur l'équilibrage est net et va dans le bon sens. Sur les 8 profils de
départ × 8 carrières × 15 saisons :

| | avant | après |
|---|---|---|
| Accès à la monoplace | 7 à 8 sur 8 | **8 sur 8 partout** |
| Accès à la F1 | 3 à 8 sur 8 | 4 à 8 sur 8 |
| Faillites | 0 à 2 sur 8 | 0 à 4 sur 8 |

Plus aucune carrière ne s'enlise en karting : la limite d'âge supprime cette
impasse. En contrepartie les faillites augmentent un peu, ce qui est logique —
un pilote poussé vers le haut coûte plus cher qu'un pilote qui stagne dans une
catégorie bon marché. C'est exactement la tension décrite au §19.8.

### Ce que la mesure dit, et ne dit pas

Le bot mono-pilote joue le nouveau code aussi bien qu'avant : 8 profils × 8
carrières × 15 saisons donnent les mêmes ordres de grandeur qu'avant le §15
(0 à 2 faillites sur 8, accès à la monoplace 7-8/8, F1 3-8/8). Le refactor n'a
donc rien cassé du jeu à un pilote.

L'équilibrage **à plusieurs pilotes n'est pas validé**. Un bot multi-pilotes a
été écrit pour le mesurer, mais un mauvais joueur simulé ne prouve rien : sa
première version s'est révélée très inférieure au bot mono-pilote simplement
parce qu'elle démarchait les sponsors au montant brut au lieu de l'espérance, et
n'épuisait pas ses actions. Une fois branchée sur les heuristiques éprouvées du
bot mono-pilote, la progression redevient saine (Karting Mini → KZ en dix ans),
mais la trésorerie s'effondre quand deux pilotes atteignent des catégories
coûteuses en même temps. C'est peut-être la tension voulue par le §19.8, c'est
peut-être un déséquilibre : il faudra une partie humaine pour trancher.

### Test

`unit9.js` couvre le §15 : 59 assertions sur la table des places, le refus de
signer au-delà, l'isolement des sponsors et contrats entre dossiers, la
répartition des courses sur le calendrier commun, le fait que le tour n'avance
qu'une fois tous les engagés passés, la sauvegarde des deux dossiers, le passage
d'année, la régression du renvoi décrite plus haut et les deux limites d'âge.
`browser4.js` déroule une saison complète à deux pilotes dans le navigateur.

## §5.3 — les managers rivaux

Sans eux le vivier est une boutique où personne ne vous double : on peut observer
un jeune dix fois avant de le signer, sans aucun risque. Le §5.3 demande une
course au recrutement, et c'est ce qui donne enfin un prix au temps.

### Six concurrents

Six managers IA, chacun avec sa réputation (qui lui ouvre les mêmes places que
le joueur, table du §15) et son **style de recrutement** :

| Style | Ce qu'il regarde |
|---|---|
| Flair | le potentiel brut, et il préfère les plus jeunes |
| Prudent | la valeur sûre — la note actuelle avant le plafond |
| Financier | le haut de l'échelle, là où il y a de l'argent |

Les styles comptent : le meilleur plafond du vivier n'est pas forcément le plus
convoité, ce qui laisse au joueur de la valeur à trouver là où les rivaux ne
regardent pas. Leurs pilotes progressent d'année en année, montent de catégorie,
raccrochent à 36 ans, et un manager lâche celui qui stagne — sans ce
renouvellement, les rivaux remplissaient leurs places une fois pour toutes et le
marché se figeait.

### L'arbitrage : observer ou signer

C'est le cœur de la mécanique. Le marché bouge **quand le joueur observe** — pas
avant qu'il regarde le vivier. Une première version faisait tourner le marché
trois fois à l'intersaison, avant que le joueur ouvre l'écran : il arrivait
devant un vivier déjà écrémé sans jamais voir partir personne. Le §5.3 parle
d'un talent « repéré trop tard » : encore faut-il l'avoir repéré.

Mesuré sur 300 parties, risque de perdre le meilleur espoir du vivier :

| | Risque |
|---|---|
| Signer tout de suite | 0 % |
| Après 1 observation | 19 % |
| Après 2 observations | 41 % |
| Après 3 observations | 45 % |
| Après 5 observations | 68 % |

Et la fourchette d'estimation, sans observer, selon le scout employé :

| Scout | Marge |
|---|---|
| aucun | ±16 |
| niveau 1 | ±11 |
| niveau 3 | ±5,5 |
| niveau 5 | ±2 |

Les deux tables se lisent ensemble : un scout de niveau 5 donne gratuitement ce
que cinq observations achètent à 68 % de risque. Le §13 (staff) et le §5.1
(potentiel caché) prennent tout leur sens ensemble — le scout n'est plus un
confort, c'est l'alternative au pari.

La convoitise est annoncée avant la signature : « Convoité — un autre manager
s'y intéresse » ou « Très convoité — 2 managers le suivent », juste sous
l'estimation, là où la décision se prend. Et si un jeune que le joueur avait
observé part quand même, un message le lui dit.

### Le classement des managers

Un tableau sur l'écran Championnat situe le joueur parmi les sept managers, sur
un score qui mêle le niveau atteint par ses pilotes, sa réputation et ses titres.
C'est sa place dans le métier, indépendamment du championnat de son pilote.

### Deux défauts de génération de noms

Relevés en lisant les captures. Le classement affichait trois « Yamashita »
d'affilée : le tirage vérifiait l'unicité du nom complet, pas du patronyme. Et
sur la fiche de comparaison, le coéquipier du pilote portait le même nom de
famille que lui. Les managers sont maintenant tirés dans des listes mélangées,
et les pilotes retiennent les patronymes déjà servis — sur un plateau de 26,
26 patronymes distincts.

### Test

`unit10.js` couvre le §5.3 : 36 assertions sur la forme des managers, les
différences de style, le retrait effectif des pilotes du vivier, le respect des
places, l'annonce de la convoitise, l'impossibilité de reprendre le pilote du
joueur, la progression annuelle des écuries rivales (plafond, âge, retraite), le
classement, la courbe de risque ci-dessus et l'unicité des patronymes.

## §5.2 — le réseau de scouts par région

Un manager débutant ne voit que son propre territoire. Ouvrir une antenne
ailleurs élargit le vivier et donne accès à une école de pilotage différente.

### Huit régions

| Région | Coût mensuel | École | Ce qu'on y trouve |
|---|---|---|---|
| France | incluse | — | Votre réseau d'origine |
| Europe de l'Ouest | 900 € | Racecraft | La filière la plus dense, peu de pépites cachées |
| Europe du Sud | 1 100 € | Pace | Les écoles de karting historiques |
| Scandinavie | 1 400 € | Consistency | Peu de pilotes, un sang-froid rare |
| Europe de l'Est | 800 € | — | Un vivier délaissé, donc bon marché |
| Amérique du Sud | 2 200 € | Pace | Talent brut fréquent, formation inégale |
| Asie | 2 600 € | Consistency | Discipline de travail, loin de tout |
| Amérique du Nord | 2 400 € | Racecraft | Des pilotes très adaptables |

Ouvrir coûte trois mois d'avance, puis un loyer mensuel qui entre dans la masse
salariale. Le vivier ne se recompose qu'à l'intersaison suivante : ouvrir une
antenne est un investissement, pas un achat immédiat.

### Une école, pas un bonus

Chaque région penche vers une qualité **au détriment des autres** : le total
reste constant. On ne recrute pas au Brésil pour avoir un pilote meilleur
partout, mais pour un profil différent. Mesuré sur 40 viviers par région (note
moyenne du groupe) :

| Région | Pace | Consistency | Racecraft |
|---|---|---|---|
| France | 40,0 | 40,0 | 39,9 |
| Europe du Sud | 40,9 | 38,2 | 38,3 |
| Scandinavie | 39,0 | 41,5 | 39,1 |
| Amérique du Nord | 38,9 | 38,9 | 41,4 |
| Europe de l'Ouest | 37,8 | 37,8 | 40,7 |

L'écart de total entre régions reste sous 4 points : aucune n'est objectivement
meilleure, elles sont différentes.

### Ce qui rend l'Europe de l'Est intéressante

C'est l'endroit où le §5.2 et le §5.3 s'emboîtent. Chaque manager rival a son
propre réseau, et toutes les régions ne sont pas également surveillées : sur six
rivaux, cinq suivent l'Europe de l'Ouest, moins d'un suit l'Europe de l'Est.

La description promise au joueur — « un vivier moins couru, donc moins cher, et
moins bien évalué par les autres managers » — est donc vraie, et mesurable.
Risque de se faire doubler après quatre observations :

| Région | Risque |
|---|---|
| Europe de l'Ouest | 47 % |
| Europe du Sud | 47 % |
| Asie | 20 % |
| Europe de l'Est | 10 % |

L'antenne la moins chère du jeu (800 €/mois) achète donc un marché tranquille,
où l'on peut se permettre d'observer avant de signer. C'est une vraie stratégie
alternative au scout de haut niveau.

### Test

`unit11.js` couvre le §5.2 : 27 assertions sur la couverture initiale,
l'exclusivité des pays par région, le filtrage du vivier, l'élargissement par
antenne, les biais d'école (avec la contrainte de somme constante), l'ouverture
et la fermeture avec leur coût, et la surveillance différenciée des rivaux avec
son effet mesuré sur le risque.

## §7.3 — les blessures

Le seul aléa que le manager ne peut pas anticiper. Il ne peut que s'en prémunir :
payer un préparateur physique, et ne pas demander au pilote de tout risquer à
chaque course.

Cinq blessures, de la contusion à la commotion cérébrale. Le risque ne se
déclenche que sur un abandon **de pilotage** — une panne mécanique ne blesse
jamais — et la gravité suit la vitesse de la catégorie : un accrochage en F1 n'a
rien à voir avec une sortie de piste en Karting Mini.

| Catégorie | Risque après un accrochage |
|---|---|
| Karting Mini | 14 % |
| Formule 3 | 30 % |
| Formule 1 | 40 % |

Un préparateur physique de niveau 4 ou 5 raccourcit la convalescence d'une
manche. Il n'empêche pas le choc, il abrège l'arrêt.

Un pilote blessé déclare forfait : la manche est comptée non disputée, le
championnat continue sans lui, et une manche de convalescence est purgée. Le
retour coûte 12 points de forme — il faut quelques tours pour retrouver ses
repères.

### Le trou qui rendait la mécanique invisible

Première mesure : 0,03 blessure par saison et **zéro manche manquée** sur 114
saisons simulées. Deux causes.

Le taux de base était trop faible pour que la mécanique se rencontre jamais — une
carrière de quinze saisons voyait une demi-blessure. Il a été relevé pour viser
trois ou quatre rencontres par carrière.

Surtout, rien n'empêchait *réellement* un pilote blessé de courir : seule
l'interface cachait le bouton. `ouvrirWeekend()` et `simulationRapide()` refusent
maintenant un pilote blessé, ce qui ferme aussi le contournement par la
simulation. Mesuré après correction, sur 10 carrières de 15 saisons :

| | avant | après |
|---|---|---|
| Blessures par carrière | 0,5 | 2,0 |
| Manches manquées par carrière | 0 | 3,9 |

## §7.4 — l'entourage du pilote

Le §7.4 demande des « parents envahissants en karting, qui financent une partie
de la saison mais mettent la pression sur les résultats ». L'apport familial
existait déjà, anonyme et sans contrepartie : un chèque de 22 % du budget, sans
personne derrière. Il a maintenant un visage.

| Entourage | Part financée | Exigence |
|---|---|---|
| Famille absente | 4 % | aucune |
| Famille discrète | 14 % | faible |
| Famille présente | 26 % | réelle |
| Famille envahissante | 42 % | forte |

Le principe est explicite : **plus la famille paie, plus elle décide**. Une
jauge de patience s'use à chaque saison décevante, d'autant plus vite que la
famille est exigeante, et se reconstitue sur les bons résultats. La famille
s'exprime au bilan de saison, sur un ton qui suit sa patience — fière, tendue,
ou en remise en cause. À bout, une famille présente ou envahissante peut confier
le pilote à un autre manager : c'est le revers de l'apport.

Calibrage : la pression est évaluée une fois par saison, et une famille
envahissante tient trois ou quatre saisons décevantes avant de partir. La
première version usait la patience de 92 points par saison ratée — elle
reprenait le pilote après un seul mauvais exercice, ce que le joueur n'avait
aucun moyen de voir venir.

L'apport ne vaut qu'en karting : au-delà, les budgets sont hors de portée d'une
famille et le sponsoring prend le relais. L'entourage est visible sur la fiche
du pilote, et dans le vivier dès qu'on a un scout de niveau 2 ou une
observation — c'est une information de repérage comme une autre.

### Test

`unit12.js` couvre le §7.3 (27 assertions : risque par catégorie et par type
d'abandon, gravité croissante, effet du préparateur, forfait et purge, garde
contre le départ d'un blessé par tous les chemins) et `unit13.js` le §7.4
(22 assertions : tirage des entourages, apport proportionnel à la part annoncée
et nul hors karting, usure et reconstitution de la patience, différenciation par
exigence, ton du message, retrait du pilote).

## §8.4 — les voies alternatives

Le GDD le dit clairement : « un pilote raté en F1 peut devenir une légende en
endurance — cela évite un sentiment de game over frustrant ». C'est exactement
ce que le prototype n'avait pas : une carrière qui n'atteignait pas la F1
s'arrêtait dans une impasse.

### Quatre championnats

Ils ne font **pas partie de l'échelle** du §8.1 : on n'y monte pas, on y
bifurque. `catByNiv()` ne les renvoie jamais, et l'échelle reste à neuf échelons.

| Championnat | Manches | Salaire | Jusqu'à | Risque de blessure* |
|---|---|---|---|---|
| Formule E | 16 | 300 k€ – 1,4 M€ | 40 ans | 31 % |
| Endurance (WEC) | 8 | 250 k€ – 1,8 M€ | 45 ans | 27 % |
| IndyCar | 17 | 350 k€ – 2 M€ | 44 ans | 59 % |
| Super Formula | 9 | 200 k€ – 900 k€ | 38 ans | 37 % |

\* après un accrochage, à comparer aux 40 % de la F1.

Le compromis est réel et lisible : l'IndyCar paie le mieux **et** expose le plus,
l'endurance est la plus sûre et offre la plus longue carrière. Sans cette
différenciation, un bot choisissait l'endurance dans 53 saisons sur 64 — quatre
championnats interchangeables ne font pas un choix.

### Le basculement économique

C'est la vraie raison d'être de ces voies. Dans toute l'échelle junior, le pilote
**paie** pour rouler et le manager comble le manque. Ici l'écurie prend la saison
entière en charge et **verse un salaire** — donc une commission. Un pilote qui
plafonne en F2 n'est plus un gouffre : il devient une rente.

### Quand elles s'ouvrent

Jamais depuis le karting : ces championnats recrutent des pilotes de monoplace
confirmés. Trois portes, dont une seule suffit :

- le pilote a passé l'âge où la catégorie du dessus recrute encore ;
- il stagne depuis au moins deux saisons dans la même catégorie et a 22 ans ou plus ;
- il a déjà couru en F1 et en est sorti (ou il a 25 ans révolus).

Un panneau apparaît alors sur la fiche du pilote — pas avant, car afficher une
porte de sortie à un espoir de 17 ans serait un contresens.

Mesuré sur 12 carrières de 18 saisons : 8 atteignent la F1, 6 passent par une
voie alternative. Les deux ne s'excluent pas — un ancien de F1 finit souvent en
endurance.

**Une porte qui s'ouvrait trop tôt.** Le balayage d'équilibrage a montré
l'effet : l'accès à la F1 s'effondrait (0 sur 8 pour le profil « budget faible /
inconnu », contre 4 avant le §8.4). La porte de la stagnation s'ouvrait à 22 ans,
or la fenêtre de recrutement F1 du §8.2 court jusqu'à 24 : ces championnats,
gratuits et payants, détournaient des carrières encore viables. Elle s'aligne
maintenant sur cette fenêtre.

## Ce que le §8.4 a changé à l'équilibrage général

Le balayage final, 8 profils × 8 carrières × 15 saisons :

| | avant le §8.4 | après |
|---|---|---|
| Faillites | 0 à 4 sur 8 | **0 partout** |
| Accès à la monoplace | 8 sur 8 | 7 à 8 sur 8 |
| Accès à la F1 | 4 à 8 sur 8 | 1 à 8 sur 8 |
| Titres moyens | 6,1 à 11,1 | 8,9 à 13,6 |

Les faillites disparaissent, et c'est l'effet voulu : un pilote qui plafonne
part en endurance où il est payé, ce qui arrête l'hémorragie. C'est exactement
le « sentiment de game over » que le §8.4 veut éviter.

**Mais un jeu sans échec possible perd sa tension**, et c'est un arbitrage qui
vous revient, pas au simulateur. Deux choses à savoir avant de trancher : le bot
qui produit ces chiffres optimise l'argent et prend donc systématiquement le
baquet payé, là où un joueur qui vise la F1 peut refuser ; et la baisse d'accès
à la F1 vient de ce même biais, pas d'un blocage. À juger en jouant.

### Test

`unit14.js` couvre le §8.4 : 34 assertions sur la séparation d'avec l'échelle
principale, les écuries et leurs couleurs, les conditions d'ouverture (trop tôt,
trop tard, après la F1), le salaire et l'absence d'apport dans les offres, la
fourchette de salaire, l'apparition du panneau, et la différenciation des quatre
championnats par le risque et la rémunération.

## §22.1 et §22.2 — la structure du manager

Le contenu de fin de partie : une fois la F1 atteinte et les revenus assurés, le
manager réinvestit dans sa propre structure.

### Les locaux

Quatre locaux, trois niveaux chacun, chaque palier plus cher que le précédent.
Les charges s'ajoutent à la masse salariale tous les mois, qu'il y ait un pilote
en piste ou non.

| Local | Effet |
|---|---|
| Bureau de management | +1 pilote suivi par niveau |
| Cellule de recrutement | Vaut un niveau de scout, et +2 antennes régionales par niveau |
| Département marketing | +8 % sur les montants et les chances de sponsoring, par niveau |
| Cabinet juridique | Négociations plus solides, moins de retraits d'offre |

Le point important est celui que le GDD souligne : « sans structure adaptée, le
manager ne peut pas suivre correctement plusieurs pilotes ». **La réputation
donne le droit de suivre plusieurs pilotes, les locaux en donnent les moyens** —
le plus contraignant des deux gagne. Sans bureau, on gère deux pilotes depuis
chez soi, quelle que soit la réputation. C'est ce qui empêche le §15 d'être une
récompense passive.

La cellule de recrutement plafonne aussi le §5.2 : deux antennes régionales sans
elle, deux de plus par niveau. Ouvrir le monde entier demande donc une structure,
pas seulement de la trésorerie.

### L'académie

Le vrai endgame. Au lieu de chercher des talents, le manager les forme :
recrutement d'enfants de 8 à 12 ans, une saison de formation par an, sortie à
15 ans vers le vivier.

L'investissement est lourd — 450 k€ d'ouverture, 6 500 €/mois de charges,
9 000 € par élève et par an — et le retour est long : trois saisons pour un
enfant recruté à 12 ans, sept pour un enfant de 8 ans. En échange, deux choses
que le scouting classique ne donne jamais :

- **le potentiel réel**, sans estimation floue. `marge()` renvoie zéro pour un
  pilote formé par vous, tous ses traits sont visibles, et son estimation vaut
  exactement sa note. C'est la contrepartie explicite du §22.2 face au §5.1 ;
- **la revente**. Un élève en surplus se vend, à un prix qui suit son plafond et
  sa jeunesse. Former plus d'élèves qu'on ne peut en gérer devient une source de
  revenus à part entière.

La formation progresse 35 % plus vite qu'une saison de course, parce qu'elle est
encadrée — mais elle n'apporte ni résultat, ni réputation, ni points de
superlicence. C'est du temps acheté contre de l'argent.

### Test

`unit15.js` couvre le §22.1 (24 assertions : forme des locaux, prix croissant,
achat et charges, capacité de gestion croisée avec la réputation, plafond
d'antennes, effets mesurés du marketing et du juridique) et `unit16.js` le §22.2
(31 assertions : ouverture, recrutement dans les régions couvertes, respect des
places, progression bornée par le plafond, sortie à 15 ans vers le vivier avec
marge d'estimation nulle, et valeur de revente croissante avec le potentiel,
décroissante avec l'âge).

## §23 — la direction artistique

Le §23.1 pose une condition : « l'interface est travaillée après validation du
gameplay, jamais avant ». Elle est remplie — la boucle a été jouée sur plusieurs
sessions et validée avant qu'on y touche.

Le §23.2 prend Motorsport Manager comme référence et liste cinq traits. Trois
étaient déjà là depuis le début : le fond bleu-gris foncé, la typographie
condensée en majuscules pour les titres, et le système de cartes à coins
arrondis. Deux manquaient.

**Les découpes en diagonale**, que le GDD désigne explicitement comme « ce qui
donne l'identité sport automobile et évite l'aspect application
administrative ». Chaque titre de carte porte maintenant une barre oblique, et
les vignettes de section sont des tuiles inclinées avec leur contenu redressé.

**La densité faible sur l'accueil.** La carte de progression de réputation
occupait quatre paragraphes pour une information secondaire ; elle tient
maintenant en une jauge, le détail se dépliant à la demande.

Une chose n'a délibérément pas été suivie : le §23.2 cite le turquoise comme
couleur d'accent unique, en référence à Motorsport Manager. Le jeu a construit
son identité autour du rouge depuis le premier prototype, et vous avez joué
plusieurs sessions avec. Changer la couleur d'identité d'un jeu qui tourne n'est
pas une décision à prendre à votre place : la discipline demandée par le GDD —
une seule couleur d'accent pour les actions — est respectée avec le rouge. Si
vous voulez le turquoise, c'est une variable CSS à changer.

## Migration des sauvegardes

Signalé en jouant : impossible de recruter un second pilote sur une partie
lancée avant le V2. C'était une régression de ma part — j'avais ajouté
`dossiers`, `locaux`, `scoutsRegion`, `academie` et les managers rivaux à l'état
d'une **nouvelle** partie, sans jamais écrire de migration pour les parties
existantes.

Deux conséquences, dont une grave :

- **le vivier plantait.** `renderScouting()` appelait `S.dossiers.every(...)` sur
  un tableau inexistant, ce qui interrompait le rendu de tout l'écran ;
- **signer un second pilote aurait écrasé le premier.** `ouvrirPlace()` créait
  un tableau de dossiers vide et le chargeait à plat, effaçant pilote, contrat,
  saison et sponsors en cours.

`migrerPartie()` complète maintenant toute sauvegarde ancienne au chargement et
à l'import : le pilote en cours devient le dossier 0 avec son contrat, sa saison
et ses sponsors ; les structures du V2 sont créées vides ; les champs de pilote
ajoutés après coup (blessure, entourage, patience) sont initialisés sur le
dossier, le vivier et les rivaux. Les managers rivaux, qui ont besoin de la
réputation courante, naissent à la reprise.

L'avancement de la saison est préservé exactement : l'ancien modèle jouait une
course par tour, donc `manche` reprend la valeur de `courseIndex` et `manches`
la longueur du calendrier. Une partie reprise en manche 3 avec 48 points repart
en manche 3 avec 48 points.

Les trois chemins qui supposaient l'existence des dossiers sont aussi durcis, de
sorte qu'une sauvegarde non migrée ne puisse plus jamais ni planter ni perdre de
données : le rendu du vivier, la barre de sélection, et `ouvrirPlace()` qui range
d'abord le pilote en cours avant de créer le tableau.

La sauvegarde passe en version 2. Les versions 1 et 2 sont acceptées, toute
autre est refusée.

### Test

`unit17.js` : 29 assertions sur le rangement du pilote en dossier 0, la
préservation de l'avancement (saison en cours et saison finie), la création des
structures manquantes, l'initialisation des champs de pilote, l'idempotence
(migrer deux fois ne duplique rien), et le parcours complet reprise → signature
d'un second pilote avec vérification que le premier et sa saison sont intacts.
`browser5.js` rejoue ce parcours dans le navigateur, par le vrai bouton
« Reprendre » et de vrais clics.

## §20.4 — mettre fin à une collaboration

Signalé en jouant : ni le manager ni le pilote ne peuvent rompre. Deux manques
distincts derrière le même symptôme.

### Le manager ne pouvait pas arrêter

Il n'existait aucune action. On était lié à son pilote jusqu'à sa retraite, sauf
à ce que la famille le reprenne. Un bouton sur la fiche du pilote ouvre
maintenant une fenêtre qui **annonce le coût avant de le prélever** :

| | Hors saison | En pleine saison |
|---|---|---|
| Réputation | 30 + note × 0,9 | + 45 de plus |
| Indemnité à l'écurie | — | 6 % du budget de la catégorie |

Le coût monte avec la valeur du pilote : lâcher un espoir à 30 de note n'a rien
à voir avec lâcher un pilote de F2. Rompre doit rester une décision, pas une
touche « recommencer ».

**Le montant annoncé n'était pas celui prélevé.** La fenêtre affichait 112
points quand 171 étaient retirés : `perdrePilote()` appliquait sa propre pénalité
par-dessus celle que la confirmation avait déjà prélevée. C'est le genre d'écart
qui détruit la confiance dans une interface — corrigé et couvert par un test qui
compare les deux nombres.

### Le pilote ne partait jamais vraiment

La fiche promettait « un pilote mal suivi change de manager ». En réalité, le
départ n'était atteignable que par une chaîne improbable : un message aléatoire,
qui ne pouvait tomber que sous 35 de relation, dans lequel le joueur devait
**choisir** « le laisser réfléchir ». Un joueur qui répondait toujours « je
renégocie » gardait son pilote à vie, relation à 5/100 comprise.

`usureRelation()` s'exécute maintenant à chaque manche. Sous 20 de relation, un
compteur s'arme : premier avertissement, second avertissement, puis départ à la
troisième — sans que le joueur ait à consentir. Remonter la relation au-dessus
du seuil désarme le compteur. La fiche du pilote affiche le décompte, il n'y a
donc pas de surprise.

### Le pilote perdu retourne au vivier

Dans les deux cas il ne disparaît pas du monde : il redevient candidat, avec sa
relation ramenée à un niveau neutre et un moral entamé. Un manager rival peut le
signer — et le joueur peut le regretter, ou le reprendre. Attention à l'ordre :
`genererScoutPool()` régénère le vivier quand la structure se vide, il fallait
donc réinsérer le pilote **après** cet appel, sans quoi il était effacé.

### Le plantage du départ à l'arrivée

Trouvé en mesurant l'équilibrage de la réglementation évolutive, sur deux séries
de 64 carrières : **le jeu plantait quand le pilote partait à la seconde même où
la course se terminait.**

L'usure de relation est évaluée dans les effets psychologiques d'après-course.
Si c'est le troisième avertissement, `perdrePilote` remet `S.pilote` et
`S.saison` à `null` — et la suite de `traiterResultat` continuait à tourner :
progression de la grille, évaluation du contrat, sponsors, tous sur une saison
qui n'existait plus. `TypeError: Cannot read properties of null`. Dans le
navigateur, cela laissait le week-end bloqué sur le débrief, sans aucun moyen de
continuer la partie.

Corrigé en trois endroits, parce que le premier correctif n'a fait que déplacer
le plantage d'un cran : `traiterResultat` s'arrête dès que le pilote est parti,
`progresserGrille` ne tourne plus hors saison, et `finirWeekend` fait avancer le
calendrier commun des autres dossiers sans toucher à une saison disparue.

Le bug n'a rien à voir avec le §11 : il existait avant, mais il demande une
séquence rare — relation au plus bas *et* troisième avertissement *à l'arrivée
d'une course*. Il a fallu 128 carrières simulées pour le déclencher deux fois.

### Test

`unit18.js` : 31 assertions sur les deux avertissements puis le départ, le
désarmement par une relation qui remonte, l'absence d'usure au-dessus du seuil,
le coût de rupture (plus cher en saison, plus cher pour un bon pilote, égal au
montant annoncé), l'indemnité prélevée, le retour au vivier en état signable, et
la non-régression du plantage ci-dessus — vérifiée dans les deux sens : le test
échoue bien si l'on retire les gardes.
`browser7.js` rejoue les deux chemins par de vrais clics.

## Le mandat et le marché des transferts

Signalé en jouant : le marché est trop petit, et représenter un pilote n'est
encadré par rien. C'était exact — on signait un jeune du vivier, on le gardait,
et la commission était figée dans le code (10 % course, 15 % sponsors, 20 %
titre). Il n'existait aucun contrat entre le manager et son pilote.

### Le mandat

Un vrai contrat manager ↔ pilote, distinct du contrat pilote ↔ écurie : une
durée de trois saisons et un **taux de commission négocié**. Les trois assiettes
gardent leur rapport historique — sponsors à une fois et demie le taux, titre au
double — si bien qu'un mandat à 10 % reproduit exactement l'ancien
comportement. Les parties existantes sont migrées à ces conditions, rien ne
change pour elles.

Le taux est le cœur de la négociation : **plus vous prenez peu, plus vous êtes
attirant, moins vous gagnez**. La fiche du pilote affiche le taux, les années
restantes et sa valeur marchande estimée.

### Aller chercher le pilote d'un concurrent

Un marché apparaît sous le vivier : les pilotes sous mandat rival, avec le nom
de leur manager et l'indemnité qu'il faudrait lui verser. On approche en
choisissant son taux, et la fenêtre annonce la probabilité d'acceptation avant
de s'engager :

| Taux proposé | Il accepte |
|---|---|
| 6 % | 58 % |
| 10 % | 43 % |
| 15 % | 23 % |

L'intérêt du pilote croise trois choses : le taux qu'on lui prend, l'écart de
réputation entre les deux managers, et sa satisfaction chez le sien. L'indemnité
suit sa valeur marchande — plafond, catégorie, jeunesse — et n'est versée que
s'il accepte. Une approche refusée coûte de la réputation et rend le pilote plus
difficile à convaincre ensuite.

### Se faire prendre le sien

L'inverse existe aussi. Un concurrent peut approcher votre pilote si la relation
laisse une prise (au-dessus de 70, personne ne vient). Un message arrive, et
trois réponses :

- **s'aligner** sur le taux du rival — il reste, le mandat repart pour trois
  saisons, mais vos revenus baissent d'autant ;
- **le convaincre sans baisser** — gratuit, mais la réussite dépend de la
  relation ; un échec et il part ;
- **ne rien proposer** — la relation chute, et il part le plus souvent.

S'il part, vous touchez une indemnité proportionnelle aux années de mandat
restantes. C'est ce qui rend l'échéance lisible : un mandat à un an de la fin ne
protège presque plus rien, et la fiche du pilote le signale.

### Un marché qui se figeait

Première version : une fois les rivaux à court de places, plus personne ne
pouvait débaucher — dans les deux sens. Mesuré, aucune offre n'arrivait après
80 mouvements de marché. Un manager plein peut maintenant venir quand même,
s'il est prêt à se séparer de son moins bon pilote pour le vôtre — ce qui est
d'ailleurs la façon dont ces choses se passent.

### L'échéance du mandat

Le mandat avait une durée affichée, une fonction `mandatActif()` — et cette
fonction n'était **appelée nulle part**. Le mandat expirait en silence : la
fiche annonçait une échéance qui n'arrivait jamais, et les commissions
continuaient de tomber. Un trou dans du code livré une heure plus tôt.

L'échéance a maintenant des conséquences. À l'intersaison, un mandat arrivé à
terme bloque le bureau : il faut renégocier avant toute autre chose, en
proposant un taux, avec la probabilité d'acceptation affichée. Le pilote pèse
l'écart avec l'ancien taux, sa relation, votre réputation, et ce qu'il a
accompli sous votre houlette.

Tant qu'il n'est pas renouvelé, **le pilote est libre** — et c'est là que
l'échéance coûte cher :

| | Sous mandat | Mandat échu |
|---|---|---|
| Probabilité d'être approché, par manche | 5,5 % | 42 % |
| Approché malgré une bonne relation | non | oui |
| Indemnité si le pilote part | proportionnelle aux années restantes | **rien** |

### Une offre ignorée bloquait tout

Deuxième trou, plus vicieux. Une offre rivale en attente empêchait toute
nouvelle approche sur ce pilote — et elle ne se levait qu'en répondant. Ignorer
le message rendait donc **définitivement immunisé**, exactement l'inverse de
l'intention. Mesuré : 7,8 mandats arrivés à terme par carrière, et zéro pilote
perdu.

Une offre sans réponse se tranche maintenant d'elle-même au bout de trois
manches, comme si l'on n'avait rien proposé — ce qui est le cas. Le message le
dit. Après correction, pour un bot qui ne renouvelle jamais et ne répond
jamais : 6,1 échéances, 0,6 offre reçue et **1 pilote perdu** par carrière de
quinze saisons. C'est la sanction juste d'une passivité totale, sans être
punitif pour qui suit ses dossiers.

### Test

`unit19.js` : 59 assertions sur la création du mandat, l'application du taux aux
trois assiettes, la valeur marchande (qui accepte aussi bien un pilote complet
qu'un résumé détenu par un rival), l'indemnité croissante avec les années
restantes, les trois facteurs d'intérêt du pilote, le contenu du marché, la
reconstruction d'un pilote jouable depuis un résumé, le débauchage complet, et
les trois réponses à une offre reçue, l'échéance et le renouvellement, l'absence
d'indemnité sur un mandat échu, et le délai de réponse. `browser8.js` rejoue les
deux sens du transfert par de vrais clics, `browser9.js` le cycle de l'échéance.

### Un onglet à part, et des conditions écrites

Signalé en jouant : **on ne savait pas ce qu'il fallait pour approcher un
pilote.** Le marché tenait dans une carte au bas de l'onglet Pilote, sous le
vivier, et aucune de ses règles n'était écrite nulle part. Elles existaient
pourtant toutes dans le code.

Le marché a désormais son propre onglet, qui commence par énoncer les quatre
conditions, chiffrées et à jour :

| Condition | Ce qui la détermine |
|---|---|
| Une place libre dans votre écurie | `min(pilotesMax(réputation), capacité des locaux)` — l'écran donne les deux et dit lequel limite |
| Un nom qui porte jusqu'à lui | palier de réputation → niveau de catégorie maximal, et le palier qui ouvrira le suivant |
| De quoi indemniser son manager | fourchette réelle des indemnités du marché, face à votre trésorerie |
| Et qu'il dise oui | les trois termes de `interetMandat`, nommés et chiffrés pilote par pilote |

La table des paliers (`PALIERS_MARCHE`) est devenue la **seule source de
vérité** : `marcheTransferts` filtre avec elle, l'écran l'annonce avec elle. Un
test vérifie sur cinq paliers que rien au-dessus de la portée annoncée
n'apparaît dans la liste.

Trois choix qui découlent de la mise à plat :

1. **Les pilotes hors de portée sont montrés, grisés, pas cachés.** On voit à
   quoi sert la réputation qu'on n'a pas encore, et l'écran nomme le palier
   exact qui les ouvrira.
2. **Les boutons fermés disent pourquoi** — « Aucune place libre », « Il vous
   manque 42 k€ » — plutôt que d'être simplement grisés.
3. **L'écran montre aussi vos propres pilotes vus d'en face** : relation,
   commission, saisons de mandat restantes, et un niveau de risque. Un mandat
   échu passe en risque élevé même avec une excellente relation, puisqu'un
   concurrent peut alors prendre le pilote sans rien verser.

**Ce que la mise à plat a révélé.** En chiffrant le troisième facteur pour
l'afficher, on constate que le terme « ce qu'il vit chez son manager » vaut au
mieux **+3,5** (manager de réputation 1, karting) et descend à **−25**. Il ne
joue donc jamais vraiment en votre faveur : c'est un frein, jamais un argument.
Les deux vrais leviers sont votre taux de commission et votre réputation. La
carte le dit maintenant franchement plutôt que de laisser croire à trois leviers
symétriques — c'est le genre de chose qu'on ne voit qu'en écrivant les règles
noir sur blanc.

### Test

`unit22.js` : 75 assertions sur la table des paliers (monotone, jamais en
recul), l'égalité entre le filtre appliqué et la portée annoncée sur cinq
paliers, la correspondance exacte entre la probabilité affichée et celle qui
sera jouée à cinq taux de commission, le sens des trois facteurs, la présence
des quatre conditions à l'écran, la section « hors de portée » et le palier
annoncé, les boutons qui disent pourquoi ils sont fermés, l'exposition de vos
propres pilotes (relation dégradée et mandat échu), l'écran vide qui reste
informatif, le renvoi depuis le vivier sans duplication, l'unicité des noms sur
25 marchés réellement peuplés, et la troncature annoncée au-delà de douze
pilotes. `browser12.js` parcourt l'onglet par de vrais clics.

## Portraits et circuits : bibliothèques réelles plutôt que dessin maison

Demandé explicitement : remplacer les portraits en SVG fait main par des
avatars générés par une bibliothèque tierce (déterministes, seedés sur
l'identifiant du pilote), et les tracés de circuits dessinés à la main par de
vrais tracés sous licence libre, recolorés en CSS.

### Portraits — DiceBear, style Micah (Personas au départ, remplacé)

**Mise à jour après retour utilisateur** : « les visages, pas moyen d'en
trouver de plus jolis, plus réalistes ? ». Personas donnait des visages
jugés trop simples. Comparé côte à côte à cinq autres styles du même
paquet (lorelei, avataaars, adventurer, micah) :

- **lorelei** (CC0, correspond exactement à la licence visée au départ) :
  rendu en fait moins abouti que Personas — traits au trait noir sur blanc,
  sans couleur, et surtout **aucun corps/vêtement** dans son schéma :
  impossible d'y poser la couleur d'écurie.
- **avataaars** (le plus soigné visuellement à l'œil) : licence non
  standard — le SVG généré la déclare lui-même « Free for personal and
  commercial use » avec l'URL `avataaars.com` comme seule référence, pas
  MIT/CC0/CC BY. Écarté pour rester sur une licence reconnue, comme demandé.
- **adventurer** : rendu trop enfantin (têtes rondes, très grands yeux),
  contraire au « plus réaliste » demandé.
- **micah** (« Avatar Illustration System », Micah Lanier, CC BY 4.0) :
  retenu. Rendu nettement plus adulte, `shirtColor` pour la couleur
  d'écurie, licence de la même famille que Personas (déjà correctement
  gérée). Un seul piège : `facialHair: 'beard'` se dessine en aplat noir
  plein façon cagoule dans ce style — exclu, seul `scruff` (repousse) est
  utilisé. Le vocabulaire d'ids internes est encore plus simple qu'avec
  Personas : un seul id (`viewboxMask`) sur tout le domaine testé
  (1440 combinaisons), contre huit précédemment — toujours vérifié par
  balayage exhaustif plutôt que supposé (`unit23.js`).


`@dicebear/core` + `@dicebear/collection` (MIT), version 9.4.2, bundlées en
local avec esbuild en un seul fichier IIFE (`vendor/dicebear.bundle.js`,
37 Ko minifié) exposant `window.DicebearPersona.svgFor(seed, options)`.
Aucun appel réseau à l'exécution — vérifié en coupant le réseau après le
premier chargement de la page (`browser13.js`) : zéro requête, le bundle
tourne entièrement en local.

Le style choisi est **Personas** (par Draftbit), pas Notionists : les deux
styles étaient proposés, mais seul Personas a une option `clothingColor`
qui permet de forcer la couleur du vêtement à la couleur d'écurie — Notionists
n'a aucune option de couleur (schéma vérifié directement dans le paquet), ce
qui aurait rendu impossible la livrée aux couleurs de l'équipe.

**Point de licence à corriger par rapport à la demande initiale** : la
demande visait du MIT/CC0. Le code de DiceBear est bien MIT, mais l'illustration
Personas elle-même est sous **CC BY 4.0** (attribution requise) — c'est écrit
dans les métadonnées que la bibliothèque embarque dans chaque SVG généré.
Notionists, lui, est bien CC0 (vérifié de la même façon), mais sans aucune
option de couleur. Plutôt que de perdre la livrée aux couleurs d'écurie pour
respecter à la lettre « CC0 », l'attribution est faite une fois, correctement,
dans l'onglet Sauvegarde → Crédits — ce que CC BY demande, ni plus ni moins.

**Deux corrections faites après un premier rendu vérifié à l'œil** (le style
brut, non ajusté à ce cas d'usage, ne convient pas tel quel à des pilotes de
8 à 90 ans) :
1. Le style « pacifier » (tétine) fait partie du répertoire de bouches de
   Personas mais ne colle à aucun pilote du jeu, pas même le plus jeune
   académicien à 8 ans. Exclu explicitement de la liste transmise.
2. La teinte de cheveux « dee1f5 », très pâle, se lisait comme un
   grisonnement sur un pilote de 13 ans tiré au hasard. Réservée depuis aux
   pilotes réellement âgés (déclenchée par le même seuil qui pose la teinte
   grise/blanche volontaire, `vieux>0.4`, soit environ 44 ans).

**Un problème d'intégration qui ne saute pas aux yeux avant de l'avoir
cherché** : DiceBear réutilise toujours les huit mêmes identifiants internes
d'un portrait à l'autre (des masques de découpe SVG : `viewboxMask`,
`personas-a`, etc.). Deux portraits affichés côte à côte — le vivier, une
grille de départ — se marchaient dessus : le second n'héritait que du masque
du premier, silencieusement (pas d'erreur JS, juste un rendu cassé).
Chaque portrait renomme désormais ses ids avec le suffixe de l'identifiant du
pilote (`namespaceAvatarIds`). Le vocabulaire des huit ids est balayé de
façon exhaustive par `unit23.js` (tout le domaine hair × facialHair du style)
plutôt que supposé stable d'une version de la bibliothèque à l'autre.

La géométrie du cadrage : le buste DiceBear tient dans un carré 64×64, le
gabarit du jeu est un rectangle 100×120 (portrait). Mise à l'échelle en
« cover » (comme `background-size:cover` en CSS) — `scale = max(100/64,
120/64) = 1.875`, recentré horizontalement — plutôt que d'étirer ou de
laisser des bandes vides.

### Circuits — tracés réels, pas Wikimedia

**Wikimedia Commons, la source demandée, est bloqué par la politique réseau
de cet environnement de développement** (`commons.wikimedia.org` et
`upload.wikimedia.org` renvoient un 403 côté proxy — vérifié directement,
et confirmé par le journal du proxy). Ce n'est pas contournable depuis ici ;
c'est un choix de politique réseau de l'environnement, pas une limite de
Claude Code. D'autres CDN généralistes (unpkg, jsdelivr) sont bloqués de la
même façon ; seuls `registry.npmjs.org` et `raw.githubusercontent.com`
(entre autres) sont ouverts.

À la place : [bacinger/f1-circuits](https://github.com/bacinger/f1-circuits)
(MIT, © Tomislav Bacinger), un jeu de données GeoJSON des tracés F1 réels,
cloné en lecture anonyme (dépôt public, hors du périmètre GitHub attaché à
cette session mais lisible quand même — le proxy git de la session sert les
lectures anonymes de dépôts publics). Le choix est en réalité meilleur que
l'idée initiale : une géométrie réelle (coordonnées GPS du tracé) plutôt
qu'une image SVG statique à recolorer par filtre CSS, ce qui aurait été plus
fragile et moins fidèle à « recoloré via CSS » au sens strict.

Conversion (script Node ponctuel, pas embarqué dans le jeu) : projection
locale plate corrigée de la latitude (`x = lon·cos(lat₀)`, `y = -lat`),
mise à l'échelle et centrage dans un viewBox commun `0 0 200 120`, arrondi à
0,1 unité. 27 circuits sur les 28 du catalogue monoplace ont une
correspondance réelle (seul Jarama, absent du jeu de données — plus au
calendrier F1 actuel — n'en a pas). Aucun circuit de karting n'a de
correspondance : aucun jeu de données ouvert équivalent trouvé pour ces
circuits, en partie fictifs.

Pour les circuits sans tracé réel (tout le karting, Jarama), un tracé
stylisé déterministe (somme de sinusoïdes à phases et amplitudes tirées du
nom du circuit via `hash01`) comble le vide plutôt que de le laisser béant —
distingué du réel par la classe CSS `.stylise` et l'absence du badge
« tracé réel », jamais présenté comme authentique.

Le chemin ne porte aucune couleur : `fill="none" stroke="currentColor"`,
recoloré entièrement par le conteneur (`style="color:${coulPilote()}"`) —
vérifié qu'aucune couleur n'est codée en dur dans le SVG produit
(`unit23.js`), et que changer la couleur du conteneur change bien le trait
sans toucher au SVG (`browser14.js`, forçage direct de `style.color`).

### Test

`unit23.js` : 188 assertions. Portraits : bundle chargé et déterministe,
couleur d'écurie appliquée, mode intégré (podium) sans balise `<svg>`,
absence de collision d'ids entre deux portraits affichés ensemble, balayage
exhaustif du vocabulaire d'ids sur tout le domaine hair × facialHair,
options réellement transmises à DiceBear interceptées et vérifiées (barbe
selon l'âge, palette de cheveux selon l'âge, absence de « pacifier ») plutôt
que devinées depuis le rendu. Circuits : tout circuit résolu par tout
calendrier généré a un tracé, les 27 circuits réels sont marqués comme tels
et portent une longueur plausible, tout le karting et Jarama sont stylisés,
déterminisme et unicité du tracé stylisé par circuit, absence de couleur en
dur dans le SVG produit. `unit8.js` (portraits, existant) mis à jour : les
assertions qui inspectaient le dessin à la main disparu (palette de cheveux
sans gris, tracé littéral des rides) sont remplacées par l'équivalent au
niveau de `portraitPilote()` pour la nouvelle implémentation ; les
assertions sur le cadrage, la livrée et le podium, elles, n'avaient pas
besoin de changer.
`browser13.js` vérifie les portraits par de vrais rendus (déterminisme,
absence de collision d'ids en DOM réel, couleur appliquée, réseau coupé),
`browser14.js` les circuits (tracé réel vs stylisé, badge, recoloration CSS
en direct).

## Ce qui reste à faire avant de parler de « jeu »

- Le §22.3 (devenir Team Principal en F1), le seul point du GDD encore ouvert,
  et que le GDD écarte lui-même : « cette extension représente pratiquement un
  second jeu greffé sur le premier ».

Tout le reste du périmètre V1 et V2 du GDD est en place. Ce qui manque
maintenant n'est plus du contenu, c'est du jeu réel : le multi-pilotes, le
marché des transferts et la réglementation évolutive n'ont jamais été
confrontés à une partie humaine, seulement à des simulations.
