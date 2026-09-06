# Planning Secrétaires — Urgences CH Mâcon

Application web de génération automatique et d'édition du planning des secrétaires
des urgences (service continu, 7 j/7, jour et nuit).

Ouvrir `index.html` — il n'y a rien à installer.

---

## 1. Architecture

**Un seul fichier HTML autonome, en JavaScript natif, sans dépendance ni serveur.**

Ce choix suit celui des autres applications du dépôt (`poulailler/`) et répond aux
contraintes du besoin :

| Contrainte | Conséquence |
|---|---|
| Utilisatrice non technique | Aucune installation, aucun compte : on ouvre un fichier |
| Poste hospitalier verrouillé | Pas de serveur, pas de base à administrer, pas de port réseau |
| Doit fonctionner hors ligne | PWA : `sw.js` met tout en cache, y compris la police |
| Données de planning (RH, congés) | Rien ne sort du poste — pas d'envoi réseau |
| Diffusion papier | Feuille d'impression A4 paysage dédiée + export Excel |

Stockage : **`localStorage`** (mémoire du navigateur), avec export/import JSON pour la
sauvegarde et le transfert d'un poste à l'autre. Une base type SQLite imposerait un
serveur ou une installation ; pour une responsable de planning unique, le rapport
robustesse/complexité penche nettement pour le fichier local + sauvegarde explicite.

> Si le planning doit un jour être **consulté par toute l'équipe**, la brique à ajouter
> est un partage en lecture (dépôt du JSON sur un lecteur réseau, ou publication de la
> grille en HTML). Le format de données est déjà prêt pour cela.

```
planning-urgences/
├── index.html      application complète (structure, styles, moteur, interface)
├── manifest.json   PWA — installable comme une application de bureau
├── sw.js           service worker — fonctionnement hors ligne
├── icon.svg / icon-192.png / icon-512.png
└── README.md
```

`index.html` est organisé en sections numérotées et commentées :

| § | Rôle |
|---|---|
| 1 | Modèle : codes, effectif, configuration, persistance |
| 2 | Outils : dates, semaines ISO, jours fériés |
| 3 | Accès au planning et primitives de règles (repos, séries, plafonds) |
| 4 | **Moteur de génération** |
| 5 | **Contrôle des règles** |
| 6 | Affichage (grille, tableaux) |
| 7 | Édition d'une case |
| 8 | Exports (Excel, PDF, sauvegarde) |
| 9 | Événements |
| 10-11 | Aide en ligne et démarrage |

## 2. Modèle de données

```js
etat = {
  agents: [{ id, nom, prenom, quotite, roulement, groupeWE, jourJA, bloque, recAncre, actif, remplacant }],
  planning: { "<agentId>|<AAAA-MM-JJ>": { c:code, n:annotation, v:verrou, d:dépannage, m:manuel } },
  config: { besoins, rhParSemaine, recSemaines, reposMinHeures, maxJoursConsecutifs, … },
  moisAffiche: "AAAA-MM"
}
```

L'`id` de l'agent est **stable et indépendant du nom** : renommer une secrétaire
(départ / nouvelle recrue) n'exige aucune reconstruction de l'historique.

Les horaires sont exprimés en **heures depuis minuit du jour où le code est posé** :
`S` finit à 24 h, `N` finit à 31 h (7 h le lendemain). Le repos entre deux postes est
alors une simple soustraction, ce qui rend la règle des 11 h exacte y compris à cheval
sur deux jours :

| Enchaînement | Repos | |
|---|---|---|
| S → M (lendemain) | 7 h | refusé |
| S → J (lendemain) | 9 h | refusé |
| S → DJ (lendemain) | 11 h | accepté (limite) |
| N → N (lendemain) | 12 h | accepté — c'est ce qui permet les cycles de nuit |
| N → tout poste de jour (lendemain) | 0 à 7 h | refusé |

## 3. Moteur de génération

1. **Nettoyage** de la période — les CR, les cases verrouillées 🔒, les modifications
   manuelles et les annotations libres sont préservées.
2. **REC** : pose des récupérations arrivées à échéance (compteur individuel de 6 semaines
   à partir de l'ancre de chaque agent, décalage au jour libre le plus proche si occupé).
3. **Semaine par semaine** : constitution de l'équipe de nuit (les agents « nuit », complétés
   par les agents « mixte » qui n'ont pas fait de nuit depuis le plus longtemps, en
   garantissant qu'au moins un d'entre eux est de tour ce week-end-là).
4. **Jour par jour, samedi et dimanche d'abord** : le week-end ne dispose que de la moitié
   de l'effectif (alternance A/B), il doit être servi avant que les jours de semaine
   n'épuisent les plafonds hebdomadaires.
   Les postes sont pourvus dans l'ordre `N, S, M, J, DJ` — du plus contraignant au moins
   contraignant.
5. **Choix de l'agent** : parmi ceux qui passent tous les filtres, celui qui obtient le
   meilleur score — équité de charge globale, équité par poste, équité des week-ends,
   continuité du roulement, série de travail la plus courte.
6. **Étiquetage** : 1 JA par semaine pour chaque agent à temps partiel — sur le jour souhaité
   s'il en a un, sinon contre un jour travaillé pour garder les RH groupés. RH pour tout le reste.

Le tirage au sort de départage est **déterministe** : deux générations successives sur la
même période produisent exactement le même planning.

### Dépannage progressif

Si aucun agent ne passe les filtres, ils sont relâchés par paliers, et la case est
marquée « dépannage » (coin orange) avec le motif consigné dans le rapport :

| Palier | Ce qui est relâché |
|---|---|
| 1 | appel aux remplaçants (si l'option est cochée) |
| 2 | alternance des week-ends |
| 3 | séparation des roulements jour et nuit |

**Jamais relâchés, à aucun palier :**

- les 11 h de repos entre deux postes ;
- la limite de 6 jours travaillés consécutifs ;
- la limite de 2 nuits consécutives, et le repos sécurité qui suit chaque bloc ;
- le budget hebdomadaire (voir ci-dessous) ;
- les disponibilités déclarées de l'agent ;
- l'unicité du poste de nuit.

Le « RH réduit » évoqué dans le besoin initial se produit naturellement sans franchir
ces limites : en semaine ordinaire un agent à 80 % travaille 2 à 3 jours, bien en dessous
de son plafond de 4 ; c'est en période chargée que le planning le fait monter jusqu'à ce
plafond. Au-delà, le poste est signalé **non couvert** plutôt que confié à quelqu'un
au-delà de ce que sa quotité autorise : la responsable arbitre (renfort, intérimaire,
congé décalé), et le manque lui saute aux yeux au lieu d'être absorbé en silence.

## 4. Règles implémentées

| Règle | Où |
|---|---|
| 1 M + 1 J + 1 DJ + 1 S + 1 N par jour, week-ends compris | `config.besoins` (modifiable) |
| Poste N tenu par une seule personne | filtre + contrôle, jamais relâché |
| 11 h de repos entre deux postes | `reposOK` / `reposEntre`, jamais relâché |
| Roulements jour et nuit distincts | équipe de nuit hebdomadaire |
| Maximum 6 jours travaillés consécutifs | `serieAvec` |
| Maximum 2 nuits consécutives, puis repos sécurité | `nuitsConsecutivesAvec`, `poserRS` |
| 1 week-end sur 2 | groupes A/B × rang de la semaine |
| 2 RH par semaine en moyenne | plafond hebdomadaire (5 j à 100 %, 4 j à 80 %) |
| 1 JA par semaine pour les agents à 80 % | `poserJAetRH` |
| Jour de JA souhaité par l'agent | pénalité de score, non bloquante |
| Disponibilités récurrentes par agent | filtre dur, jamais relâché |
| REC automatique toutes les 6 semaines | ancre individuelle `recAncre` |

Toutes sont **également vérifiées après coup** par `controler()`, y compris sur un planning
modifié à la main : l'onglet **Contrôles** liste chaque écart, et l'éditeur de case
prévient *avant* validation.

### Le budget de la semaine

Un plafond fixe (4 jours à 80 %, 5 à 100 %) ne suffit pas : une semaine ne fait que
7 jours et tout doit y tenir. `tientDansLaSemaine()` vérifie donc, avant chaque
affectation, que l'équation reste satisfaite :

```
jours travaillés + repos sécurité + congés et REC posés + journée aménagée
                 + RH réglementaires  ≤  7
```

Conséquences directes, toutes vérifiées par les tests :

- une semaine où tombe un REC descend à 3 jours travaillés pour un 80 %, sinon il ne
  resterait qu'un seul RH ;
- **une nuit isolée coûte deux jours de semaine** (elle-même et son repos sécurité), ce
  qui limite un agent à 2 nuits par semaine environ. L'équipe de nuit compte donc
  4 agents par semaine et non 3.

C'est cette équation, et non un plafond fixe, qui garantit les 2 RH hebdomadaires.

### Repos sécurité (RS)

Le service fait 1 ou 2 nuits d'affilée, jamais plus, suivies d'un repos sécurité.
`nuitsConsecutivesAvec()` plafonne les blocs à 2, et `poserRS()` pose le RS le lendemain
de la dernière nuit de chaque bloc. Le RS interrompt le décompte des jours consécutifs.

### Rythme des blocs

Le service travaille par blocs de 2 à 3 jours plutôt que par journées isolées. Le score
pénalise donc une affectation qui créerait une journée de travail entourée de repos, et
favorise celles qui prolongent un bloc existant ou soudent deux blocs séparés d'un jour.

La pénalité a été calibrée par balayage sur 3 mois générés :

| Pénalité | Journées isolées | Blocs de 2-3 j | Repos moyen | Écart de charge |
|---|---|---|---|---|
| 0 | 36 % | 52 % | 3,6 j | 1 poste |
| −35 (retenue) | **24 %** | **64 %** | **3,9 j** | 2 postes |
| −70 | 17 % | 62 % | 4,4 j | 3 postes |

−35 domine −70 : autant de blocs de 2-3 jours, mais des plages de repos plus courtes.
Avant ce réglage, le score pénalisait au contraire tout regroupement et produisait
58 % de journées de travail isolées.

### Partage et droits d'accès

Ouverte depuis le fichier local, l'application travaille en mémoire du navigateur et
reste mono-utilisatrice. Publiée en ligne, elle range le planning dans un espace
partagé (capacité `db`) pour que les collègues voient bien *celui de la responsable*
et non une grille vide qui leur serait propre. Découpage : `config/general` pour
l'effectif et les réglages, `planning/<AAAA-MM>` pour les cases d'un mois — un
document par mois reste loin de la taille maximale et changer un mois ne réécrit pas
toute l'année. Le mois affiché est suivi en direct.

Les droits ne sont pas décidés par la page — un contrôle écrit en JavaScript serait
décoratif, puisque n'importe qui peut lire le code d'une page. Ils sont déclarés à la
publication et appliqués par le service :

```js
capabilities: { db: { rules: [
  { path: "",      read: "interact", write: "admin" },   // consulter / modifier
  { path: "acces", read: "owner",    write: "owner" },   // registre privé
]}}
```

Deux barrières se superposent. La première, appliquée par le service : l'accès se
donne par adresse e-mail depuis le menu *Partager* de la page, avec deux niveaux : « peut consulter » (lecture seule) et « peut modifier ». La page ne fait
qu'adapter son affichage : elle établit ses droits en tentant une écriture anodine,
masque les commandes de modification en consultation et n'affiche l'onglet *Accès*
qu'à la propriétaire. Ce registre lui sert de mémoire — qui a été autorisé, à quel
niveau, depuis quand.

La seconde barrière est un **code personnel** par personne, demandé à l'ouverture.
Elle répond à un risque que le partage seul ne couvre pas : une collègue autorisée qui
ferait suivre le lien. Le destinataire tombe alors sur un écran de saisie, et le code
étant nominatif, la responsable sait lequel a servi. Retirer quelqu'un du registre
désactive son code aussitôt ; « Créer un code » en génère un nouveau et annule l'ancien.
Tant qu'aucun code n'existe, la page s'ouvre sans en demander.

Les codes en clair restent dans l'espace réservé à la propriétaire ; seules leurs
empreintes SHA-256 sont lisibles par les autres, ce qui permet à la page de vérifier une
saisie sans jamais contenir la liste. Format : 8 caractères d'un alphabet sans I, O, 0
ni 1, pour éviter les erreurs de lecture. Cette barrière dissuade la rediffusion, elle
ne prétend pas résister à quelqu'un de déterminé et techniquement outillé — c'est la
première barrière qui joue ce rôle.

> **Limite arithmétique connue.** Avec 5 postes par jour et 14 agents, un agent à 80 %
> travaille 2,4 jours par semaine et se repose donc 4,6 jours. Des blocs de travail de
> 2 à 3 jours impliquent mécaniquement des plages de repos de 3 à 5 jours : on ne peut
> pas obtenir simultanément « travail par blocs de 2-3 jours » et « repos de 2-3 jours »
> à ce niveau d'effectif. Le compromis retenu privilégie les blocs de travail.

### Publication de la version en ligne

`python3 apercu.py` reconstruit `apercu-en-ligne.html` (non versionné) depuis
`index.html` : l'hébergement fournit lui-même `<!doctype>`, `<html>`, `<head>` et
`<body>`, et le service worker n'a pas de sens dans un cadre cloisonné. Le script
s'arrête sur assertion plutôt que de publier un fichier amputé — il vérifie notamment
que `id="cssApp"` survit, sans quoi le document imprimable sortirait sans mise en
forme, en silence.

### Impression sous cloisonnement

Consultée par le lien de partage, la page tourne dans un cadre `sandbox` sans
`allow-modals` : `window.print()` y est **ignoré sans exception ni message**, et le
bouton paraît mort. Aucune API ne déclare cet état ; le témoin retenu est l'événement
`beforeprint`, qui ne part pas quand l'appel a été écarté. D'où la cascade de
`imprimer()` :

| Étape | Condition | Résultat |
|---|---|---|
| 1. `window.print()` | `beforeprint` a été émis | la fenêtre d'impression s'ouvre, on s'arrête là |
| 2. `window.open()` | la page est dans un cadre et la pop-up passe | le planning est réécrit dans un onglet ordinaire, qui s'imprime seul |
| 3. `downloads.save()` | pop-up refusée | le planning devient un fichier `.html` à ouvrir d'un double-clic |

Le repli n'est armé que si la page est effectivement dans un cadre
(`window.self !== window.top`) : hors cadre, un `beforeprint` manquant signalerait un
navigateur atypique, pas un blocage, et le repli serait une gêne.

`pageImprimable()` construit le document autonome à partir de la feuille de style de
l'application, lue dans `#cssApp`, et de la grille telle qu'elle est affichée. Ses
règles `@media print` sont **extraites de leur bloc** par `reglesImpression()` — un
simple comptage d'accolades — pour valoir aussi à l'écran : le document montre alors
la feuille telle qu'elle sortira. `@page{size:A4 landscape}` remonte au passage à la
racine, où il reste valide.

> **Piège de spécificité, deuxième occurrence.** La règle d'écran
> `tbody th.agent-col{font-size:12.5px}` (0,1,2) l'emportait sur la règle d'impression
> `th.agent-col{font-size:7.5px}` (0,1,1) : une `@media` n'ajoute pas de spécificité.
> Les noms sortaient tronqués (`MARIAMO…`) sans que rien ne le signale. Même cause que
> le `td.day{background:#fff}` qui effaçait les couleurs des codes. Toute règle
> d'impression qui vise un élément déjà stylé par un sélecteur plus profond doit
> reprendre ce niveau.

### Amplitude horaire d'un agent

L'amplitude s'écrit `[ouverture, fermeture]` en heures depuis minuit, la fermeture
pouvant déborder sur le lendemain : `14 h – 7 h` s'écrit `[14, 31]`. Un poste n'est
tenable que s'il tient entièrement dans la fenêtre, ce dont `postesHorsAmplitude()`
déduit les créneaux à barrer.

| Amplitude | Postes tenables | Agents |
|---|---|---|
| 7 h – 19 h | M, J, DJ | GOY |
| 14 h – 7 h | S, N | REHILA, LACHARME, GARDIN, PERRET, LAFAURIE |
| toute la journée | les cinq | les autres |

**Conséquence structurelle, mesurée.** Ces amplitudes coupent l'équipe en deux :
huit agents seulement peuvent tenir les trois postes du matin (M, J, DJ), soit
21 postes par semaine, tandis que treize se partagent les 14 postes de soir et de
nuit. Le premier groupe travaille davantage, et l'alternance des week-ends, qui en
écarte la moitié chaque samedi, impose parfois une dérogation — toujours signalée.

Deux termes du score corrigent ce que la structure permet encore :

- **priorité à l'agent le plus contraint** (poids 60 par poste indisponible) : sans
  elle, ceux qui ont le choix se servent d'abord et l'agent restreint n'atteint plus
  son temps de travail. Calibrée par balayage — l'écart entre agents à 80 % revient de
  68 h à 38 h sur 13 semaines, et celui entre les deux équipes de 3,1 à 1,3 h par semaine ;
- **concentration des nuits par paires** (pénalité -120) : jour et nuit ne se mélangeant
  pas, une nuit isolée immobilise l'agent toute la semaine pour 12 h. Sans cette
  pénalité l'équipe de nuit tombait à 21,4 h par semaine contre 23,2 h pour celle de jour.

PERRET, seul agent dont l'amplitude et le roulement ne laissent qu'un poste (S), est le
cas limite : son temps de travail dépend entièrement de la disponibilité de ce poste.

### Disponibilités récurrentes

`agent.bloque` liste les créneaux que l'agent ne peut pas tenir, sous la forme
`"<jour>:<poste>"` — `2:N` = pas de nuit le mercredi, une liste vide = disponible sur tout.
La saisie se fait dans une grille 7 jours × 5 postes (colonne *Disponibilités* de l'onglet
Équipe), avec des raccourcis pour les cas courants.

Le filtre est **dur et jamais relâché**, au même rang qu'un congé posé : aucun palier de
dépannage ne force un agent sur un créneau qu'il a déclaré impossible. Si plus personne
n'est disponible, le poste est signalé *non couvert* dans le rapport et dans l'onglet
Contrôles, et la responsable arbitre — quitte à poser la case elle-même, l'éditeur
l'avertissant sans l'en empêcher.

Deux conséquences volontaires :

- un jour dont les 5 créneaux sont barrés devient le jour non travaillé de l'agent et
  accueille en priorité sa JA — sinon il recevrait un RH et l'agent travaillerait un jour
  de moins que sa quotité ;
- le REC évite les jours que l'agent n'aurait de toute façon pas travaillés (jour barré,
  ou week-end qui n'est pas son tour), pour ne pas gâcher une vraie journée de récupération.

### Jour de JA souhaité

Un agent à temps partiel peut demander sa JA un jour fixe (`jourJA`, colonne *JA souhaitée*
de l'onglet Équipe). Ce souhait est appliqué par une **forte pénalité de score** et non par
un filtre strict : l'agent n'est affecté ce jour-là qu'en tout dernier recours — avant
toutefois de déranger un remplaçant. Si cela arrive, sa JA glisse simplement à un autre jour
de la même semaine, sans marquer la case en dépannage, et le rapport de génération le signale.

Mesuré sur 3 mois avec trois agents demandant le mercredi : **36 JA sur 36 posées le jour
souhaité**, aucun dépannage, aucun mercredi en sous-effectif. Le comportement tient encore
avec six agents sur le même jour.

## 5. Capacité du service

La configuration livrée — 1 agent sur chacun des 5 postes — reproduit exactement
l'effectif décrit par le service, heure par heure :

| Tranche | Présentes | Postes |
|---|---|---|
| 00h — 07h | 1 | N |
| 07h — 09h | 1 | M |
| 09h — 11h | 2 | M, J |
| 11h — 14h | 3 | M, J, DJ |
| 14h — 16h | 4 | M, J, DJ, S |
| 16h — 17h | 3 | J, DJ, S |
| 17h — 19h | 2 | DJ, S |
| 19h — 00h | 2 | S, N |

L'onglet Réglages affiche ce tableau en direct : il se recalcule dès que l'on modifie
le nombre d'agents par poste, ce qui permet de vérifier la configuration dans les termes
où le service se pense réellement.

Comportement mesuré sur 3 mois, avec 14 agents (3 à 100 %, 11 à 80 %) :

| Besoins/jour | Postes/sem. | Dépannages | Non couverts | Jours travaillés /80 %/sem. | RH/sem. |
|---|---|---|---|---|---|
| **5 (configuration réelle)** | 35 | 0 | 0 | **2,4** | 3,4 |
| 6 | 42 | 6 | 0 | 2,9 | 2,9 |
| 7 | 49 | 23 | 0 | 3,4 | 2,5 |
| 8 | 56 | 68 | 24 | 3,7 | 2,1 |

À la configuration réelle, un agent à 80 % travaille 2,4 jours par semaine — ce que
confirme le service (« 2 à 3 jours, jusqu'à 4 pendant les vacances scolaires »). Au-delà
de 7 postes/jour l'équipe dépasse sa capacité contractuelle : le déficit apparaît alors
en postes non couverts, ce qui est un signal d'effectif et non un défaut de l'application.
