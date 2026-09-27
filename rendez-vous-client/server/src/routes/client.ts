import { Router } from "express";
import { randomUUID } from "node:crypto";
import { callClaudeForJson } from "../anthropic.js";
import {
  CHANTIER_TYPES,
  buildClientGenerationPrompt,
} from "../prompts/clientGeneration.js";
import type { ClientPublicInfo, Niveau, SecretClient } from "../types.js";

const router = Router();

const NIVEAUX: Niveau[] = ["facile", "moyen", "difficile"];

function pickRandom<T>(arr: readonly T[]): T {
  const item = arr[Math.floor(Math.random() * arr.length)];
  if (item === undefined) throw new Error("Tableau vide.");
  return item;
}

router.post("/generate", async (req, res) => {
  try {
    const requested = req.body?.niveau as Niveau | "aleatoire" | undefined;
    const niveau: Niveau =
      !requested || requested === "aleatoire" ? pickRandom(NIVEAUX) : requested;

    if (!NIVEAUX.includes(niveau)) {
      res.status(400).json({ error: "Niveau invalide." });
      return;
    }

    const chantierType = pickRandom(CHANTIER_TYPES);
    const { system, user } = buildClientGenerationPrompt(niveau, chantierType);

    const generated = await callClaudeForJson<Omit<SecretClient, "id" | "niveau">>(
      {
        system,
        messages: [{ role: "user", content: user }],
        maxTokens: 2048,
      },
    );

    const secretClient: SecretClient = {
      ...generated,
      id: randomUUID(),
      niveau,
    };

    const publicInfo: ClientPublicInfo = {
      prenom: secretClient.prenom,
      nom: secretClient.nom,
      commune: secretClient.commune,
      typeLogement: secretClient.typeLogement,
      motifAppel: secretClient.motifAppel,
      niveau: secretClient.niveau,
    };

    res.json({ secretClient, publicInfo });
  } catch (err) {
    console.error("Erreur génération client :", err);
    res.status(500).json({ error: "Impossible de générer le client." });
  }
});

export default router;
