const puppeteer = require("puppeteer-core");
const axios = require("axios");
const vinmonopolet = require("vinmonopolet");
const getSecret = require("./helpers.cjs");
const { getFirestoreInstance } = require("./firestore-functions.cjs");
const chromiumPath = process.env.PUPPETEER_EXECUTABLE_PATH;

const RESOURCE_TYPES_TO_BLOCK = [
  "stylesheet",
  "image",
  "media",
  "font",
  "websocket",
  "manifest",
  "other",
];

const scrapedProductToPlainObject = (product) =>
  JSON.parse(JSON.stringify(product));

const KATEGORIER =
  process.env.NODE_ENV === "production"
    ? [
        "øl",
        "rødvin",
        "hvitvin",
        "rosévin",
        "brennevin",
        "musserende_vin",
        "sterkvin",
        "perlende_vin",
        "sider",
        "aromatisert_vin",
        "alkoholfritt",
        "mjød",
        "sake",
        "fruktvin",
        "øvrig_svakvin",
      ]
    : [
        "øl",
        "rødvin",
        "hvitvin",
        "rosévin",
        "brennevin",
        "musserende_vin",
        "sterkvin",
        "perlende_vin",
        "sider",
        "aromatisert_vin",
        "alkoholfritt",
        "mjød",
        "sake",
        "fruktvin",
        "øvrig_svakvin",
      ];

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

async function randomMouseMove(page) {
  let x = Math.floor(Math.random() * 1000);
  let y = Math.floor(Math.random() * 1000);
  await page.mouse.move(x, y);
}

async function deleteOutdatedStores(firestore, storeIDs) {
  const storesSnapshot = await firestore.collection("stores").get();
  const deleteQueue = [];

  storesSnapshot.forEach((doc) => {
    if (!storeIDs.includes(doc.id)) {
      deleteQueue.push(doc.ref);
    }
  });

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

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function scrapeStoreByCategory(browser, storeId, category) {
  const initialUrl = `https://www.vinmonopolet.no/search?q=:relevance:availableInStores:${storeId}:mainCategory:${category}&searchType=product&currentPage=0`;

  const page = await newPageWithRandomUserAgent(browser);
  // await page.setUserAgent(
  //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
  // );

  await page.setRequestInterception(true);

  page.on("request", (interceptedRequest) => {
    if (RESOURCE_TYPES_TO_BLOCK.includes(interceptedRequest.resourceType())) {
      interceptedRequest.abort();
    } else {
      interceptedRequest.continue();
    }
  });

  // Wait for a random time between 3 seconds and 6 seconds
  await page.waitForTimeout(10000 + Math.floor(Math.random() * 13000));

  let response;
  try {
    response = await page.goto(initialUrl, {
      waitUntil: "networkidle2",
      timeout: 120000, // Increase the timeout duration to 120 seconds
    });

    await page.waitForSelector('button[aria-label="Gå til forrige side"]', {
      visible: true,
    });

    // Add this after the page loads
    await humanize(page);
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

  const totalPages = await getTotalPages(page);

  const randomizedTotalPagesArray = Array.from(Array(totalPages).keys()).sort(
    () => Math.random() - 0.5
  );

  console.log("Total pages", totalPages);

  let categoryProductIds = {};

  for (const currentPage of randomizedTotalPagesArray) {
    // const currentUrl = initialUrl.replace(
    //   /currentPage=\d+/,
    //   `currentPage=${currentPage}`
    // );

    // Wait for a random time between 3 seconds and 6 seconds
    await page.waitForTimeout(10000 + Math.floor(Math.random() * 13000));

    // await page.goto(currentUrl, { waitUntil: "networkidle2", timeout: 60000 });

    // Add this after the page loads
    await humanize(page);

    const productIdsAndPricesFromCurrentPage =
      await extractProductIdsAndStockFromPage(page);

    // Check if there are any products on the current page
    if (Object.keys(productIdsAndPricesFromCurrentPage).length === 0) {
      console.log(
        `No products found on page ${currentPage} for store "${storeId}" and category "${category}". Stopping...`
      );
      break;
    }

    categoryProductIds = {
      ...categoryProductIds,
      ...productIdsAndPricesFromCurrentPage,
    };

    // Click the next page button
    // Use try-catch block to handle error when there's no next page
    try {
      await page.click('button[aria-label="Gå til forrige side"]');
      await page.waitForNavigation({
        waitUntil: "networkidle2",
        timeout: 60000,
      });
    } catch (error) {
      console.error(`Failed to navigate to the next page: ${error}`);
      break; // exit the loop if cannot navigate to the next page
    }
  }

  await page.close();
  return categoryProductIds;
}

async function getStoreIDs() {
  if (process.env.NODE_ENV === "production") {
    const storesRes = await fetchAllStores();
    const storeIds = storesRes.map((store) => store.storeId);
    return storeIds.sort(() => Math.random() - 0.5); // randomize the order of the array
  } else {
    return ["200"]; //["115", "200", "269", "368"];
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
              ...scrapedData[key],
              ...productData,
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

async function getTotalPages(page) {
  try {
    console.log("Getting total pages...");

    const paginationText = await page.$(".pagination-text");

    const textContent = paginationText
      ? await paginationText.evaluate((el) => el.textContent)
      : null;
    console.log("Pagination text content:", textContent);
    if (textContent) {
      const textContent = await paginationText.evaluate((el) => el.textContent);
      const totalPages = parseInt(textContent.match(/\d+$/)[0]);
      return totalPages;
    }
    return 1;
  } catch (error) {
    console.error("Error in getTotalPages:", error);
    return 1;
  }
}

async function scrapeAllProductDataFromStores() {
  const browser = await puppeteer.launch({
    headless: true,

    executablePath: chromiumPath,
    timeout: 0,
    args: ["--disable-setuid-sandbox", "--no-sandbox"],
  });

  try {
    const storeIDs = await getStoreIDs();
    const storeIDsChunks = chunkArray(storeIDs, 5);
    const firestore = await getFirestoreInstance();

    // Delete outdated stores
    await deleteOutdatedStores(firestore, storeIDs);

    const allProductsCollectionRef = firestore.collection("allProducts");
    const allProductsSnapshot = await allProductsCollectionRef.get();
    const existingProducts = new Set(
      allProductsSnapshot.docs.map((doc) => doc.data().code)
    );

    for (const storeIDsChunk of storeIDsChunks) {
      console.log("Scraping stores chunk...", storeIDsChunk);

      for (let storeId of storeIDsChunk) {
        const randomizedKATEGORIER = KATEGORIER.sort(() => Math.random() - 0.5);

        for (let category of randomizedKATEGORIER) {
          try {
            // const delay = Math.floor(Math.random() * 5000) + 1000; // random delay between 1-6 seconds
            // await new Promise((resolve) => setTimeout(resolve, delay)); // wait for the random delay
            const products = await scrapeStoreByCategory(
              browser,
              storeId,
              category
            );

            console.log("Done with store", storeId, "and category", category);

            if (Object.keys(products).length > 0) {
              const storeRef = firestore.collection("stores").doc(storeId);

              await storeRef.set({ store_id: storeId });

              const productsCollectionRef = storeRef.collection("products");

              const productEntries = Object.entries(products);

              // Split the productEntries into smaller chunks of at most 500
              const productChunks = chunkArray(productEntries, 500);

              for (const productChunk of productChunks) {
                const batch = firestore.batch();

                productChunk.forEach(([productId, product]) => {
                  if (!existingProducts.has(productId)) {
                    const productRef = productsCollectionRef.doc(productId);
                    batch.set(productRef, scrapedProductToPlainObject(product));
                    existingProducts.add(productId);

                    // Add product to allProducts collection
                    const allProductsRef =
                      allProductsCollectionRef.doc(productId);
                    batch.set(
                      allProductsRef,
                      scrapedProductToPlainObject(product)
                    );
                  }
                });

                await batch.commit();
              }
            }
          } catch (error) {
            console.error(
              `Error scraping category "${category}" for store "${storeId}":`,
              error
            );
          }
        }
        console.log("Done with store", storeId);
      }
      // Add a delay between each chunk if needed (in milliseconds)
      // await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } catch (error) {
    console.log("Error scraping all stores : " + error);
    return {};
  } finally {
    console.log("Finished scraping all stores");
    if (browser) {
      console.log("Closing browser");
      await browser.close();
    }
  }
}

module.exports = scrapeAllProductDataFromStores;
