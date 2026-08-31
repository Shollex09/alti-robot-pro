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

### Test

`unit14.js` couvre le §8.4 : 34 assertions sur la séparation d'avec l'échelle
principale, les écuries et leurs couleurs, les conditions d'ouverture (trop tôt,
trop tard, après la F1), le salaire et l'absence d'apport dans les offres, la
fourchette de salaire, l'apparition du panneau, et la différenciation des quatre
championnats par le risque et la rémunération.

## Ce qui reste à faire avant de parler de « jeu »

- La réglementation évolutive d'une saison à l'autre (§11), marquée V2.
- La gestion tour par tour de la course (§12) : il n'y a qu'un seul arbitrage
  à mi-course, pas un suivi continu.
- Le reste du périmètre V2 : locaux (§22.1) et académie (§22.2).
