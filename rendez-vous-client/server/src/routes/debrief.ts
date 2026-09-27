import { Router } from "express";
import { callClaudeForJson } from "../anthropic.js";
import { buildDebriefPrompt } from "../prompts/debrief.js";
import type {
  ConversationTurn,
  DebriefResult,
  Devis,
  DevisDecision,
  SecretClient,
  Tarifs,
} from "../types.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const secretClient = req.body?.secretClient as SecretClient | undefined;
    const conversation = (req.body?.conversation as ConversationTurn[]) ?? [];
    const confianceSeries = (req.body?.confianceSeries as number[]) ?? [];
    const devis = (req.body?.devis as Devis | null) ?? null;
    const negociation = (req.body?.negociation as ConversationTurn[]) ?? [];
    const decisionFinale = (req.body?.decisionFinale as DevisDecision | null) ?? null;
    const tarifs = req.body?.tarifs as Tarifs | undefined;

    if (!secretClient || !tarifs) {
      res.status(400).json({ error: "Requête invalide." });
      return;
    }

    const { system, user } = buildDebriefPrompt(
      secretClient,
      conversation,
      confianceSeries,
      devis,
      negociation,
      decisionFinale,
      tarifs,
    );

    const result = await callClaudeForJson<DebriefResult>({
      system,
      messages: [{ role: "user", content: user }],
      maxTokens: 4096,
    });

    res.json(result);
  } catch (err) {
    console.error("Erreur débriefing :", err);
    res.status(500).json({ error: "Impossible de générer le débriefing." });
  }
});

export default router;
