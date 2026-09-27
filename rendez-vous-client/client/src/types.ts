export type Niveau = "facile" | "moyen" | "difficile";
export type NiveauChoix = Niveau | "aleatoire";

export type ChantierType =
  | "taille_haie"
  | "elagage_abattage"
  | "allee"
  | "terrasse"
  | "cloture"
  | "engazonnement"
  | "debroussaillage"
  | "entretien_annuel"
  | "drainage"
  | "massifs_plantations";

export const CHANTIER_LABELS: Record<ChantierType, string> = {
  taille_haie: "Taille de haie",
  elagage_abattage: "Élagage / abattage",
  allee: "Création d'allée",
  terrasse: "Création de terrasse",
  cloture: "Pose de clôture",
  engazonnement: "Engazonnement",
  debroussaillage: "Débroussaillage",
  entretien_annuel: "Contrat d'entretien annuel",
  drainage: "Drainage",
  massifs_plantations: "Massifs / plantations",
};

export type CritereDecision =
  | "prix"
  | "confiance"
  | "rapidite"
  | "qualite"
  | "proximite"
  | "garanties";

export interface ChantierInfo {
  type: ChantierType;
  description: string;
  dimensions: string;
  etat: string;
  acces: string;
  contraintes: string[];
  evacuationDechets: string;
}

export interface DevisConcurrent {
  entreprise: string;
  montantTTC: number;
}

export interface SecretClient {
  id: string;
  niveau: Niveau;
  prenom: string;
  nom: string;
  age: number;
  profession: string;
  commune: string;
  typeLogement: string;
  caractere: string[];
  niveauMoyens: "modeste" | "moyen" | "aise";
  chantier: ChantierInfo;
  budgetReelMinHT: number;
  budgetReelMaxHT: number;
  budgetAnnonce: string;
  devisConcurrents: DevisConcurrent[];
  critereDecisionPrincipal: CritereDecision;
  objectionsCachees: string[];
  declencheurs: string[];
  situationParticuliere: string | null;
  motifAppel: string;
  vouvoiement: boolean;
  voix: { genre: "homme" | "femme"; ageApprox: number };
}

export interface ClientPublicInfo {
  prenom: string;
  nom: string;
  commune: string;
  typeLogement: string;
  motifAppel: string;
  niveau: Niveau;
}

export type MessageRole = "paysagiste" | "client";

export interface ConversationTurn {
  role: MessageRole;
  content: string;
}

export interface ClientTurnResult {
  reponse: string;
  confiance: number;
  infos_revelees: string[];
  evenement_cle: string | null;
}

export interface DevisLigne {
  designation: string;
  quantite: number;
  unite: string;
  prixUnitaireHT: number;
  tva: 10 | 20;
}

export interface Devis {
  lignes: DevisLigne[];
  message: string;
}

export type DevisDecision = "accepte" | "refuse" | "negocie";

export interface DevisResponseResult {
  decision: DevisDecision;
  reponse: string;
  contrePropositionHT: number | null;
  confiance: number;
  maxRoundsReached?: boolean;
}

export interface Tarifs {
  tauxHoraireEntretienHT: number;
  tauxHoraireElagageHT: number;
  tauxHoraireAmenagementHT: number;
  coefficientMateriaux: number;
}

export const TARIFS_PAR_DEFAUT: Tarifs = {
  tauxHoraireEntretienHT: 45,
  tauxHoraireElagageHT: 80,
  tauxHoraireAmenagementHT: 50,
  coefficientMateriaux: 1.3,
};

export interface DebriefCritere {
  note: number;
  commentaire: string;
}

export interface MomentCle {
  citation: string;
  ceQueTuAsDit: string;
  ceQuiAuraitEteMieux: string;
}

export interface DebriefResult {
  venteReussie: boolean;
  noteGlobale: number;
  criteres: {
    decouverte: DebriefCritere;
    ecouteReformulation: DebriefCritere;
    argumentation: DebriefCritere;
    gestionObjections: DebriefCritere;
    closing: DebriefCritere;
    justessePrix: DebriefCritere;
    presentationDevis: DebriefCritere;
  };
  momentsCles: MomentCle[];
  conseils: string[];
  syntheseFinale: string;
}

export type Etape =
  | "accueil"
  | "parametres"
  | "chargement_client"
  | "rendez_vous"
  | "devis"
  | "negociation"
  | "debriefing";

export interface PartieHistorique {
  id: string;
  date: string;
  clientNom: string;
  chantierType: ChantierType;
  niveau: Niveau;
  venteReussie: boolean;
  noteGlobale: number;
}
