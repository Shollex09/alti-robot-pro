import type {
  ClientPublicInfo,
  ClientTurnResult,
  ConversationTurn,
  DebriefResult,
  Devis,
  DevisResponseResult,
  NiveauChoix,
  SecretClient,
  Tarifs,
} from "./types";

// En dev, le proxy Vite redirige /api vers le serveur local (voir vite.config.ts).
// En prod (serveur et client hébergés séparément), VITE_API_BASE_URL pointe
// vers l'URL publique du serveur, ex: https://rendez-vous-client-api.onrender.com
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || `Erreur serveur (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function generateClient(
  niveau: NiveauChoix,
): Promise<{ secretClient: SecretClient; publicInfo: ClientPublicInfo }> {
  return postJson("/api/client/generate", { niveau });
}

export function sendConversationMessage(
  secretClient: SecretClient,
  conversation: ConversationTurn[],
  confianceActuelle: number,
): Promise<ClientTurnResult> {
  return postJson("/api/conversation/message", {
    secretClient,
    conversation,
    confianceActuelle,
  });
}

export function sendDevis(
  secretClient: SecretClient,
  conversation: ConversationTurn[],
  confianceActuelle: number,
  devis: Devis,
): Promise<DevisResponseResult> {
  return postJson("/api/devis/response", {
    secretClient,
    conversation,
    confianceActuelle,
    devis,
  });
}

export function negocierDevis(
  secretClient: SecretClient,
  devis: Devis,
  negociation: ConversationTurn[],
  confianceActuelle: number,
  round: number,
): Promise<DevisResponseResult> {
  return postJson("/api/devis/negotiate", {
    secretClient,
    devis,
    negociation,
    confianceActuelle,
    round,
  });
}

export function getDebrief(params: {
  secretClient: SecretClient;
  conversation: ConversationTurn[];
  confianceSeries: number[];
  devis: Devis | null;
  negociation: ConversationTurn[];
  decisionFinale: DevisResponseResult["decision"] | null;
  tarifs: Tarifs;
}): Promise<DebriefResult> {
  return postJson("/api/debrief", params);
}
