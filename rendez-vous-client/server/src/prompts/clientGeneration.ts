import type { ChantierType, Niveau } from "../types.js";

export const CHANTIER_TYPES: ChantierType[] = [
  "taille_haie",
  "elagage_abattage",
  "allee",
  "terrasse",
  "cloture",
  "engazonnement",
  "debroussaillage",
  "entretien_annuel",
  "drainage",
  "massifs_plantations",
];

const CHANTIER_LABELS: Record<ChantierType, string> = {
  taille_haie: "taille de haie",
  elagage_abattage: "élagage / abattage d'arbre",
  allee: "création d'allée (gravier, pavés ou béton désactivé)",
  terrasse: "création de terrasse",
  cloture: "pose de clôture",
  engazonnement: "engazonnement",
  debroussaillage: "débroussaillage d'un terrain",
  entretien_annuel: "contrat d'entretien à l'année",
  drainage: "drainage",
  massifs_plantations: "création de massifs / plantations",
};

export function chantierLabel(type: ChantierType): string {
  return CHANTIER_LABELS[type];
}

const NIVEAU_CONSIGNES: Record<Niveau, string> = {
  facile:
    "Client peu porté sur la négociation, plutôt clair dans ses attentes, même s'il a déjà un ou deux devis ailleurs. Ses objections sont légères. Son critère de décision principal ne doit pas être uniquement le prix.",
  moyen:
    "Client qui compare plusieurs prestataires et négocie un peu. Il a de vraies objections et pose la question \"pourquoi vous et pas un autre ?\". Il a souvent déjà 1 à 2 devis concurrents.",
  difficile:
    "Client dur en négociation : objections fortes, tentatives répétées de faire baisser le prix, méfiance ou exigence élevée. Il a presque toujours au moins 2 devis concurrents, parfois nettement moins chers. Son critère de décision principal est souvent (mais pas toujours) le prix.",
};

export function buildClientGenerationPrompt(
  niveau: Niveau,
  chantierType: ChantierType,
): { system: string; user: string } {
  const system = `Tu es un générateur de personnages pour un simulateur d'entraînement commercial destiné à un paysagiste indépendant (Alex'Térieur Jardin & Création) basé à Bâgé-Dommartin, dans l'Ain (secteur Mâcon / Ain / Saône-et-Loire).

Tu dois générer une fiche client secrète, réaliste et cohérente, au format JSON strict, pour un rendez-vous de vente simulé. Cette fiche ne sera JAMAIS montrée telle quelle au joueur : elle sert à faire jouer le client par une autre IA et à noter la performance du paysagiste ensuite.

Réponds UNIQUEMENT avec un objet JSON valide (aucun texte avant/après, aucune balise markdown), respectant exactement ce schéma TypeScript :

{
  "prenom": string,
  "nom": string,
  "age": number,
  "profession": string,
  "commune": string, // commune réaliste de l'Ain ou de Saône-et-Loire, proche de Mâcon/Bâgé-Dommartin
  "typeLogement": string, // ex: "maison individuelle avec jardin", "longère rénovée", "pavillon récent en lotissement"...
  "caractere": string[], // 2 à 3 traits parmi : calme, pressé, froid, chaleureux, méfiant, bavard, radin, exigeant, indécis, "je sais tout", perfectionniste, anxieux
  "niveauMoyens": "modeste" | "moyen" | "aise",
  "chantier": {
    "type": "${chantierType}",
    "description": string, // description concrète et réaliste du besoin
    "dimensions": string, // dimensions réalistes et cohérentes avec le type de chantier
    "etat": string, // état actuel du terrain/de la haie/etc.
    "acces": string, // ex: "accès camion possible", "brouette uniquement, portail 80cm", "terrain en pente"...
    "contraintes": string[], // 1 à 3 contraintes concrètes (voisinage, réseaux enterrés, arbre protégé, délai mairie...)
    "evacuationDechets": string // ex: "déchets à évacuer en déchetterie", "broyage sur place accepté"...
  },
  "budgetReelMinHT": number, // budget réel minimum qu'il est prêt à payer HT, cohérent avec le chantier et son niveau de moyens
  "budgetReelMaxHT": number, // budget réel maximum qu'il est prêt à payer HT
  "budgetAnnonce": string, // ce qu'il annoncera oralement s'il est interrogé sur son budget (peut être vague, "je ne sais pas trop", ou un chiffre différent du budget réel, souvent plus bas)
  "devisConcurrents": [{ "entreprise": string, "montantTTC": number }], // 0 à 3 devis déjà reçus, cohérents avec le chantier
  "critereDecisionPrincipal": "prix" | "confiance" | "rapidite" | "qualite" | "proximite" | "garanties",
  "objectionsCachees": string[], // 2 à 4 objections qu'il ne dira pas forcément spontanément
  "declencheurs": string[], // 2 à 3 éléments qui le feraient signer s'il les entend (garantie de reprise, photos de réalisations, certification élagueur CS, assurance décennale/RC pro, date d'intervention rapide, avis clients, devis détaillé...)
  "situationParticuliere": string | null, // optionnel : décision à deux ("je dois en parler à mon conjoint"), demande de paiement en liquide, voisin ayant eu une mauvaise expérience, etc. Peut être null.
  "motifAppel": string, // phrase courte et naturelle que ce client dirait pour expliquer pourquoi il appelle un paysagiste (c'est la SEULE info que le joueur voit avant le rendez-vous, avec son prénom/nom/commune/logement)
  "vouvoiement": boolean, // true si le client vouvoie le paysagiste (quasi toujours true sauf profil très jeune ou familier)
  "voix": { "genre": "homme" | "femme", "ageApprox": number }
}

Contraintes de cohérence obligatoires :
- Le budget réel doit être un ordre de grandeur plausible pour ce type de chantier en France rurale/périurbaine en ${new Date().getFullYear()}.
- Les devis concurrents doivent être cohérents avec le budget réel (ni ridicules ni aberrants).
- Niveau de difficulté demandé : "${niveau}". ${NIVEAU_CONSIGNES[niveau]}
- Fais varier les prénoms, noms, communes et personnalités d'une génération à l'autre.`;

  const user = `Génère une nouvelle fiche client secrète pour un chantier de type "${chantierLabel(chantierType)}", niveau de difficulté "${niveau}".`;

  return { system, user };
}
