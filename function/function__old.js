const puppeteer = require("puppeteer");
const axios = require("axios");
const getSecret = require("./helpers.cjs");
const chromiumPath = "/usr/bin/chromium-browser";

const KATEGORIER =
  process.env.NODE_ENV === "production"
    ? [
        "øl",
        // "rødvin",
        // "hvitvin",
        // "rosévin",
        // "brennevin",
        // "musserende_vin",
        // "sterkvin",
        // "perlende_vin",
        // "sider",
        // "aromatisert_vin",
        // "alkoholfritt",
        // "mjød",
        // "sake",
        // "fruktvin",
        // "øvrig_svakvin",
      ]
    : ["musserende_vin", "sterkvin"];

async function fetchAllStores() {
  try {
    const vinmonopoletApiKey = await getSecret("VINMONOPOLET_API_KEY");
    const response = await axios.get(
      "https://apis.vinmonopolet.no/stores/v0/details",
      {
        headers: {
          "Cache-Control": "no-cache",
          "Ocp-Apim-Subscription-Key": vinmonopoletApiKey.trim(),
        },
      }
    );

    const returnData = response?.data?.filter(
      (store) => store?.status === "Open"
    );
    return returnData;
  } catch (error) {
    console.log("Error fetching all stores in scraper : " + error);
    return [];
  }
}

const extractProductIdsAndPricesFromPage = async (page) => {
  await page.waitForSelector(".product-item", { timeout: 10000 });
  const products = await page.$$eval(".product-item", (productElements) => {
    const productsObject = {};

    productElements.forEach((element) => {
      const productIdElement = element.querySelector(".product__code");
      const productNameElement = element.querySelector(".product__name");
      const priceElement = element.querySelector(".product__price");
      const amountElement = element.querySelector(".amount");
      const stockStatusElement = element.querySelector(
        ".product-stock-status-line-text"
      );

      if (
        productIdElement &&
        productNameElement &&
        priceElement &&
        amountElement &&
        stockStatusElement
      ) {
        const productId = productIdElement.textContent.trim();
        const productName = productNameElement.textContent.trim();
        let price = priceElement.textContent.trim();
        const amount = amountElement.textContent.trim();
        price = parseFloat(price.replace("Kr", "").replace(",", "."));

        const stockStatusText = stockStatusElement
          .querySelector("span:first-child")
          .textContent.trim();
        const stock = parseInt(stockStatusText.match(/\d+/)[0]);

        productsObject[productId] = { productName, price, amount, stock };
      }
    });

    return productsObject;
  });

  return products;
};

const getTotalPages = async (page) => {
  try {
    await page.waitForSelector(".pagination-text", { timeout: 10000 });
    const paginationText = await page.$(".pagination-text");
    const textContent = await paginationText.evaluate((el) => el.textContent);
    const totalPages = parseInt(textContent.match(/\d+$/)[0]);
    return totalPages;
  } catch (error) {
    console.error("Error getting total pages:", error);
    return 1;
  }
};

const scrapeAllProductDataFromStores = async (req, res) => {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 20000,
    ignoreHTTPSErrors: true,
    slowMo: 0,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote",
      "--window-size=1280,720",
    ],
  });
  try {
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720 });

    // Block images, videos, fonts from downloading
    await page.setRequestInterception(true);
    console.log({ page });

    page.on("request", (interceptedRequest) => {
      const blockResources = ["script", "stylesheet", "image", "media", "font"];
      if (blockResources.includes(interceptedRequest.resourceType())) {
        interceptedRequest.abort();
      } else {
        interceptedRequest.continue();
      }
    });

    // Change the user agent of the scraper
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
    );

    // const storesRes =
    //   process.env.NODE_ENV === "production" ? await fetchAllStores() : ""; //comment out in dev
    // const storeIDs = ["368"];
    // const storeIDs =
    //   process.env.NODE_ENV === "production" && storesRes?.length > 0
    //     ? storesRes?.map((store) => store.storeId)
    //     : ["269", "368"];

    const storeIDs = ["368"];

    console.log("Starting scraping..." + new Date().toLocaleString());

    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

    let allStoresWithProductIDsAndPrice = {};

    for (const storeId of storeIDs) {
      console.log("Starting with store", storeId);
      allStoresWithProductIDsAndPrice[storeId] = {};

      for (const category of KATEGORIER) {
        console.log("Starting with store", storeId, "and category", category);
        const initialUrl = `https://www.vinmonopolet.no/search?q=:relevance:availableInStores:${storeId}:mainCategory:${category}&searchType=product&currentPage=0`;

        await page.goto(initialUrl, { waitUntil: "networkidle2" });

        const totalPages = await getTotalPages(page);

        let categoryProductIds = {};

        for (let currentPage = 0; currentPage < totalPages; currentPage++) {
          const currentUrl = initialUrl.replace(
            /currentPage=\d+/,
            `currentPage=${currentPage}`
          );

          await page.goto(currentUrl, { waitUntil: "networkidle2" });

          const productIdsAndPricesFromCurrentPage =
            await extractProductIdsAndPricesFromPage(page);
          categoryProductIds = {
            ...categoryProductIds,
            ...productIdsAndPricesFromCurrentPage,
          };
        }

        allStoresWithProductIDsAndPrice[storeId][category] = categoryProductIds;
        console.log("Done with store", storeId, "and category", category);
      }
      console.log("Done with store", storeId);
    }

    await browser.close();
    res.status(200).send(allStoresWithProductIDsAndPrice);
  } catch (error) {
    console.log("Error scraping all product data from stores : " + error);
    res.status(500).send({ error: "Error launching browser" + error });
  }
};

module.exports = scrapeAllProductDataFromStores;
