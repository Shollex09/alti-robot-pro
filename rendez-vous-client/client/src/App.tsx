import { useState } from "react";
import {
  generateClient,
  getDebrief,
  negocierDevis,
  sendConversationMessage,
  sendDevis,
} from "./api";
import { AccueilScreen } from "./components/AccueilScreen";
import { ChatScreen } from "./components/ChatScreen";
import { DebriefScreen } from "./components/DebriefScreen";
import { DevisScreen } from "./components/DevisScreen";
import { NegociationScreen } from "./components/NegociationScreen";
import { ParametresScreen } from "./components/ParametresScreen";
import { Spinner } from "./components/ui";
import { addToHistorique, loadHistorique, loadTarifs, saveTarifs } from "./storage";
import type {
  ClientPublicInfo,
  ConversationTurn,
  DebriefResult,
  Devis,
  DevisDecision,
  Etape,
  NiveauChoix,
  SecretClient,
  Tarifs,
} from "./types";

const CONFIANCE_INITIALE = 50;

interface EtatPartie {
  secretClient: SecretClient | null;
  publicInfo: ClientPublicInfo | null;
  conversation: ConversationTurn[];
  confianceSeries: number[];
  infosRevelees: string[];
  devis: Devis | null;
  negociation: ConversationTurn[];
  negociationRound: number;
  contrePropositionHT: number | null;
  decisionFinale: DevisDecision | null;
  debrief: DebriefResult | null;
}

const PARTIE_VIDE: EtatPartie = {
  secretClient: null,
  publicInfo: null,
  conversation: [],
  confianceSeries: [CONFIANCE_INITIALE],
  infosRevelees: [],
  devis: null,
  negociation: [],
  negociationRound: 0,
  contrePropositionHT: null,
  decisionFinale: null,
  debrief: null,
};

export default function App() {
  const [etape, setEtape] = useState<Etape>("accueil");
  const [partie, setPartie] = useState<EtatPartie>(PARTIE_VIDE);
  const [tarifs, setTarifs] = useState<Tarifs>(() => loadTarifs());
  const [historique, setHistorique] = useState(() => loadHistorique());
  const [enAttente, setEnAttente] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const confianceActuelle =
    partie.confianceSeries[partie.confianceSeries.length - 1] ?? CONFIANCE_INITIALE;

  async function demarrerPartie(niveau: NiveauChoix) {
    setEtape("chargement_client");
    setErreur(null);
    try {
      const { secretClient, publicInfo } = await generateClient(niveau);
      setPartie({ ...PARTIE_VIDE, secretClient, publicInfo });
      setEtape("rendez_vous");
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Erreur inconnue.");
      setEtape("accueil");
    }
  }

  function rejouerMemeClient() {
    if (!partie.secretClient || !partie.publicInfo) return;
    setPartie({
      ...PARTIE_VIDE,
      secretClient: partie.secretClient,
      publicInfo: partie.publicInfo,
    });
    setEtape("rendez_vous");
  }

  async function envoyerMessage(message: string) {
    if (!partie.secretClient) return;
    const conversation = [
      ...partie.conversation,
      { role: "paysagiste" as const, content: message },
    ];
    setPartie((p) => ({ ...p, conversation }));
    setEnAttente(true);
    setErreur(null);
    try {
      const result = await sendConversationMessage(
        partie.secretClient,
        conversation,
        confianceActuelle,
      );
      setPartie((p) => ({
        ...p,
        conversation: [
          ...p.conversation,
          { role: "client", content: result.reponse },
        ],
        confianceSeries: [...p.confianceSeries, result.confiance],
        infosRevelees: [...p.infosRevelees, ...result.infos_revelees],
      }));
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Erreur inconnue.");
    } finally {
      setEnAttente(false);
    }
  }

  async function envoyerDevis(devis: Devis) {
    if (!partie.secretClient) return;
    setPartie((p) => ({ ...p, devis }));
    setEnAttente(true);
    setErreur(null);
    try {
      const result = await sendDevis(
        partie.secretClient,
        partie.conversation,
        confianceActuelle,
        devis,
      );
      const confianceSeries = [...partie.confianceSeries, result.confiance];
      setPartie((p) => ({ ...p, confianceSeries }));
      if (result.decision === "negocie") {
        setPartie((p) => ({
          ...p,
          negociation: [{ role: "client", content: result.reponse }],
          negociationRound: 1,
          contrePropositionHT: result.contrePropositionHT,
        }));
        setEtape("negociation");
      } else {
        await terminerPartie(
          devis,
          result.decision,
          [],
          partie.conversation,
          confianceSeries,
        );
      }
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Erreur inconnue.");
    } finally {
      setEnAttente(false);
    }
  }

  async function repondreNegociation(message: string) {
    if (!partie.secretClient || !partie.devis) return;
    const negociation = [
      ...partie.negociation,
      { role: "paysagiste" as const, content: message },
    ];
    setPartie((p) => ({ ...p, negociation }));
    setEnAttente(true);
    setErreur(null);
    try {
      const round = partie.negociationRound;
      const result = await negocierDevis(
        partie.secretClient,
        partie.devis,
        negociation,
        confianceActuelle,
        round,
      );
      const negociationMaj = [
        ...negociation,
        { role: "client" as const, content: result.reponse },
      ];
      const confianceSeries = [...partie.confianceSeries, result.confiance];
      setPartie((p) => ({
        ...p,
        negociation: negociationMaj,
        negociationRound: round + 1,
        contrePropositionHT: result.contrePropositionHT,
        confianceSeries,
      }));
      if (result.decision !== "negocie") {
        await terminerPartie(
          partie.devis,
          result.decision,
          negociationMaj,
          partie.conversation,
          confianceSeries,
        );
      }
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Erreur inconnue.");
    } finally {
      setEnAttente(false);
    }
  }

  async function terminerPartie(
    devis: Devis,
    decision: DevisDecision,
    negociation: ConversationTurn[],
    conversation: ConversationTurn[],
    confianceSeries: number[],
  ) {
    if (!partie.secretClient) return;
    setPartie((p) => ({ ...p, decisionFinale: decision }));
    setEnAttente(true);
    try {
      const debrief = await getDebrief({
        secretClient: partie.secretClient,
        conversation,
        confianceSeries,
        devis,
        negociation,
        decisionFinale: decision,
        tarifs,
      });
      setPartie((p) => ({ ...p, debrief }));
      addToHistorique({
        id: partie.secretClient.id,
        date: new Date().toISOString(),
        clientNom: `${partie.secretClient.prenom} ${partie.secretClient.nom}`,
        chantierType: partie.secretClient.chantier.type,
        niveau: partie.secretClient.niveau,
        venteReussie: debrief.venteReussie,
        noteGlobale: debrief.noteGlobale,
      });
      setHistorique(loadHistorique());
      setEtape("debriefing");
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Erreur inconnue.");
    } finally {
      setEnAttente(false);
    }
  }

  function nouvellePartie() {
    setPartie(PARTIE_VIDE);
    setEtape("accueil");
  }

  return (
    <>
      {etape === "accueil" && (
        <AccueilScreen
          onDemarrer={demarrerPartie}
          onOuvrirParametres={() => setEtape("parametres")}
          historique={historique}
        />
      )}

      {etape === "parametres" && (
        <ParametresScreen
          tarifs={tarifs}
          onSauvegarder={(t) => {
            setTarifs(t);
            saveTarifs(t);
          }}
          onRetour={() => setEtape("accueil")}
        />
      )}

      {etape === "chargement_client" && (
        <Spinner label="Génération du client en cours..." />
      )}

      {etape === "rendez_vous" && partie.publicInfo && (
        <ChatScreen
          publicInfo={partie.publicInfo}
          conversation={partie.conversation}
          infosRevelees={partie.infosRevelees}
          enAttente={enAttente}
          erreur={erreur}
          onEnvoyerMessage={envoyerMessage}
          onPasserAuDevis={() => setEtape("devis")}
        />
      )}

      {etape === "devis" && partie.secretClient && (
        <DevisScreen
          chantierType={partie.secretClient.chantier.type}
          infosRevelees={partie.infosRevelees}
          enAttente={enAttente}
          erreur={erreur}
          onEnvoyerDevis={envoyerDevis}
          onRetour={() => setEtape("rendez_vous")}
        />
      )}

      {etape === "negociation" && partie.devis && (
        <NegociationScreen
          negociation={partie.negociation}
          contrePropositionHT={partie.contrePropositionHT}
          totalDevisHT={partie.devis.lignes.reduce(
            (sum, l) => sum + l.quantite * l.prixUnitaireHT,
            0,
          )}
          enAttente={enAttente}
          erreur={erreur}
          onEnvoyerReponse={repondreNegociation}
        />
      )}

      {etape === "debriefing" && partie.debrief && partie.secretClient && (
        <DebriefScreen
          debrief={partie.debrief}
          secretClient={partie.secretClient}
          confianceSeries={partie.confianceSeries}
          onRejouerMemeClient={rejouerMemeClient}
          onNouvellePartie={nouvellePartie}
        />
      )}

      {etape === "debriefing" && !partie.debrief && (
        <Spinner label="Calcul du débriefing..." />
      )}
    </>
  );
}
