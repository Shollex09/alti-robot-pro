# GAME DESIGN DOCUMENT
## Manager de Pilote — Du Karting à la F1

**Version :** 0.5 — Document de travail
**Plateforme cible :** Mobile (iOS / Android)
**Genre :** Simulation de gestion sportive (Manager)

> **Légende de priorité**
> **[V1]** = indispensable pour la première version jouable
> **[V2]** = évolution prévue après la sortie, à ne pas développer tout de suite

> **Prototype :** un prototype jouable en HTML couvrant le périmètre [V1] se trouve dans
> [`../index.html`](../index.html). Voir [`ETAT_PROTOTYPE.md`](ETAT_PROTOTYPE.md) pour la
> correspondance section par section entre ce document et ce qui est réellement codé.

---

## 1. Concept général [V1]

Le joueur incarne un **manager de pilote de course automobile**, pas le pilote lui-même. Son rôle est de repérer un jeune talent en karting, de trouver les financements pour le faire rouler, de le faire progresser course après course, de négocier ses contrats avec des écuries, et de le mener — s'il en a le talent et les moyens — jusqu'au sommet de la monoplace.

Le jeu vise un haut niveau de réalisme, inspiré de **Football Manager** (progression, réputation, scouting, boîte de réception) et **F1 Manager** (statistiques de pilote, interface de gestion technique).

**Les trois piliers du gameplay :**
1. **Repérer** le bon talent (scouting)
2. **Financer** sa progression (sponsors et budget)
3. **Négocier** sa carrière (contrats et écuries)

---

## 2. Création de partie — Profils de départ [V1]

Le joueur configure sa partie via **deux curseurs indépendants**, non liés l'un à l'autre.

### 2.1 Budget de départ

| Niveau | Budget indicatif |
|---|---|
| Faible | ~20 000 € |
| Moyen | ~80 000 € |
| Élevé | ~200 000 € |
| Très élevé | ~500 000 € |

### 2.2 Réputation de départ du manager (échelle à 10 paliers, façon Football Manager)

| Palier | Nom | Accès débloqué |
|---|---|---|
| 1 | Inconnu | Aucun contact ; repérage manuel en karting local |
| 2 | Amateur | Contacts en club de karting régional |
| 3 | Régional | Confiance du karting national, petits sponsors locaux |
| 4 | National | Jeunes pilotes F4 prometteurs répondent aux appels |
| 5 | Reconnu | Petites écuries F3 consultent le manager pour leurs jeunes |
| 6 | Respecté | Accès aux meilleurs espoirs F3, sponsors nationaux moyens |
| 7 | Continental | Écuries F2 proposent des collaborations |
| 8 | Renommé | Grosses écuries F2 et petites écuries F1 s'intéressent |
| 9 | International | Écuries F1 de milieu de tableau viennent directement |
| 10 | Légendaire | Top écuries F1 considèrent le manager comme référence, accès aux meilleurs talents mondiaux dès le karting |

**Combinaison libre des deux curseurs** → 4 × 10 = 40 profils de départ possibles. Exemples de profils extrêmes :

- **Budget élevé + Inconnu** : moyens financiers pour multiplier les essais sur de jeunes pilotes, mais aucune crédibilité de départ.
- **Budget faible + International** : accès à de bons talents dès le début, mais gestion financière très serrée, peu de marge d'erreur.

---

## 3. Progression de la réputation manager [V1]

- **Hausse** : championnat gagné par un pilote du manager, transfert réussi vers une écurie prestigieuse, contrat de sponsoring majeur décroché.
- **Baisse** : abandon d'un pilote en pleine saison, échecs répétés, scandale médiatique.
- **Courbe non linéaire** : chaque palier est plus difficile à atteindre que le précédent (passer de 9 à 10 est nettement plus long que de 1 à 2).

---

## 4. Recherche de sponsors — Pilier central du rôle de manager [V1]

C'est au manager de démarcher et négocier les sponsors qui financent la progression du pilote. En karting notamment, sans sponsors, pas de saison possible.

### 4.1 Niveaux de sponsors (selon la réputation du manager et du pilote)

| Niveau | Type de sponsor | Ordre de grandeur | Accessible à partir de |
|---|---|---|---|
| 1 | Commerce local (garage, boulangerie, concessionnaire du coin) | 500 – 5 000 € | Réputation 1-2 |
| 2 | PME régionale (entreprise BTP, transporteur régional) | 5 000 – 25 000 € | Réputation 3-4 |
| 3 | Marque nationale (chaîne de magasins, assureur) | 25 000 – 150 000 € | Réputation 5-6 |
| 4 | Grand groupe (équipementier, télécom, banque) | 150 000 – 1 M€ | Réputation 7-8 |
| 5 | Sponsor mondial (boisson énergisante, horlogerie, pétrolier) | 1 M€ et + | Réputation 9-10 |

### 4.2 Mécanique de démarchage

- Le manager consulte une **liste de sponsors potentiels** et lance des démarches (chaque démarche coûte du temps, parfois de l'argent — déplacement, dossier de présentation).
- Chaque sponsor a des **critères d'intérêt** : résultats récents du pilote, sa réputation, son image médiatique, la catégorie dans laquelle il court, et parfois sa région d'origine.
- Le résultat n'est pas garanti : refus possible, ou contre-proposition à la baisse.

### 4.3 Contreparties et obligations

Un sponsor n'apporte pas que de l'argent gratuit — il impose des contraintes :

- **Objectifs de résultat** : prime versée seulement si le pilote atteint un certain classement.
- **Obligations d'image** : journées presse, apparitions publiques, tournage publicitaire → prennent du temps sur l'entraînement et peuvent fatiguer le pilote.
- **Rupture possible** en cas de mauvaise saison ou de scandale.

### 4.4 Conflits de sponsors

Deux marques concurrentes (deux boissons énergisantes, deux équipementiers) ne peuvent pas être présentes en même temps. Le manager doit arbitrer entre plusieurs offres incompatibles.

### 4.5 Sponsors personnels vs sponsors d'écurie

- En **karting/F4**, les sponsors personnels financent directement la saison (c'est vital).
- En **F2/F1**, le pilote est payé par l'écurie, mais ses sponsors personnels (logo sur la combinaison/casque) restent une source de revenus et un argument de poids lors des négociations — un pilote qui apporte des sponsors est plus attractif pour une écurie.

### 4.6 Pilotes payants [V1]

Comme dans la vraie F1, un baquet peut être obtenu en apportant un financement conséquent. Le manager qui décroche de gros sponsors peut donc acheter la progression de son pilote, même sans talent exceptionnel. Voie alternative crédible à la pure performance.

---

## 5. Scouting et recrutement [V1]

### 5.1 Potentiel caché

Le joueur ne voit **jamais la vraie valeur exacte** d'un jeune pilote, seulement une estimation floue fournie par son scout (ex. : « Potentiel : Moyen à Élevé »). Plus le scout est compétent et cher, plus la fourchette est précise. C'est le cœur du plaisir de découverte.

### 5.2 Réseau de scouts [V2]

Recrutement de scouts par région (France, Italie, Amérique du Sud, Asie...) pour découvrir des talents hors de son territoire habituel.

### 5.3 Managers rivaux [V2]

Des managers IA convoitent les mêmes pilotes. Course au recrutement : un talent repéré trop tard peut être signé par un concurrent.

---

## 6. Statistiques du pilote [V1]

Inspirées du système F1 Manager, réparties en catégories.

### 6.1 Pace (vitesse pure)
- Virages
- Freinage
- Réactions

### 6.2 Consistency (régularité)
- Précision
- Contrôle
- Fluidité

### 6.3 Racecraft (intelligence de course)
- Adaptabilité
- Dépassement
- Défense

### 6.4 Attributs spécifiques au concept manager

- **Potentiel de progression** (Faible / Moyen / Élevé / Exceptionnel) — plafond de développement, caché ou estimé (voir 5.1).
- **Agressivité** — plus de dépassements tentés, mais risque de crash accru.
- **Réputation du pilote** (distincte de celle du manager) — attire sponsors et écuries.
- **Moral** — affecté par les résultats, les tensions, le traitement médiatique.
- **Forme physique / Fatigue** — évolue selon la charge de la saison et le travail du préparateur physique.

---

## 7. Le pilote comme personnage [V1 partiel]

### 7.1 Traits de personnalité [V1]

Chaque pilote possède un ou plusieurs traits qui modifient sa progression ET les négociations :

- **Bosseur** : progresse plus vite à l'entraînement
- **Tête brûlée** : agressivité élevée, plus de crashs mais des dépassements spectaculaires
- **Chouchou des médias** : attire davantage de sponsors
- **Mercenaire** : ne signe qu'au plus offrant, peu fidèle
- **Fragile mentalement** : chute de moral rapide après un échec

### 7.2 Vieillissement et retraite [V1]

- Pic de forme entre 25 et 32 ans environ, puis déclin progressif des statistiques physiques.
- À la retraite du pilote, la partie **continue** avec un nouveau pilote à recruter → carrière de manager sur plusieurs générations, comme dans Football Manager.

### 7.3 Blessures [V2]

Un gros crash peut entraîner une blessure et faire manquer plusieurs courses.

### 7.4 Entourage du pilote [V2]

Parents envahissants en karting, qui financent une partie de la saison mais mettent la pression sur les résultats et les choix de carrière.

---

## 8. Progression dans la hiérarchie du sport [V1]

### 8.1 Échelle complète

**Karting Mini → Karting Cadet → Karting Junior → Karting Senior → Karting KZ → F4 → F3 → F2 → F1**

### 8.2 Superlicence FIA [V1]

Comme dans la réalité, l'accès à la F1 exige d'accumuler **40 points de superlicence sur 3 ans**, obtenus selon les classements dans les catégories inférieures. Contrainte de progression crédible et incontournable : un pilote ne peut pas sauter directement de la F3 à la F1 sans les points nécessaires.

### 8.3 Voies alternatives [V2]

Si la F1 est hors d'atteinte, d'autres carrières restent possibles et valorisantes :

- Formule E
- Endurance / WEC (24h du Mans)
- IndyCar
- Super Formula (Japon)

Un pilote « raté » en F1 peut devenir une légende en endurance — cela évite un sentiment de « game over » frustrant.

---

## 9. Écuries et contrats [V1]

### 9.1 Écuries fictives (noms inspirés du réel, pour éviter les problèmes de droits)

| Écurie réelle (inspiration) | Nom fictif proposé |
|---|---|
| Ferrari | Scuderia Rossa |
| Red Bull | Toro Energia |
| Mercedes | Silver Star Motorsport |
| McLaren | Papaya Racing |

Chaque écurie possède :

- un **seuil de réputation + statistiques minimum** pour proposer un contrat,
- un **niveau de voiture/budget** propre, influençant la performance indépendamment du pilote,
- une **exigence de résultat** contractuelle (base d'évaluation d'un éventuel renvoi).

### 9.2 Offres multiples et concurrentes [V1]

À partir d'un certain seuil de performance/réputation en fin de saison, plusieurs écuries peuvent proposer une offre simultanément. Chaque offre varie sur plusieurs axes :

- **Salaire fixe + primes** (points, podiums, victoires)
- **Voie de progression** : place directe dans la catégorie supérieure vs « programme jeunes pilotes » (reste un an de plus dans la catégorie actuelle avec un fort soutien budgétaire et matériel de l'écurie mère)
- **Visibilité/risque** : petite écurie avec plus de temps de piste et de liberté vs grosse écurie en tant que pilote n°2 avec moins de mise en avant

Interface de comparaison : colonnes **Salaire / Vitesse de progression prévue / Risque de renvoi / Prestige**.

### 9.3 Détail des contrats [V1 partiel]

- Durée du contrat
- Clause de départ / clause de libération si l'écurie ne tient pas ses promesses de performance
- Bonus de fidélité
- Droits à l'image [V2]

### 9.4 Négociation en plusieurs tours [V1]

Le manager peut faire une contre-proposition, mais chaque relance comporte un **risque que l'écurie se retire** de la négociation. Tension réelle entre optimiser le contrat et sécuriser la place.

### 9.5 Renvoi (mécanique de risque) [V1]

L'écurie évalue les résultats du pilote par rapport aux attentes du contrat :

- Résultats en dessous de l'objectif sur plusieurs courses consécutives → avertissement → rupture de contrat.
- Un pilote renvoyé doit généralement redescendre en catégorie inférieure pour reconstruire sa réputation.

---

## 10. Revenus et dépenses du manager [V1]

### 10.1 Revenus

- **Commission sur les gains de course** du pilote (indicatif : 10-15 %)
- **Commission sur transfert** lors de la signature d'un nouveau contrat (proportionnelle au prestige de l'écurie)
- **Prime de championnat** gagné par le pilote (bonus ponctuel)
- **Commission sur les sponsors** décrochés pour le pilote

### 10.2 Dépenses

- Inscriptions aux courses, transport, pneus, matériel
- Salaires du staff (voir section 13)
- Développement technique du kart / de la monoplace
- Frais de démarchage de sponsors et de scouting

---

## 11. Autour de la voiture (réalisme technique) [V1 partiel]

- **Développement technique [V1]** : budget R&D réparti entre châssis, aérodynamique, moteur — influence la performance indépendamment du talent du pilote.
- **Fiabilité [V1]** : risque de panne mécanique selon l'usure et la qualité du matériel, pouvant entraîner un abandon même en tête de course.
- **Réglementation évolutive [V2]** : changements de règles (aéro, plafond budgétaire) d'une saison à l'autre, obligeant à réadapter la stratégie.

---

## 12. Autour de la course (réalisme sportif) [V1 partiel]

- **Météo dynamique [V1]** (pluie, piste qui sèche), interagissant avec les stats du pilote.
- **Stratégie pneus et arrêts aux stands [V1]**, décidée par le manager avant/pendant la course.
- **Qualifications séparées [V1]** de la course, déterminant la grille de départ.
- **Incidents aléatoires [V1]** : accrochages, drapeaux jaunes/rouges, voiture de sécurité.
- **Essais libres [V2]** : week-end complet en trois temps (EL / Qualifs / Course).
- **Circuits réels [V1]** : tracés et noms de lieux réels pour le karting (ex. Salbris, Angerville) et la monoplace (ex. Spa-Francorchamps, Monza, Silverstone, Suzuka), **sans logos officiels FIA/F1/sponsors** pour éviter tout problème de licence.

---

## 13. Staff à recruter [V1 partiel]

Chaque membre du staff a un coût mensuel et un effet distinct :

| Rôle | Effet | Priorité |
|---|---|---|
| Ingénieur de course | Améliore les réglages, gain de performance en course | V1 |
| Préparateur physique | Réduit la fatigue, améliore la forme physique | V1 |
| Scout | Précise l'estimation du potentiel des jeunes pilotes | V1 |
| Attaché de presse | Améliore l'image médiatique, facilite l'obtention de sponsors | V1 |
| Coach mental | Stabilise le moral, réduit l'impact des mauvais résultats | V2 |
| Négociateur / avocat | Améliore les conditions obtenues en négociation de contrat | V2 |

---

## 14. Interface et immersion [V1 partiel]

- **Boîte de réception [V1]** façon Football Manager : mails de l'écurie, du pilote, des sponsors, de la presse, des scouts. C'est l'élément principal qui donne vie au jeu et transmet l'information au joueur.
- **Comparaison avec le coéquipier [V1]** : le vrai juge du niveau d'un pilote, écran de comparaison directe des performances.
- **Récompenses de fin de saison [V2]** : révélation de l'année, meilleur manager, hall of fame.
- **Historique de carrière [V2]** : palmarès complet du manager sur plusieurs générations de pilotes.

---

## 15. Nombre de pilotes gérés — Déblocage progressif [V1 / V2]

Le joueur ne choisit pas librement le nombre de pilotes qu'il gère : ce nombre se **débloque avec sa réputation de manager**. C'est cohérent avec le réalisme (un manager inconnu ne gère pas une écurie de talents) et cela donne un objectif de progression clair.

| Réputation manager | Pilotes gérables simultanément | Priorité |
|---|---|---|
| 1 – 3 | 1 pilote | V1 |
| 4 – 6 | 2 pilotes | V2 |
| 7 – 8 | 3 pilotes | V2 |
| 9 – 10 | 5 pilotes (véritable agence) | V2 |

**Objectif de gameplay :** le manager gagne de l'argent via ses commissions, donc plus il gère de pilotes, plus ses revenus augmentent — mais aussi ses dépenses et sa charge de gestion (plusieurs saisons, contrats et recherches de sponsors à mener en parallèle).

**Décision de développement :** la V1 se limite volontairement à **un seul pilote** pour garder la boucle de jeu simple à coder et à tester. Le multi-pilotes est une extension prévue une fois la V1 validée.

---

## 16. Direction artistique — Pas de 3D [V1]

**Décision : le jeu est entièrement en 2D.** Une scène 3D (podium, personnages, animations) représenterait une charge de production disproportionnée pour un développement solo, sans apporter de valeur décisive à un jeu de gestion, dont l'intérêt repose sur la profondeur de simulation.

**Traitement visuel retenu à la place :**

- **Podium en illustration 2D stylisée** : portrait du pilote, couleurs de son écurie, trophée, confettis.
- **Portrait de pilote 2D évolutif**, qui vieillit au fil de la carrière.
- **Courtes animations 2D** pour les moments forts (levée du trophée, signature de contrat).
- Interface principale orientée données : tableaux, graphiques, boîte de réception.

Une 3D éventuelle est repoussée sans échéance, et n'est pas considérée comme nécessaire au projet.

---

## 17. Formules de progression et de simulation [V1]

> Toutes les valeurs ci-dessous sont des points de départ, à ajuster lors des tests du prototype.

### 17.1 Progression d'une statistique

```
Gain = GainBase × CoeffÂge × CoeffStaff × CoeffMoral × (1 - StatActuelle / Plafond)
```

Le terme `(1 - StatActuelle / Plafond)` est le plus important : plus le pilote approche de son plafond, plus il progresse lentement. Cela évite qu'un pilote atteigne 99 partout et crée une courbe de progression réaliste.

**Plafond selon le potentiel**

| Potentiel | Plafond de base |
|---|---|
| Faible | 65 |
| Moyen | 78 |
| Élevé | 88 |
| Exceptionnel | 96 |

Une variation aléatoire de plus ou moins 3 points est appliquée stat par stat, afin que chaque pilote ait un profil unique (bon en freinage, faible en défense, etc.).

**Coefficient d'âge**

| Âge du pilote | CoeffÂge |
|---|---|
| 8 - 15 ans | 1,5 |
| 16 - 21 ans | 1,2 |
| 22 - 27 ans | 1,0 |
| 28 - 32 ans | 0,6 |
| 33 ans et + | 0,2 puis déclin de 1 à 3 points par an sur Réactions et Physique |

**Autres coefficients**

- **CoeffStaff** : de 1,0 (aucun staff) à 1,4 (ingénieur et préparateur physique de haut niveau).
- **CoeffMoral** : de 0,7 (moral au plus bas) à 1,3 (pilote en pleine confiance).

### 17.2 Note globale du pilote

```
Note = Pace × 0,40 + Consistency × 0,30 + Racecraft × 0,30
```

Correspond au chiffre unique affiché sur la fiche du pilote (équivalent du « 84 » dans F1 Manager).

### 17.3 Résultat d'une course

```
PerfTotale = Pilote × 0,40 + Voiture × 0,35 + Réglages × 0,15 + Aléa × 0,10
```

- La part d'aléa (météo, incidents, fiabilité) empêche que le meilleur pilote gagne systématiquement.
- Le classement final se calcule en comparant les PerfTotale de tous les pilotes de la grille.
- La part « Voiture » explique qu'un excellent pilote dans une mauvaise écurie ne gagne pas, exactement comme dans la réalité.

---

## 18. Système de réglages du véhicule [V1]

Inspiré directement de F1 Manager : chaque circuit possède un **réglage optimal caché**, et chaque pilote a ses **préférences propres** (certains aiment une voiture survireuse, d'autres non). Le joueur ne connaît jamais la valeur exacte : il la cherche par essais successifs.

### 18.1 Paramètres réglables

**En monoplace (F4 à F1)**

- Aileron avant
- Aileron arrière
- Barre anti-roulis
- Carrossage
- Pincement

**En karting (version simplifiée)**

- Pression des pneus
- Carburation
- Rigidité du châssis
- Rapport de transmission

### 18.2 Calcul de la qualité des réglages

```
Écart = |ValeurChoisie - (OptimalCircuit + PréférencePilote)|
Réglages = 100 - (somme des écarts normalisés)
```

Le score obtenu alimente directement la variable `Réglages` de la formule de course (section 17.3).

### 18.3 Retour du pilote — mécanique centrale

Après chaque tour d'essai, le pilote décrit ses sensations en langage naturel :

- « La voiture survire en entrée de virage »
- « Je manque d'appui en ligne droite »
- « Le train avant ne répond pas assez »

**La précision de ce retour dépend du niveau de l'ingénieur de course** : un ingénieur débutant donne des indications vagues, un expert oriente précisément vers le bon réglage. C'est ce qui justifie d'investir dans le staff.

Le joueur converge ainsi vers le réglage idéal au fil des séances d'essais, et **perd ce réglage à chaque nouveau circuit** — il faut tout recommencer à chaque week-end de course.

---

## 19. Économie chiffrée du jeu [V1]

### 19.1 Principe fondamental — Option A retenue

**L'argent des sponsors ne va pas dans la poche du manager : il finance directement la saison du pilote.** Le manager ne perçoit que sa commission.

Conséquences sur le gameplay :

- Le véritable travail du manager devient « trouver assez de sponsors pour que la saison soit finançable ».
- Le budget personnel du manager sert uniquement à couvrir ses propres frais (staff, scouting, déplacements) : c'est une réserve de survie, pas un porte-monnaie illimité.
- Ce n'est pas l'argent du manager qui fait rouler le pilote, c'est sa capacité à convaincre des sponsors. Fidèle au métier réel d'agent.

### 19.2 Coût d'une saison par catégorie

| Catégorie | Coût de la saison | Nombre de courses |
|---|---|---|
| Karting régional | 8 000 € | 6 |
| Karting national | 35 000 € | 8 |
| Karting international (KZ) | 100 000 € | 8 |
| F4 | 250 000 € | 15 |
| F3 | 900 000 € | 18 |
| F2 | 2 500 000 € | 24 |
| F1 | 0 € (le pilote est payé) | 24 |

Le saut entre karting national et F4 est volontairement brutal : c'est le point où la plupart des vrais talents s'arrêtent faute de financement. C'est le principal moteur de tension du jeu.

### 19.3 Gains en course

| Catégorie | Victoire | Titre de champion |
|---|---|---|
| Karting régional | 300 € | 1 500 € |
| Karting national | 1 500 € | 8 000 € |
| F4 | 3 000 € | 30 000 € |
| F3 | 15 000 € | 150 000 € |
| F2 | 40 000 € | 400 000 € |

### 19.4 Salaires en F1

| Statut du pilote | Salaire annuel |
|---|---|
| Rookie en petite écurie | 800 000 € |
| Pilote confirmé, milieu de grille | 5 000 000 € |
| Pilote de top écurie | 20 000 000 € |
| Champion du monde | 40 000 000 € |

### 19.5 Sponsors — emplacements et montants

Le pilote dispose d'un nombre limité d'emplacements publicitaires, qui augmente avec sa catégorie : casque et combinaison en karting (2 emplacements), puis kart/voiture, manches, casquette, jusqu'à 6 à 8 emplacements en F1.

| Niveau | Montant par saison |
|---|---|
| Commerce local | 500 - 5 000 € |
| PME régionale | 5 000 - 25 000 € |
| Marque nationale | 25 000 - 150 000 € |
| Grand groupe | 150 000 - 1 000 000 € |
| Sponsor mondial | 1 000 000 - 15 000 000 € |

### 19.6 Commissions du manager

| Source | Commission |
|---|---|
| Gains de course | 10 % |
| Salaire du pilote | 10 % |
| Sponsors décrochés | 15 % |
| Transfert vers une écurie | 5 % (petite écurie) à 15 % (top écurie) du montant du contrat |
| Titre de champion | 20 % de la prime |

### 19.7 Salaires du staff (mensuels)

| Rôle | Débutant | Expert |
|---|---|---|
| Scout | 800 € | 4 000 € |
| Ingénieur de course | 1 500 € | 12 000 € |
| Préparateur physique | 1 000 € | 6 000 € |
| Attaché de presse | 1 200 € | 8 000 € |

### 19.8 Courbe économique en trois phases

**Phase 1 — Karting : la survie**
Les commissions sont dérisoires (10 % de 300 € par victoire). Le budget personnel du manager fond, il faut jongler avec les sponsors locaux pour boucler chaque saison. Tension maximale, chaque euro compte.

**Phase 2 — F4 / F3 / F2 : l'équilibre fragile**
Les sponsors sont plus conséquents, les commissions commencent à couvrir les frais de staff. Le manager ne s'enrichit pas mais ne coule plus. C'est aussi la phase la plus coûteuse (2,5 M€ à trouver en F2), donc le risque de tout perdre reste élevé.

**Phase 3 — F1 : la rentabilité**
Le pilote est payé au lieu de payer. Une commission de 10 % sur un salaire de 20 M€ représente 2 M€ par an, auxquels s'ajoutent les sponsors mondiaux. C'est là que le manager rentabilise une décennie d'efforts, et qu'il peut enfin se permettre de gérer plusieurs pilotes (voir section 15).

### 19.9 Exemple de première saison (budget faible : 20 000 €)

| Poste | Montant |
|---|---|
| Saison karting régional | - 8 000 € |
| Scout débutant (800 € × 12) | - 9 600 € |
| Commission sur 3 victoires (3 × 300 € à 10 %) | + 90 € |
| Commission sur 2 sponsors locaux (6 000 € à 15 %) | + 900 € |
| **Solde de fin de saison** | **- 16 610 €** |

Sans sponsors suffisants pour financer la saison du pilote (option A), le manager est en faillite avant la saison 2. La recherche de sponsors n'est donc pas optionnelle : c'est la condition de survie du jeu.

---

## 20. Interactions et relations humaines [V1]

C'est la couche qui transforme un tableau de statistiques en jeu vivant. Inspirée des conférences de presse et des discussions individuelles de Football Manager.

### 20.1 Interactions manager vers pilote

Après une course ou pendant la semaine, le manager choisit un ton pour s'adresser à son pilote :

| Ton employé | Effet si bien dosé | Effet si mal dosé |
|---|---|---|
| Féliciter | Moral en forte hausse | Le pilote se repose sur ses lauriers, motivation en baisse |
| Encourager | Moral en hausse | Effet neutre |
| Recadrer / engueuler | Sursaut d'orgueil, agressivité en hausse pour la course suivante | Moral en forte baisse, relation dégradée |
| Rassurer | Stabilise le moral après un crash ou un échec | Effet neutre |
| Fixer un ultimatum | Forte motivation si le pilote a du caractère | Rupture de confiance si le pilote est fragile |

**Mécanique centrale : l'effet dépend du trait de personnalité du pilote** (voir section 7.1). Engueuler un pilote « Fragile mentalement » le détruit ; engueuler une « Tête brûlée » le réveille. Le joueur doit apprendre à connaître son pilote plutôt qu'appliquer une recette universelle.

### 20.2 Conférences de presse

Après chaque course, un journaliste pose une question au manager. Exemple après une contre-performance :

> « Votre pilote a terminé 14e. Est-ce qu'il a vraiment le niveau pour cette catégorie ? »

| Réponse possible | Conséquences |
|---|---|
| Défendre le pilote | Moral du pilote en hausse, mais la presse juge le manager complaisant |
| Reconnaître l'échec | Crédibilité médiatique en hausse, mais le pilote encaisse mal |
| Blâmer la voiture ou l'écurie | Le pilote apprécie, l'écurie se braque (risque sur le contrat) |
| Éluder la question | Aucun effet, option de sécurité |

Chaque réponse affecte trois jauges : **Moral du pilote**, **Relation avec l'écurie**, **Image médiatique** (qui conditionne l'attractivité auprès des sponsors).

### 20.3 Interactions du pilote vers le manager

Le pilote écrit spontanément dans la boîte de réception du manager :

- « Je ne me sens pas en confiance avec cette écurie »
- « J'ai reçu une offre, qu'est-ce que tu en penses ? »
- « Mon coéquipier reçoit un meilleur matériel que moi »
- « Je veux plus de temps d'essai avant la prochaine course »

Ignorer ces messages dégrade la relation. Y répondre coûte parfois de l'argent, du temps, ou une négociation avec l'écurie.

### 20.4 Jauge de relation manager-pilote

- **Relation forte** : le pilote reste fidèle même face à une offre concurrente d'un autre manager.
- **Relation dégradée** : le pilote change de manager, et le joueur perd toutes ses commissions futures sur ce pilote. C'est l'un des risques majeurs du jeu.

---

## 21. Décisions de structure [V1]

### 21.1 Nombre de courses par saison

Les chiffres réalistes de la section 19.2 sont conservés (6 courses en karting régional jusqu'à 24 en F1). Pour éviter la lourdeur sur mobile, chaque course peut être abordée de deux manières :

- **Course détaillée** : réglages, essais, qualifications, stratégie de course.
- **Simulation rapide** : résultat calculé en quelques secondes, sans intervention.

Le joueur choisit course par course, ce qui préserve le réalisme du calendrier sans imposer 24 sessions complètes par saison.

### 21.2 Structure d'un week-end de course

Trois formats selon la catégorie, reflétant la réalité du sport et allégeant les débuts de carrière :

| Catégorie | Déroulé du week-end |
|---|---|
| Karting | Essais → Course |
| F4 / F3 / F2 | Essais → Qualifications → Course |
| F1 | Essais libres → Qualifications → Course (réglages complets) |

### 21.3 Modèle économique — Décision reportée

**Le jeu est développé sans objectif commercial dans un premier temps.** L'auteur le conçoit d'abord pour lui-même ; la question de la monétisation ne sera tranchée qu'une fois le jeu terminé et jugé satisfaisant.

**Piste recommandée le cas échéant : achat unique, entre 5 et 8 €, sans publicité ni achats intégrés.**

Justification à conserver pour cette décision future :

- Le public visé (amateurs de F1 et de jeux de gestion) rejette massivement le free-to-play, car payer pour progresser vide un jeu de gestion de son intérêt.
- Motorsport Manager Mobile a rencontré le succès sur ce modèle payant sans publicité.
- Un modèle free-to-play imposerait de concevoir le jeu autour de la monétisation (attentes artificielles, système d'énergie, packs de talents), en contradiction directe avec le parti pris réaliste du projet.
- Variante possible : démo gratuite limitée au karting, achat unique pour débloquer la monoplace.

---

## 22. Points ouverts / à trancher

- Écrans et interface détaillée, à définir une fois la boucle de jeu validée.
- Ajustement final des coefficients après les premiers tests du prototype.
- Modèle économique, à reconsidérer après achèvement du jeu (voir 21.3).

---

## 23. Prochaines étapes suggérées

1. Définir la boucle de jeu complète écran par écran.
2. Construire un **prototype jouable en HTML** limité au périmètre V1, pour vérifier que la boucle de base est amusante avant tout développement mobile natif.
3. Ajuster les formules et l'équilibrage à partir des tests du prototype.

---

## Note de méthode

Le document est volontairement riche, mais le principal risque d'un projet solo est d'empiler les fonctionnalités sans jamais vérifier que la boucle de base est plaisante à jouer. Le marquage **[V1] / [V2]** sert à protéger le projet de ce piège : tout ce qui est marqué V2 est une bonne idée à garder, mais à ne développer qu'après avoir un jeu jouable et testé.
