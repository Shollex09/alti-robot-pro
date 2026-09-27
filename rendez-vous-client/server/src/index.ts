import "dotenv/config";
import express from "express";
import cors from "cors";
import clientRouter from "./routes/client.js";
import conversationRouter from "./routes/conversation.js";
import devisRouter from "./routes/devis.js";
import debriefRouter from "./routes/debrief.js";

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    "ATTENTION : ANTHROPIC_API_KEY n'est pas définie. Les appels à Claude échoueront.",
  );
}

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/client", clientRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/devis", devisRouter);
app.use("/api/debrief", debriefRouter);

app.listen(PORT, () => {
  console.log(`Serveur "Rendez-vous Client" démarré sur http://localhost:${PORT}`);
});
