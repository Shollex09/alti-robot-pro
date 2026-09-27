import { useEffect, useRef, useState } from "react";
import type { ConversationTurn } from "../types";
import { formatEuros } from "../utils/pricing";
import { Button, ErrorBanner } from "./ui";

export function NegociationScreen({
  negociation,
  contrePropositionHT,
  totalDevisHT,
  enAttente,
  erreur,
  onEnvoyerReponse,
}: {
  negociation: ConversationTurn[];
  contrePropositionHT: number | null;
  totalDevisHT: number;
  enAttente: boolean;
  erreur: string | null;
  onEnvoyerReponse: (message: string) => void;
}) {
  const [saisie, setSaisie] = useState("");
  const finDeListe = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finDeListe.current?.scrollIntoView({ behavior: "smooth" });
  }, [negociation, enAttente]);

  function envoyer() {
    const message = saisie.trim();
    if (!message || enAttente) return;
    onEnvoyerReponse(message);
    setSaisie("");
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-black/5 bg-white px-4 py-3">
        <p className="font-semibold text-emerald-950">Négociation</p>
        <div className="mt-1 flex items-center justify-between text-sm text-emerald-800/70">
          <span>Ton devis : {formatEuros(totalDevisHT)} HT</span>
          {contrePropositionHT !== null && (
            <span className="font-medium text-amber-700">
              Demande : {formatEuros(contrePropositionHT)} HT
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {negociation.map((turn, i) => (
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
            placeholder="Défends ton prix ou fais une contre-offre..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-black/10 px-3 py-2.5 text-[15px]"
          />
          <Button onClick={envoyer} disabled={enAttente || !saisie.trim()}>
            Envoyer
          </Button>
        </div>
      </div>
    </div>
  );
}
