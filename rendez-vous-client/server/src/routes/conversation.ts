import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { callClaudeForJson } from "../anthropic.js";
import { buildConversationSystemPrompt } from "../prompts/conversation.js";
import type { ClientTurnResult, ConversationTurn, SecretClient } from "../types.js";

const router = Router();

function toAnthropicMessages(
  conversation: ConversationTurn[],
): Anthropic.MessageParam[] {
  return conversation.map((turn) => ({
    role: turn.role === "paysagiste" ? "user" : "assistant",
    content: turn.content,
  }));
}

router.post("/message", async (req, res) => {
  try {
    const secretClient = req.body?.secretClient as SecretClient | undefined;
    const conversation = req.body?.conversation as ConversationTurn[] | undefined;
    const confianceActuelle = Number(req.body?.confianceActuelle ?? 50);

    if (!secretClient || !conversation || conversation.length === 0) {
      res.status(400).json({ error: "Requête invalide." });
      return;
    }

    const lastTurn = conversation[conversation.length - 1];
    if (!lastTurn || lastTurn.role !== "paysagiste") {
      res
        .status(400)
        .json({ error: "Le dernier message doit être celui du paysagiste." });
      return;
    }

    const system = buildConversationSystemPrompt(secretClient, confianceActuelle);
    const messages = toAnthropicMessages(conversation);

    const result = await callClaudeForJson<ClientTurnResult>({
      system,
      messages,
      maxTokens: 1024,
    });

    res.json(result);
  } catch (err) {
    console.error("Erreur conversation :", err);
    res.status(500).json({ error: "Impossible d'obtenir la réponse du client." });
  }
});

export default router;
