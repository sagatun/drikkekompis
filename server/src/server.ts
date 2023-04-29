import { initializeOpenAI } from "./chatGPT/chatGPTfunctions";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { router } from "./routes/routes";
import { initializeFirestore } from "./functions/firestore-functions";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "https://client-bdwsmnrktq-lz.a.run.app",
      "http://localhost:3000",
      "https://drikkekompis.eu",
      "https://www.drikkekompis.eu",
    ],
    credentials: true,
  })
);

const port = process.env.PORT || 5001;

async function initializeServer() {
  await initializeOpenAI();
  await initializeFirestore();
}

initializeServer();

app.use(express.json());
app.use("/", router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export default { app };
