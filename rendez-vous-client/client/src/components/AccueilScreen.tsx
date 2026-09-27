import { useState } from "react";
import type { NiveauChoix, PartieHistorique } from "../types";
import { Button, Card } from "./ui";

const NIVEAUX: { value: NiveauChoix; label: string; description: string }[] = [
  {
    value: "facile",
    label: "Facile",
    description: "Client clair, peu de négociation",
  },
  {
    value: "moyen",
    label: "Moyen",
    description: "Il compare et négocie un peu",
  },
  {
    value: "difficile",
    label: "Difficile",
    description: "Objections fortes, négociation dure",
  },
  { value: "aleatoire", label: "Aléatoire", description: "Surprise totale" },
];

export function AccueilScreen({
  onDemarrer,
  onOuvrirParametres,
  historique,
}: {
  onDemarrer: (niveau: NiveauChoix) => void;
  onOuvrirParametres: () => void;
  historique: PartieHistorique[];
}) {
  const [niveau, setNiveau] = useState<NiveauChoix>("aleatoire");

  const tauxReussite =
    historique.length > 0
      ? Math.round(
          (historique.filter((p) => p.venteReussie).length / historique.length) *
            100,
        )
      : null;

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pb-8">
      <header className="pt-6 text-center">
        <p className="text-sm font-medium tracking-wide text-emerald-700 uppercase">
          Alex'Térieur Jardin &amp; Création
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-emerald-950">
          Rendez-vous Client
        </h1>
        <p className="mt-1 text-sm text-emerald-800/70">
          Entraîne-toi à vendre tes devis face à un client simulé
        </p>
      </header>

      {tauxReussite !== null && (
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-800/60">Taux de vente</p>
            <p className="text-lg font-semibold text-emerald-950">
              {tauxReussite}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-emerald-800/60">Parties jouées</p>
            <p className="text-lg font-semibold text-emerald-950">
              {historique.length}
            </p>
          </div>
        </Card>
      )}

      <Card className="flex flex-col gap-3">
        <p className="text-sm font-medium text-emerald-950">
          Choisis le niveau du client
        </p>
        <div className="grid grid-cols-2 gap-2">
          {NIVEAUX.map((n) => (
            <button
              key={n.value}
              onClick={() => setNiveau(n.value)}
              className={`rounded-xl border p-3 text-left transition-colors ${
                niveau === n.value
                  ? "border-emerald-600 bg-emerald-700 text-white"
                  : "border-black/10 bg-white text-emerald-950 active:bg-emerald-50"
              }`}
            >
              <p className="text-sm font-semibold">{n.label}</p>
              <p
                className={`mt-0.5 text-xs ${
                  niveau === n.value ? "text-emerald-50/80" : "text-emerald-800/60"
                }`}
              >
                {n.description}
              </p>
            </button>
          ))}
        </div>
      </Card>

      <Button className="w-full py-4 text-base" onClick={() => onDemarrer(niveau)}>
        Démarrer le rendez-vous
      </Button>

      <button
        onClick={onOuvrirParametres}
        className="mx-auto text-sm text-emerald-800/70 underline underline-offset-2"
      >
        Réglages de tarifs
      </button>
    </div>
  );
}
