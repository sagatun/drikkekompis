import "dotenv/config";
import express from "express";
import scrapeAllProductDataFromStores from "./scraper/scraper.js";
import { removeLastScrapedFromStores } from "./utils/deleteLastUpdatedEntries.js";
import { getFirestoreInstance } from "./utils/firestore-functions.js";

const app = express();

const PORT = process.env.PORT || 3012;

app.get("/delete_last_updated_entries", async (req, res) => {
  const firestore = await getFirestoreInstance();
  removeLastScrapedFromStores(firestore);
  res.send("<h2>Deleting last updated...</h2");
});

app.get("/init_scrape", async (req, res) => {
  scrapeAllProductDataFromStores();
  res.send("<h2>Initiating scrape...</h2");
});

app.get("/", async (req, res) => {
  res.send("<h2>hello scraper...</h2");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
