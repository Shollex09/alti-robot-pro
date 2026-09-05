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
  agents: [{ id, nom, prenom, quotite, roulement, groupeWE, jourJA, recAncre, actif, remplacant }],
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
| 2 | plafond hebdomadaire — c'est le « RH réduit » |
| 3 | alternance des week-ends |
| 4 | jours consécutifs et séparation jour/nuit |

**Jamais relâchés, à aucun palier** : les 11 h de repos et l'unicité du poste de nuit.
Si même le palier 4 ne trouve personne, le poste reste vide et est signalé comme non
couvert plutôt que d'être comblé au mépris du repos légal.

## 4. Règles implémentées

| Règle | Où |
|---|---|
| 1 M + 1 J + 1 DJ + 1 S + 1 N par jour, week-ends compris | `config.besoins` (modifiable) |
| Poste N tenu par une seule personne | filtre + contrôle, jamais relâché |
| 11 h de repos entre deux postes | `reposOK` / `reposEntre`, jamais relâché |
| Roulements jour et nuit distincts | équipe de nuit hebdomadaire |
| Maximum 4 jours travaillés consécutifs | `serieAvec` |
| 1 week-end sur 2 | groupes A/B × rang de la semaine |
| 2 RH par semaine en moyenne | plafond hebdomadaire (5 j à 100 %, 4 j à 80 %) |
| 1 JA par semaine pour les agents à 80 % | `poserJAetRH` |
| Jour de JA souhaité par l'agent | pénalité de score, non bloquante |
| REC automatique toutes les 6 semaines | ancre individuelle `recAncre` |

Toutes sont **également vérifiées après coup** par `controler()`, y compris sur un planning
modifié à la main : l'onglet **Contrôles** liste chaque écart, et l'éditeur de case
prévient *avant* validation.

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

Avec 14 agents (3 à 100 %, 11 à 80 %), la capacité contractuelle est de **59 postes par
semaine**. Comportement mesuré sur 3 mois :

| Besoins/jour | Postes/sem. | Dépannages | Postes non couverts | Jours travaillés /agent/sem. | RH/sem. |
|---|---|---|---|---|---|
| 5 | 35 | 0 | 0 | 2,5 | 3,5 |
| 6 | 42 | 6 | 0 | 3,0 | 3,0 |
| 7 | 49 | 22 | 0 | 3,5 | 2,5 |
| 8 | 56 | 103 | 0 | 4,0 | 2,0 |

À 8 postes/jour le service tourne à 95 % de sa capacité contractuelle : les dépannages
deviennent structurels (plafond hebdomadaire dépassé), c'est un signal d'effectif, pas un
défaut de l'application. **Les 11 h de repos et la limite de 4 jours consécutifs tiennent
à tous les niveaux.**
