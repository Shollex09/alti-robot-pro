import { useState } from "react";
import type { ChantierType, Devis, DevisLigne } from "../types";
import { devisTotaux, formatEuros, ligneTotalHT, tvaSuggeree } from "../utils/pricing";
import { Button, Card, ErrorBanner, Spinner } from "./ui";

function ligneVide(tva: 10 | 20): DevisLigne {
  return { designation: "", quantite: 1, unite: "u", prixUnitaireHT: 0, tva };
}

export function DevisScreen({
  chantierType,
  infosRevelees,
  enAttente,
  erreur,
  onEnvoyerDevis,
  onRetour,
}: {
  chantierType: ChantierType;
  infosRevelees: string[];
  enAttente: boolean;
  erreur: string | null;
  onEnvoyerDevis: (devis: Devis) => void;
  onRetour: () => void;
}) {
  const tvaParDefaut = tvaSuggeree(chantierType);
  const [lignes, setLignes] = useState<DevisLigne[]>([ligneVide(tvaParDefaut)]);
  const [message, setMessage] = useState("");

  function updateLigne(index: number, patch: Partial<DevisLigne>) {
    setLignes((prev) =>
      prev.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    );
  }

  function ajouterLigne() {
    setLignes((prev) => [...prev, ligneVide(tvaParDefaut)]);
  }

  function supprimerLigne(index: number) {
    setLignes((prev) => prev.filter((_, i) => i !== index));
  }

  const devisValide = lignes.some(
    (l) => l.designation.trim() && l.quantite > 0 && l.prixUnitaireHT > 0,
  );
  const totaux = devisTotaux({ lignes, message });

  function envoyer() {
    const lignesValides = lignes.filter(
      (l) => l.designation.trim() && l.quantite > 0 && l.prixUnitaireHT > 0,
    );
    onEnvoyerDevis({ lignes: lignesValides, message: message.trim() });
  }

  if (enAttente) {
    return <Spinner label="Le client regarde ton devis..." />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pb-8">
      <header className="flex items-center gap-3 pt-4">
        <button onClick={onRetour} className="text-emerald-800" aria-label="Retour">
          ←
        </button>
        <h1 className="text-lg font-semibold text-emerald-950">Ton devis</h1>
      </header>

      {infosRevelees.length > 0 && (
        <Card className="bg-emerald-50/60">
          <p className="mb-1.5 text-xs font-medium text-emerald-800/70">
            Rappel — notes de chantier
          </p>
          <ul className="flex flex-col gap-1 text-sm text-emerald-900">
            {infosRevelees.map((info, i) => (
              <li key={i}>• {info}</li>
            ))}
          </ul>
        </Card>
      )}

      {erreur && <ErrorBanner message={erreur} />}

      <div className="flex flex-col gap-3">
        {lignes.map((ligne, i) => (
          <Card key={i} className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <input
                placeholder="Désignation (ex: Taille de haie de thuyas)"
                value={ligne.designation}
                onChange={(e) => updateLigne(i, { designation: e.target.value })}
                className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm"
              />
              {lignes.length > 1 && (
                <button
                  onClick={() => supprimerLigne(i)}
                  className="px-2 py-2 text-red-600"
                  aria-label="Supprimer la ligne"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              <input
                type="number"
                min={0}
                step={0.5}
                placeholder="Qté"
                value={ligne.quantite}
                onChange={(e) =>
                  updateLigne(i, { quantite: Number(e.target.value) })
                }
                className="rounded-lg border border-black/10 px-2 py-2 text-sm"
              />
              <input
                placeholder="Unité"
                value={ligne.unite}
                onChange={(e) => updateLigne(i, { unite: e.target.value })}
                className="rounded-lg border border-black/10 px-2 py-2 text-sm"
              />
              <input
                type="number"
                min={0}
                step={1}
                placeholder="PU HT"
                value={ligne.prixUnitaireHT}
                onChange={(e) =>
                  updateLigne(i, { prixUnitaireHT: Number(e.target.value) })
                }
                className="rounded-lg border border-black/10 px-2 py-2 text-sm"
              />
              <select
                value={ligne.tva}
                onChange={(e) =>
                  updateLigne(i, { tva: Number(e.target.value) as 10 | 20 })
                }
                className="rounded-lg border border-black/10 px-1 py-2 text-sm"
              >
                <option value={10}>10%</option>
                <option value={20}>20%</option>
              </select>
            </div>
            <p className="text-right text-xs text-emerald-800/60">
              Total ligne HT : {formatEuros(ligneTotalHT(ligne))}
            </p>
          </Card>
        ))}
      </div>

      <button
        onClick={ajouterLigne}
        className="rounded-xl border border-dashed border-emerald-300 py-2.5 text-sm font-medium text-emerald-700"
      >
        + Ajouter une ligne
      </button>

      <Card className="flex flex-col gap-1 bg-emerald-950 text-white">
        <div className="flex justify-between text-sm text-emerald-100">
          <span>Total HT</span>
          <span>{formatEuros(totaux.totalHT)}</span>
        </div>
        <div className="flex justify-between text-sm text-emerald-100">
          <span>TVA</span>
          <span>{formatEuros(totaux.totalTVA)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span>Total TTC</span>
          <span>{formatEuros(totaux.totalTTC)}</span>
        </div>
      </Card>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-emerald-950">
          Message d'accompagnement
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Ex : garantie de reprise 1 an, intervention possible sous 2 semaines..."
          className="rounded-xl border border-black/10 px-3 py-2 text-sm"
        />
      </label>

      <Button disabled={!devisValide} onClick={envoyer} className="w-full py-4">
        Envoyer le devis au client
      </Button>
    </div>
  );
}
