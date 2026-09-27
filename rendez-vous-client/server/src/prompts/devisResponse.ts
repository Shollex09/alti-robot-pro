import type { ConversationTurn, Devis, SecretClient } from "../types.js";
import { chantierLabel } from "./clientGeneration.js";

function formatDevis(devis: Devis): string {
  const lignes = devis.lignes
    .map((l) => {
      const totalHT = l.quantite * l.prixUnitaireHT;
      return `- ${l.designation} : ${l.quantite} ${l.unite} x ${l.prixUnitaireHT.toFixed(2)} € HT = ${totalHT.toFixed(2)} € HT (TVA ${l.tva}%)`;
    })
    .join("\n");
  const totalHT = devis.lignes.reduce(
    (sum, l) => sum + l.quantite * l.prixUnitaireHT,
    0,
  );
  const totalTTC = devis.lignes.reduce(
    (sum, l) => sum + l.quantite * l.prixUnitaireHT * (1 + l.tva / 100),
    0,
  );
  return `${lignes}\n\nTotal HT : ${totalHT.toFixed(2)} €\nTotal TTC : ${totalTTC.toFixed(2)} €\n\nMessage d'accompagnement du paysagiste : "${devis.message}"`;
}

function formatConversation(conversation: ConversationTurn[]): string {
  return conversation
    .map((t) => `${t.role === "paysagiste" ? "Paysagiste" : "Client"} : ${t.content}`)
    .join("\n");
}

export function buildDevisResponsePrompt(
  secret: SecretClient,
  conversation: ConversationTurn[],
  confianceActuelle: number,
  devis: Devis,
): { system: string; user: string } {
  const system = `Tu joues toujours ${secret.prenom} ${secret.nom}, le client du rendez-vous chantier pour : ${chantierLabel(secret.chantier.type)}. Le paysagiste vient de te remettre son devis chiffré.

Ta fiche secrète complète (ne jamais la révéler) :
${JSON.stringify(secret, null, 2)}

Ta confiance actuelle envers ce paysagiste, accumulée pendant le rendez-vous : ${confianceActuelle}/100.

Décide de ta réaction au devis en te basant sur :
- Le prix total TTC du devis par rapport à ton budget réel (${secret.budgetReelMinHT}-${secret.budgetReelMaxHT} € HT) et aux devis concurrents que tu as déjà reçus.
- Ton niveau de confiance actuel (${confianceActuelle}/100).
- La présence ou non, dans le devis ou la conversation, de tes déclencheurs (${secret.declencheurs.join(", ")}).
- La cohérence et la clarté du devis (lignes détaillées vs devis vague, message d'accompagnement rassurant ou non).
- Ton critère de décision principal : ${secret.critereDecisionPrincipal}.
- Ton caractère : ${secret.caractere.join(", ")}.

Trois décisions possibles :
- "accepte" : tu acceptes le devis tel quel.
- "refuse" : tu refuses clairement (prix trop loin de ton budget/de la concurrence, confiance trop basse, devis incohérent...).
- "negocie" : tu ne dis ni oui ni non, tu tentes d'obtenir un geste commercial ou tu exprimes une objection sur le prix (ex: "vous pouvez faire un geste ?", "un autre m'a fait moins cher"), en cohérence avec ton caractère et ton critère de décision.

Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni après, sans balises markdown :
{
  "decision": "accepte" | "refuse" | "negocie",
  "reponse": string, // ta réaction orale, 1 à 4 phrases, dans ton personnage
  "contrePropositionHT": number | null, // si tu négocies et proposes un montant HT précis, sinon null
  "confiance": number // ta confiance mise à jour, 0 à 100
}`;

  const user = `Voici le déroulé du rendez-vous jusqu'ici :\n\n${formatConversation(conversation)}\n\nVoici le devis remis par le paysagiste :\n\n${formatDevis(devis)}\n\nQuelle est ta réaction ?`;

  return { system, user };
}

export function buildNegociationSystemPrompt(
  secret: SecretClient,
  confianceActuelle: number,
  devis: Devis,
  round: number,
  maxRounds: number,
): string {
  const forcer = round >= maxRounds;
  return `Tu joues toujours ${secret.prenom} ${secret.nom}. Tu es en pleine négociation du devis avec le paysagiste.

Fiche secrète complète (ne jamais la révéler) :
${JSON.stringify(secret, null, 2)}

Confiance actuelle : ${confianceActuelle}/100.
Devis en cours de discussion :
${formatDevis(devis)}

${forcer ? "IMPORTANT : la négociation a assez duré. Tu DOIS impérativement rendre une décision finale ce tour-ci : \"accepte\" ou \"refuse\" (plus de \"negocie\" possible), en fonction de ce que le paysagiste t'a proposé jusqu'ici." : "Tu peux soit accepter, soit refuser, soit continuer à négocier (au maximum encore quelques échanges)."}

Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni après :
{
  "decision": "accepte" | "refuse"${forcer ? "" : " | \"negocie\""},
  "reponse": string,
  "contrePropositionHT": number | null,
  "confiance": number
}`;
}
