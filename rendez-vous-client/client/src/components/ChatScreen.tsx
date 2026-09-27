import { useEffect, useRef, useState } from "react";
import type { ClientPublicInfo, ConversationTurn } from "../types";
import { Badge, Button, ErrorBanner } from "./ui";

const NIVEAU_LABELS: Record<ClientPublicInfo["niveau"], string> = {
  facile: "Facile",
  moyen: "Moyen",
  difficile: "Difficile",
};

export function ChatScreen({
  publicInfo,
  conversation,
  infosRevelees,
  enAttente,
  erreur,
  onEnvoyerMessage,
  onPasserAuDevis,
}: {
  publicInfo: ClientPublicInfo;
  conversation: ConversationTurn[];
  infosRevelees: string[];
  enAttente: boolean;
  erreur: string | null;
  onEnvoyerMessage: (message: string) => void;
  onPasserAuDevis: () => void;
}) {
  const [saisie, setSaisie] = useState("");
  const [notesOuvertes, setNotesOuvertes] = useState(false);
  const finDeListe = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finDeListe.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, enAttente]);

  function envoyer() {
    const message = saisie.trim();
    if (!message || enAttente) return;
    onEnvoyerMessage(message);
    setSaisie("");
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-black/5 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-emerald-950">
              {publicInfo.prenom} {publicInfo.nom}
            </p>
            <p className="text-xs text-emerald-800/60">
              {publicInfo.commune} — {publicInfo.typeLogement}
            </p>
          </div>
          <Badge>{NIVEAU_LABELS[publicInfo.niveau]}</Badge>
        </div>
        <p className="mt-2 text-sm italic text-emerald-800/80">
          « {publicInfo.motifAppel} »
        </p>
      </header>

      <div className="border-b border-black/5">
        <button
          onClick={() => setNotesOuvertes((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium text-emerald-800"
        >
          <span>
            📋 Notes de chantier{" "}
            <span className="text-emerald-800/50">
              ({infosRevelees.length})
            </span>
          </span>
          <span>{notesOuvertes ? "▲" : "▼"}</span>
        </button>
        {notesOuvertes && (
          <div className="max-h-40 overflow-y-auto px-4 pb-3">
            {infosRevelees.length === 0 ? (
              <p className="text-sm text-emerald-800/50">
                Rien de noté pour l'instant — pose des questions pour obtenir des
                infos.
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {infosRevelees.map((info, i) => (
                  <li
                    key={i}
                    className="rounded-lg bg-emerald-50 px-3 py-1.5 text-sm text-emerald-900"
                  >
                    {info}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {conversation.length === 0 && (
          <p className="text-center text-sm text-emerald-800/50">
            Présente-toi et commence la discussion avec le client.
          </p>
        )}
        {conversation.map((turn, i) => (
          <div
            key={i}
            className={`flex ${turn.role === "paysagiste" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[15px] ${
                turn.role === "paysagiste"
                  ? "bg-emerald-700 text-white"
                  : "bg-white text-emerald-950 shadow-sm"
              }`}
            >
              {turn.content}
            </div>
          </div>
        ))}
        {enAttente && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400" />
            </div>
          </div>
        )}
        <div ref={finDeListe} />
      </div>

      {erreur && (
        <div className="px-4 pb-2">
          <ErrorBanner message={erreur} />
        </div>
      )}

      <div className="border-t border-black/5 bg-white p-3">
        <div className="flex gap-2">
          <textarea
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                envoyer();
              }
            }}
            placeholder="Écris ta question ou ta réponse..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-black/10 px-3 py-2.5 text-[15px]"
          />
          <Button onClick={envoyer} disabled={enAttente || !saisie.trim()}>
            Envoyer
          </Button>
        </div>
        <button
          onClick={onPasserAuDevis}
          disabled={enAttente || conversation.length === 0}
          className="mt-2 w-full rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-medium text-emerald-800 disabled:opacity-50"
        >
          Passer au devis →
        </button>
      </div>
    </div>
  );
}
