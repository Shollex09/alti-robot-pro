import type {
  ConversationTurn,
  Devis,
  DevisDecision,
  SecretClient,
  Tarifs,
} from "../types.js";
import { chantierLabel } from "./clientGeneration.js";

function formatConversation(turns: ConversationTurn[], label: string): string {
  if (turns.length === 0) return "(aucun échange)";
  return turns
    .map((t) => `${t.role === "paysagiste" ? "Paysagiste" : label} : ${t.content}`)
    .join("\n");
}

function formatDevis(devis: Devis | null): string {
  if (!devis) return "(aucun devis n'a été remis)";
  const lignes = devis.lignes
    .map(
      (l) =>
        `- ${l.designation} : ${l.quantite} ${l.unite} x ${l.prixUnitaireHT.toFixed(2)} € HT (TVA ${l.tva}%)`,
    )
    .join("\n");
  const totalHT = devis.lignes.reduce(
    (sum, l) => sum + l.quantite * l.prixUnitaireHT,
    0,
  );
  const totalTTC = devis.lignes.reduce(
    (sum, l) => sum + l.quantite * l.prixUnitaireHT * (1 + l.tva / 100),
    0,
  );
  return `${lignes}\n\nTotal HT : ${totalHT.toFixed(2)} € — Total TTC : ${totalTTC.toFixed(2)} €\nMessage d'accompagnement : "${devis.message}"`;
}

export function buildDebriefPrompt(
  secret: SecretClient,
  conversation: ConversationTurn[],
  confianceSeries: number[],
  devis: Devis | null,
  negociation: ConversationTurn[],
  decisionFinale: DevisDecision | null,
  tarifs: Tarifs,
): { system: string; user: string } {
  const system = `Tu es un formateur commercial expert, spécialisé dans la vente de prestations de paysagisme en France (aménagement extérieur et entretien). Tu débriefes Alexandre, paysagiste indépendant (Alex'Térieur Jardin & Création, secteur Ain / Saône-et-Loire), après un rendez-vous chantier simulé face à un client fictif.

Voici la fiche secrète complète du client, qui n'était PAS connue du paysagiste pendant le rendez-vous (tu peux t'en servir intégralement pour noter) :
${JSON.stringify(secret, null, 2)}

Tarifs réels d'Alexandre, à utiliser pour juger la rentabilité du devis (ligne "justessePrix") :
- Taux horaire entretien courant (tonte, taille de haie, débroussaillage, engazonnement, massifs/plantations, entretien annuel) : ${tarifs.tauxHoraireEntretienHT} € HT/heure
- Taux horaire élagage / abattage (travail en hauteur, certification CS Taille et Soins des Arbres) : ${tarifs.tauxHoraireElagageHT} € HT/heure
- Taux horaire aménagement (terrassement, allées, pavage, clôture, drainage) : ${tarifs.tauxHoraireAmenagementHT} € HT/heure
- Coefficient appliqué sur le prix d'achat des matériaux/fournitures : x${tarifs.coefficientMateriaux}

Utilise impérativement le taux horaire correspondant au type de chantier réel (l'élagage/abattage ne se facture PAS au même taux que l'entretien courant : c'est un travail technique en hauteur, plus qualifié et plus risqué).

Pour juger la justesse du prix : estime toi-même, à partir de la description réelle du chantier (dimensions, état, accès, contraintes), un temps de main d'œuvre réaliste et un coût de fournitures plausible, calcule un prix plancher rentable avec les tarifs ci-dessus, puis compare-le au devis réellement soumis. Un devis accepté par le client mais sous-évalué (vente à perte ou sous-évaluation du temps de travail) doit être noté sévèrement sur ce critère, même si la vente est "réussie" commercialement.

Type de chantier : ${chantierLabel(secret.chantier.type)}.
Niveau de difficulté du client : ${secret.niveau}.

Résultat de la partie : ${decisionFinale ?? "aucune décision (le paysagiste n'a pas soumis de devis)"}.

Tâche : rédige un débriefing complet, exigeant mais constructif, en français, au format JSON STRICT suivant (aucun texte avant/après, aucune balise markdown) :
{
  "venteReussie": boolean,
  "noteGlobale": number, // sur 100, cohérente avec la moyenne des critères ci-dessous
  "criteres": {
    "decouverte": { "note": number, "commentaire": string }, // sur 10 : a-t-il posé les bonnes questions (besoin, budget, délai, concurrence, décideur) ?
    "ecouteReformulation": { "note": number, "commentaire": string }, // sur 10
    "argumentation": { "note": number, "commentaire": string }, // sur 10 : adaptée au critère de décision du client, expertise/certification CS Taille et Soins des Arbres, assurance, garanties, réalisations...
    "gestionObjections": { "note": number, "commentaire": string }, // sur 10
    "closing": { "note": number, "commentaire": string }, // sur 10 : a-t-il proposé une suite concrète (date, acompte, signature) ?
    "justessePrix": { "note": number, "commentaire": string }, // sur 10, voir méthode ci-dessus
    "presentationDevis": { "note": number, "commentaire": string } // sur 10
  },
  "momentsCles": [ // 2 à 4 moments, cite du texte RÉEL de la conversation fournie
    { "citation": string, "ceQueTuAsDit": string, "ceQuiAuraitEteMieux": string }
  ],
  "conseils": string[], // exactement 3 conseils concrets et actionnables pour la prochaine fois
  "syntheseFinale": string // 2-3 phrases de synthèse
}`;

  const user = `--- Déroulé du rendez-vous / tour du chantier ---
${formatConversation(conversation, "Client")}

--- Évolution de la jauge de confiance au fil de la conversation ---
${confianceSeries.join(" -> ") || "(non disponible)"}

--- Devis soumis ---
${formatDevis(devis)}

--- Négociation éventuelle ---
${formatConversation(negociation, "Client")}

--- Décision finale du client ---
${decisionFinale ?? "aucune"}

Rédige le débriefing complet au format JSON demandé.`;

  return { system, user };
}
