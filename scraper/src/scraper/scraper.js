import puppeteer from "puppeteer";
import {
  scrapedProductToPlainObject,
  chunkArray,
  deleteOutdatedStores,
  scrapeStoreByCategory,
  getStores,
} from "../utils/helpers.js";
import { getFirestoreInstance } from "../utils/firestore-functions.js";
import { KATEGORIER } from "../utils/constants.js";

const SCRAPE_ALL_STORES = false;

async function scrapeAllProductDataFromStores() {
  const startTime = Date.now();

  const browser = await puppeteer.launch({
    headless: "true",
    // executablePath: chromiumPath,
    timeout: 0,
    args: ["--disable-setuid-sandbox", "--no-sandbox"],
  });

  try {
    const stores = await getStores(SCRAPE_ALL_STORES);

    //randomize the order of stores
    const storeIDs = stores.map((store) => store.storeId);

    const firestore = await getFirestoreInstance();

    // Delete outdated stores
    await deleteOutdatedStores(firestore, storeIDs);

    let counter = 0;

    for (let storeId of storeIDs) {
      console.log(
        "Starting with store",
        storeId,
        "... Store + " + counter++ + " of " + storeIDs.length + " stores"
      );

      // time elapsed in milliseconds
      const timeElapsed = Date.now() - startTime;

      // Convert to hours, minutes, and seconds
      const hours = Math.floor(timeElapsed / 1000 / 60 / 60);
      const minutes = Math.floor((timeElapsed / 1000 / 60) % 60);

      console.log(`Time elapsed: ${hours} hour(s), ${minutes} minute(s)`);

      const randomizedKATEGORIER = KATEGORIER.sort(() => Math.random() - 0.5);

      let products = {};

      for (let category of randomizedKATEGORIER) {
        try {
          const delay = Math.floor(Math.random() * 1000) + 10000; // random delay between 1-6 seconds
          await new Promise((resolve) => setTimeout(resolve, delay)); // wait for the random delay
          const categoryProducts = await scrapeStoreByCategory(
            browser,
            storeId,
            category
          );

          console.log("Done with store", storeId, "and category", category);

          // Merge the products from this category with the products from the previous categories
          products = { ...products, ...categoryProducts };
        } catch (error) {
          console.error(
            `Error scraping category "${category}" for store "${storeId}":`,
            error
          );
        }
      }

      const storeRef = firestore.collection("stores").doc(storeId);

      await storeRef.set({ store_id: storeId });

      const productsCollectionRef = storeRef.collection("products");

      // Delete all documents in the products subcollection
      const snapshot = await productsCollectionRef.get();

      const deletionPromises = snapshot.docs.map((doc) => doc.ref.delete());

      await Promise.all(deletionPromises);

      const { Timestamp } = require("@google-cloud/firestore");
      let currentTimestamp = Timestamp.now();

      if (Object.keys(products).length > 0) {
        const storeRef = firestore.collection("stores").doc(storeId);

        await storeRef.set({
          store_id: storeId,
          lastScraped: currentTimestamp,
        });

        const productsCollectionRef = storeRef.collection("products");

        const productEntries = Object.entries(products);

        // Split the productEntries into smaller chunks of at most 500
        const productChunks = chunkArray(productEntries, 500);

        for (const productChunk of productChunks) {
          const batch = firestore.batch();

          productChunk.forEach(([productId, product]) => {
            const productRef = productsCollectionRef.doc(productId);
            batch.set(productRef, scrapedProductToPlainObject(product));
          });

          await batch.commit();
        }
      }

      console.log("Done with store", storeId);
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

export default scrapeAllProductDataFromStores;
