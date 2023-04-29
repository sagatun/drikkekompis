// const scrapeAllProductDataFromStores = require("./function.js");
// const functions = require("@google-cloud/functions-framework");
const app = require("express")();
const vinmonopolet = require("vinmonopolet");
const dotenv = require("dotenv");
const express = require("express");
const scrapeAllProductDataFromStores = require("./scraper.cjs");

dotenv.config();

const PORT = process.env.PORT || 3012;

// functions.http("scrapeProducts", (req, res) => {
//   scrapeAllProductDataFromStores(req, res);
// });

app.use(express.json());

app.get("/init_scrape", async (req, res) => {
  scrapeAllProductDataFromStores();
  res.send("<h2>Initiating scrape...</h2");
});

app.get("/testvinmonopolet", async (req, res) => {
  vinmonopolet.stream
    .getStores()
    .on("data", function (store) {
      console.log(store);
    })
    .on("end", function () {
      console.log("Done!");
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
