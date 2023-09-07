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
      "https://client-wyqxm5q4yq-lz.a.run.app", // kompis på personlig gcloug
      "http://localhost:3000",
      "http://localhost:4200",
      "https://drikkekompis.eu",
      "https://drikkekompis.app",
      "https://www.drikkekompis.eu",
      "https://www.drikkekompis.app",
      "https://erik-lessoneditor.nw.r.appspot.com",
      "https://lessoneditor.ew.r.appspot.com"
    ],
    credentials: true,
  })
);

const port = process.env.PORT || 5001;

async function initializeServer() {
  try {
    await initializeOpenAI();
    await initializeFirestore();
  } catch (error) {
    console.log(error);
  }
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
