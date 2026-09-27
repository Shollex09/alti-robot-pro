import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { callClaudeForJson } from "../anthropic.js";
import {
  buildDevisResponsePrompt,
  buildNegociationSystemPrompt,
} from "../prompts/devisResponse.js";
import type {
  ConversationTurn,
  Devis,
  DevisResponseResult,
  SecretClient,
} from "../types.js";

const router = Router();

const MAX_NEGOCIATION_ROUNDS = 4;

function toAnthropicMessages(
  conversation: ConversationTurn[],
): Anthropic.MessageParam[] {
  return conversation.map((turn) => ({
    role: turn.role === "paysagiste" ? "user" : "assistant",
    content: turn.content,
  }));
}

router.post("/response", async (req, res) => {
  try {
    const secretClient = req.body?.secretClient as SecretClient | undefined;
    const conversation = (req.body?.conversation as ConversationTurn[]) ?? [];
    const confianceActuelle = Number(req.body?.confianceActuelle ?? 50);
    const devis = req.body?.devis as Devis | undefined;

    if (!secretClient || !devis || devis.lignes.length === 0) {
      res.status(400).json({ error: "Requête invalide." });
      return;
    }

    const { system, user } = buildDevisResponsePrompt(
      secretClient,
      conversation,
      confianceActuelle,
      devis,
    );

    const result = await callClaudeForJson<DevisResponseResult>({
      system,
      messages: [{ role: "user", content: user }],
      maxTokens: 1024,
    });

    res.json(result);
  } catch (err) {
    console.error("Erreur réponse devis :", err);
    res.status(500).json({ error: "Impossible d'obtenir la réponse du client." });
  }
});

router.post("/negotiate", async (req, res) => {
  try {
    const secretClient = req.body?.secretClient as SecretClient | undefined;
    const devis = req.body?.devis as Devis | undefined;
    const negociation = req.body?.negociation as ConversationTurn[] | undefined;
    const confianceActuelle = Number(req.body?.confianceActuelle ?? 50);
    const round = Number(req.body?.round ?? 1);

    if (!secretClient || !devis || !negociation || negociation.length === 0) {
      res.status(400).json({ error: "Requête invalide." });
      return;
    }

    const lastTurn = negociation[negociation.length - 1];
    if (!lastTurn || lastTurn.role !== "paysagiste") {
      res
        .status(400)
        .json({ error: "Le dernier message doit être celui du paysagiste." });
      return;
    }

    const system = buildNegociationSystemPrompt(
      secretClient,
      confianceActuelle,
      devis,
      round,
      MAX_NEGOCIATION_ROUNDS,
    );
    const messages = toAnthropicMessages(negociation);

    const result = await callClaudeForJson<DevisResponseResult>({
      system,
      messages,
      maxTokens: 1024,
    });

    res.json({ ...result, maxRoundsReached: round >= MAX_NEGOCIATION_ROUNDS });
  } catch (err) {
    console.error("Erreur négociation :", err);
    res.status(500).json({ error: "Impossible d'obtenir la réponse du client." });
  }
});

export default router;
