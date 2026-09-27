import { useState } from "react";
import type { Tarifs } from "../types";
import { Button, Card } from "./ui";

export function ParametresScreen({
  tarifs,
  onSauvegarder,
  onRetour,
}: {
  tarifs: Tarifs;
  onSauvegarder: (tarifs: Tarifs) => void;
  onRetour: () => void;
}) {
  const [form, setForm] = useState<Tarifs>(tarifs);

  function update<K extends keyof Tarifs>(key: K, value: number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pb-8">
      <header className="flex items-center gap-3 pt-4">
        <button onClick={onRetour} className="text-emerald-800" aria-label="Retour">
          ←
        </button>
        <h1 className="text-lg font-semibold text-emerald-950">
          Réglages de tarifs
        </h1>
      </header>

      <p className="text-sm text-emerald-800/70">
        Ces tarifs servent uniquement à juger la rentabilité de tes devis dans le
        débriefing — ils n'apparaissent jamais au client.
      </p>

      <Card className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-emerald-950">
            Taux horaire entretien (€ HT/h)
          </span>
          <span className="text-xs text-emerald-800/60">
            Tonte, taille de haies, débroussaillage, élagage
          </span>
          <input
            type="number"
            min={0}
            step={1}
            value={form.tauxHoraireEntretienHT}
            onChange={(e) =>
              update("tauxHoraireEntretienHT", Number(e.target.value))
            }
            className="mt-1 rounded-lg border border-black/10 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-emerald-950">
            Taux horaire aménagement (€ HT/h)
          </span>
          <span className="text-xs text-emerald-800/60">
            Terrassement, allées, pavage, clôture, drainage
          </span>
          <input
            type="number"
            min={0}
            step={1}
            value={form.tauxHoraireAmenagementHT}
            onChange={(e) =>
              update("tauxHoraireAmenagementHT", Number(e.target.value))
            }
            className="mt-1 rounded-lg border border-black/10 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-emerald-950">
            Coefficient matériaux
          </span>
          <span className="text-xs text-emerald-800/60">
            Multiplicateur appliqué au prix d'achat des fournitures
          </span>
          <input
            type="number"
            min={1}
            step={0.05}
            value={form.coefficientMateriaux}
            onChange={(e) =>
              update("coefficientMateriaux", Number(e.target.value))
            }
            className="mt-1 rounded-lg border border-black/10 px-3 py-2"
          />
        </label>
      </Card>

      <Button
        onClick={() => {
          onSauvegarder(form);
          onRetour();
        }}
      >
        Enregistrer
      </Button>
    </div>
  );
}
