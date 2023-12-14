import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { RESOURCE_TYPES_TO_BLOCK } from "./constants.js";
import { getFirestoreInstance } from "./firestore-functions.js";
import axios from "axios";
import vinmonopolet from "vinmonopolet";

async function getSecret(secretName, retries = 3, delayFactor = 2) {
  if (process.env.NODE_ENV === "production") {
    const client = new SecretManagerServiceClient();
    const projectID = "drikkekompis";

    let attempt = 0;
    while (attempt < retries) {
      try {
        const [version] = await client.accessSecretVersion({
          name: `projects/${projectID}/secrets/${secretName}/versions/latest`,
        });

        const secretValue = version.payload.data.toString("utf8");
        return secretValue;
      } catch (error) {
        if (error.code === 4 && attempt < retries - 1) {
          // DEADLINE_EXCEEDED (code 4)
          const sleepTime = delayFactor ** attempt * 1000; // Exponential backoff in milliseconds
          console.log(`Retrying in ${sleepTime / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, sleepTime));
          attempt++;
        } else {
          console.error("Error accessing secret:", error);
          throw error;
        }
      }
    }
  } else {
    // In development, use local environment variables
    return process.env[secretName];
  }
}

export function scrapedProductToPlainObject(product) {
  const jsonStr = JSON.stringify(product);
  const productObj = JSON.parse(jsonStr);
  return productObj;
}

async function humanize(page) {
  // Random scrolling
  await page.evaluate(async () => {
    window.scrollBy(0, window.innerHeight * (Math.random() > 0.5 ? 1 : -1));
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 10000));
  });

  // Random mouse movements
  let x = Math.floor(Math.random() * 1000);
  let y = Math.floor(Math.random() * 1000);
  await page.mouse.move(x, y);

  // Random viewport
  const width = 800 + Math.floor(Math.random() * 200); // width between 800 and 1000
  const height = 600 + Math.floor(Math.random() * 200); // height between 600 and 800
  await page.setViewport({ width, height });
}

// Random user-agent for each new page
async function newPageWithRandomUserAgent(browser) {
  const page = await browser.newPage();
  const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/" +
    (Math.floor(Math.random() * 5) + 85) +
    ".0.4389.82 Safari/537.36"; // Randomize Chrome version
  await page.setUserAgent(userAgent);
  return page;
}

async function getTotalPages(page) {
  try {
    console.log("Getting total pages..." + page.url());

    const noFiltersElement = await page.$(".section__refinement__message");

    if (noFiltersElement) {
      const textContent = await page.evaluate(
        (element) => element.textContent.trim(),
        noFiltersElement
      );

      if (textContent === "Ingen filtre for denne visningen") {
        console.log("No filters for this view");
        return -1;
      }
    }

    const paginationText = await page.$(".pagination-text");

    const textContent = paginationText
      ? await paginationText.evaluate((el) => el.textContent)
      : null;
    console.log("Pagination text content:", textContent);
    if (textContent) {
      const totalPages = parseInt(textContent.match(/\d+$/)[0]);
      return totalPages;
    }
    return 1;
  } catch (error) {
    console.error("Error in getTotalPages:", error);
    return 1;
  }
}

export async function deleteOutdatedStores(firestore, storeIDs) {
  if (storeIDs.length < 100) {
    return;
    throw new Error("Too few stores in list, manual confirmation required.");
  }
  const storesSnapshot = await firestore.collection("stores_new").get();
  const deleteQueue = [];

  storesSnapshot.forEach((doc) => {
    if (!storeIDs.includes(doc.id)) {
      deleteQueue.push(doc.ref);
    }
  });

  if (deleteQueue.length > 10) {
    return;
    throw new Error("Too many stores to delete, manual confirmation required.");
  }

  console.log("deleteQueue", deleteQueue);

  let deleteCount = 0;

  while (deleteQueue.length > 0) {
    const batch = firestore.batch();
    const batchDeleteRefs = deleteQueue.splice(0, 500);

    batchDeleteRefs.forEach((ref) => {
      batch.delete(ref);
      deleteCount++;
    });

    await batch.commit();
  }

  if (deleteCount > 0) {
    console.log(`Deleted ${deleteCount} outdated stores.`);
  } else {
    console.log("No outdated stores to delete.");
  }
}

export function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export async function scrapeStoreByCategory(browser, storeId, category) {
  if (!storeId || category === "" || Boolean(!category)) {
    console.error("Missing storeId or category");
    return {};
  }
  const initialUrl = `https://www.vinmonopolet.no/search?q=:relevance:availableInStores:${storeId}:mainCategory:${category}&searchType=product&currentPage=0`;

  const page = await newPageWithRandomUserAgent(browser);

  await page.setRequestInterception(true);

  page.on("request", (interceptedRequest) => {
    if (RESOURCE_TYPES_TO_BLOCK.includes(interceptedRequest.resourceType())) {
      interceptedRequest.abort();
    } else {
      interceptedRequest.continue();
    }
  });

  // Wait for a random time between 3 seconds and 6 seconds
  await page.waitForTimeout(11000 + Math.floor(Math.random() * 3000));

  let response;
  try {
    response = await page.goto(initialUrl, {
      waitUntil: "domcontentloaded",
      timeout: 8000,
    });

    await humanize(page);
    await page.waitForTimeout(500 + Math.floor(Math.random() * 1000));
  } catch (error) {
    console.error(
      `Error navigating to initial URL for store "${storeId}" and category "${category}":`,
      error
    );
    await page.close();
    return {};
  }

  // Check if the response status is 404
  if (response.status() === 404) {
    console.warn(
      `Page not found for store "${storeId}" and category "${category}". Skipping...`
    );
    await page.close();
    return {};
  }

  let productIDsAndPricesFromAllPages = {};

  const totalPages = await getTotalPages(page);

  if (totalPages === -1) {
    console.log("No category content in this page");
    return productIDsAndPricesFromAllPages;
  }

  const randomizedTotalPagesArray = Array.from(Array(totalPages).keys()).sort(
    () => Math.random() - 0.5
  );

  console.log("Total pages", totalPages);

  for (const currentPage of randomizedTotalPagesArray) {
    const currentUrl = initialUrl.replace(
      /currentPage=\d+/,
      `currentPage=${currentPage}`
    );

    await page.waitForTimeout(11000 + Math.floor(Math.random() * 3000));

    await page.goto(currentUrl, {
      waitUntil: "domcontentloaded",
      timeout: 8000,
    });

    await page.waitForTimeout(1000 + Math.floor(Math.random() * 2000));

    await humanize(page);

    const productIDsAndPricesFromCurrentPage =
      await extractProductIdsAndStockFromPage(page);

    // Check if there are any products on the current page
    if (Object.keys(productIDsAndPricesFromCurrentPage).length === 0) {
      console.log(
        `No products found on page ${currentPage} for store "${storeId}" and category "${category}". Stopping...`
      );
      break;
    }

    productIDsAndPricesFromAllPages = {
      ...productIDsAndPricesFromAllPages,
      ...productIDsAndPricesFromCurrentPage,
    };
  }

  await page.close();
  return productIDsAndPricesFromAllPages;
}

export async function getStores(SCRAPE_ALL_STORES = false) {
  if (SCRAPE_ALL_STORES) {
    const firestore = await getFirestoreInstance();

    // fetch the list of all store IDs
    const allStores = await fetchAllStores();

    console.log("allStores", allStores.length);

    // fetch the list of already scraped stores, sorted by lastScraped timestamp
    const scrapedStoresSnapshot = await firestore
      .collection("stores_new")
      .where("lastScraped", "!=", null)
      .orderBy("lastScraped")
      .get();

    const scrapedStores = scrapedStoresSnapshot.docs.map((doc) => doc.id);

    console.log("scrapedStores", scrapedStores);

    console.log("scrapedStores length", scrapedStores.length);

    // get stores that have not been scraped with date stamp yet
    // and randomize the order
    const stores = allStores
      .filter((store) => !scrapedStores.includes(store.storeId))
      .sort(() => Math.random() - 0.5);

    const recentlyScrapedStores = allStores.filter((store) =>
      scrapedStores.includes(store.storeId)
    );

    // create combined list, with new stores coming first
    const combinedStores = [...stores, ...recentlyScrapedStores];

    console.log("store-list length", combinedStores.length);

    return combinedStores;
  } else {
    // fetch the list of all store IDs
    const allStores = await fetchAllStores();

    const storesToScrape = ["200"]; // 200:Alta, 269:Storslett, 368:Sjævegan, 216:Finnsnes, 133:Lakselv

    const stores = allStores.filter((store) =>
      storesToScrape.includes(store.storeId)
    );

    console.log(JSON.stringify(stores));

    return stores;
  }
}

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

    const returnData = response.data.filter((store) => store.status === "Open");
    return returnData || [];
  } catch (error) {
    console.log("Error fetching all stores in scraper : " + error);
    return [];
  }
}

async function extractProductIdsAndStockFromPage(page, maxRetries = 3) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(
        "Extracting product ids and prices from page..." + page.url()
      );
      const products = await page.$$eval(".product-item", (productElements) => {
        const productsObject = {};

        productElements.forEach((element) => {
          const productIdElement = element.querySelector(".product__code");

          const stockStatusElement = element.querySelector(
            ".product-stock-status-line-text"
          );

          if (productIdElement && stockStatusElement) {
            const productId = productIdElement.textContent.trim();

            const stockStatusText = stockStatusElement
              .querySelector("span:first-child")
              .textContent.trim();

            const stock = parseInt(stockStatusText.match(/\d+/)[0]);

            productsObject[productId] = {
              stock,
            };
          }
        });

        return productsObject;
      });

      // Check if productsObject is not empty
      if (Object.keys(products).length > 0) {
        const productIds = Object.keys(products).map((key) => String(key));
        const productsData = await vinmonopolet?.getProductsById(productIds);

        function copyProductDataToScrapedData(productsData, scrapedData) {
          let combinedProductData = {};

          for (let key in scrapedData) {
            const productData = productsData.find((item) => item.code == key);
            combinedProductData[key] = {
              ...productData,
              ...scrapedData[key],
            };
          }

          return combinedProductData;
        }
        const newProducts = copyProductDataToScrapedData(
          productsData,
          products
        );

        return newProducts;
      } else {
        console.log("Empty productsObject, retrying...");
      }
    } catch (error) {
      console.error("Error in extractProductIdsAndStockFromPage:", error);
    }
    retries++;
  }
  console.error(
    `Failed to extract product ids and prices after ${maxRetries} retries.`
  );
  return {};
}
