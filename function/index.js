const app = require("express")();
const dotenv = require("dotenv");
const express = require("express");
const scrapeAllProductDataFromStores = require("./scraper.cjs");

dotenv.config();

const PORT = process.env.PORT || 3012;

app.use(express.json());

app.get("/init_scrape", async (req, res) => {
  scrapeAllProductDataFromStores();
  res.send("<h2>Initiating scrape...</h2");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
