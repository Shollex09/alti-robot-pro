import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export const MODEL = process.env.CLAUDE_MODEL || "claude-opus-5";

/**
 * Extracts a JSON object from a model response that may be wrapped in
 * markdown code fences or preceded/followed by stray text.
 */
function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate: string = fenced ? (fenced[1] ?? trimmed) : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  const arrStart = candidate.indexOf("[");
  const arrEnd = candidate.lastIndexOf("]");
  let jsonSlice: string;
  if (start !== -1 && (arrStart === -1 || start < arrStart)) {
    jsonSlice = candidate.slice(start, end + 1);
  } else if (arrStart !== -1) {
    jsonSlice = candidate.slice(arrStart, arrEnd + 1);
  } else {
    jsonSlice = candidate;
  }
  return JSON.parse(jsonSlice);
}

interface CallJsonOptions {
  system: string;
  messages: Anthropic.MessageParam[];
  maxTokens?: number;
}

/**
 * Calls Claude expecting a single JSON object back, with one retry that
 * appends a stricter reminder if the first parse fails.
 */
export async function callClaudeForJson<T>(
  options: CallJsonOptions,
): Promise<T> {
  const { system, messages, maxTokens = 4096 } = options;

  const attempt = async (extra?: string): Promise<T> => {
    const finalMessages = extra
      ? [...messages, { role: "user" as const, content: extra }]
      : messages;
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: finalMessages,
    });
    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === "text",
    );
    if (!textBlock) {
      throw new Error("Réponse du modèle sans bloc texte.");
    }
    return extractJson(textBlock.text) as T;
  };

  try {
    return await attempt();
  } catch {
    return await attempt(
      "Ta dernière réponse n'était pas un JSON valide. Réponds UNIQUEMENT avec le JSON demandé, sans texte avant ni après, sans balises markdown.",
    );
  }
}

export { client as anthropicClient };
