import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHANTIER_LABELS, type DebriefResult, type SecretClient } from "../types";
import { formatEuros } from "../utils/pricing";
import { Badge, Button, Card } from "./ui";

const CRITERES_LABELS: { key: keyof DebriefResult["criteres"]; label: string }[] = [
  { key: "decouverte", label: "Découverte" },
  { key: "ecouteReformulation", label: "Écoute & reformulation" },
  { key: "argumentation", label: "Argumentation" },
  { key: "gestionObjections", label: "Gestion des objections" },
  { key: "closing", label: "Closing" },
  { key: "justessePrix", label: "Justesse du prix" },
  { key: "presentationDevis", label: "Présentation du devis" },
];

export function DebriefScreen({
  debrief,
  secretClient,
  confianceSeries,
  onRejouerMemeClient,
  onNouvellePartie,
}: {
  debrief: DebriefResult;
  secretClient: SecretClient;
  confianceSeries: number[];
  onRejouerMemeClient: () => void;
  onNouvellePartie: () => void;
}) {
  const donneesGraphique = confianceSeries.map((v, i) => ({ tour: i, confiance: v }));

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pb-8">
      <header className="pt-4 text-center">
        <p
          className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
            debrief.venteReussie
              ? "bg-emerald-100 text-emerald-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {debrief.venteReussie ? "Vente réussie 🎉" : "Vente non conclue"}
        </p>
        <p className="mt-3 text-4xl font-bold text-emerald-950">
          {debrief.noteGlobale}
          <span className="text-lg font-medium text-emerald-800/50">/100</span>
        </p>
      </header>

      <Card className="flex flex-col gap-3">
        <p className="text-sm font-medium text-emerald-950">Détail par critère</p>
        {CRITERES_LABELS.map(({ key, label }) => {
          const critere = debrief.criteres[key];
          return (
            <div key={key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-950">{label}</span>
                <span className="font-medium text-emerald-800">
                  {critere.note}/10
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-emerald-100">
                <div
                  className="h-1.5 rounded-full bg-emerald-600"
                  style={{ width: `${critere.note * 10}%` }}
                />
              </div>
              <p className="text-xs text-emerald-800/60">{critere.commentaire}</p>
            </div>
          );
        })}
      </Card>

      {donneesGraphique.length > 1 && (
        <Card>
          <p className="mb-2 text-sm font-medium text-emerald-950">
            Évolution de la confiance
          </p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={donneesGraphique}>
                <XAxis dataKey="tour" hide />
                <YAxis domain={[0, 100]} width={28} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`${value}/100`, "Confiance"]}
                  labelFormatter={() => ""}
                />
                <Line
                  type="monotone"
                  dataKey="confiance"
                  stroke="#047857"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {debrief.momentsCles.length > 0 && (
        <Card className="flex flex-col gap-4">
          <p className="text-sm font-medium text-emerald-950">Moments clés</p>
          {debrief.momentsCles.map((m, i) => (
            <div key={i} className="flex flex-col gap-1.5 border-l-2 border-emerald-200 pl-3">
              <p className="text-sm italic text-emerald-900">« {m.citation} »</p>
              <p className="text-xs text-red-700">
                <span className="font-medium">Ce que tu as dit : </span>
                {m.ceQueTuAsDit}
              </p>
              <p className="text-xs text-emerald-700">
                <span className="font-medium">Ce qui aurait été mieux : </span>
                {m.ceQuiAuraitEteMieux}
              </p>
            </div>
          ))}
        </Card>
      )}

      <Card className="flex flex-col gap-2">
        <p className="text-sm font-medium text-emerald-950">Conseils pour la prochaine fois</p>
        <ul className="flex flex-col gap-1.5 text-sm text-emerald-900">
          {debrief.conseils.map((c, i) => (
            <li key={i} className="flex gap-2">
              <span>{i + 1}.</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="flex flex-col gap-3 bg-emerald-950 text-white">
        <p className="text-sm font-medium">Fiche client révélée</p>
        <div className="flex flex-wrap gap-1.5">
          <Badge className="bg-emerald-800 text-emerald-50">
            {CHANTIER_LABELS[secretClient.chantier.type]}
          </Badge>
          <Badge className="bg-emerald-800 text-emerald-50">
            Critère : {secretClient.critereDecisionPrincipal}
          </Badge>
          <Badge className="bg-emerald-800 text-emerald-50">
            Moyens : {secretClient.niveauMoyens}
          </Badge>
        </div>
        <p className="text-sm text-emerald-100">
          Budget réel :{" "}
          <strong>
            {formatEuros(secretClient.budgetReelMinHT)} – {formatEuros(secretClient.budgetReelMaxHT)} HT
          </strong>{" "}
          (annoncé : « {secretClient.budgetAnnonce} »)
        </p>
        {secretClient.devisConcurrents.length > 0 && (
          <p className="text-sm text-emerald-100">
            Devis concurrents :{" "}
            {secretClient.devisConcurrents
              .map((d) => `${d.entreprise} (${formatEuros(d.montantTTC)} TTC)`)
              .join(", ")}
          </p>
        )}
        <p className="text-sm text-emerald-100">
          Objections cachées : {secretClient.objectionsCachees.join(", ")}
        </p>
        <p className="text-sm text-emerald-100">
          Déclencheurs : {secretClient.declencheurs.join(", ")}
        </p>
        {secretClient.situationParticuliere && (
          <p className="text-sm text-emerald-100">
            Situation particulière : {secretClient.situationParticuliere}
          </p>
        )}
      </Card>

      <p className="text-center text-sm text-emerald-800/70">{debrief.syntheseFinale}</p>

      <div className="flex flex-col gap-2">
        <Button onClick={onRejouerMemeClient} variant="secondary">
          Rejouer le même client
        </Button>
        <Button onClick={onNouvellePartie}>Nouvelle partie</Button>
      </div>
    </div>
  );
}
