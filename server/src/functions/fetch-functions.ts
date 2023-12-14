import axios from "axios";
import { getSecret } from "../utils/helpers.js";
import { getFirestoreInstance } from "./firestore-functions.js";

const storeProductsCache = {};

function isCacheValid(timestamp) {
  const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  return new Date().getTime() - timestamp < ONE_DAY;
}

export async function fetchAndCacheAllProducts() {
  const stores = ((await fetchAllStores()) as any) ?? [];
  if (!stores) {
    console.log("Failed to fetch stores");
    return;
  }

  for (const store of stores) {
    if (!store.id) {
      console.log("Store id not found");
      continue;
    }
    await fetchAllProductsInStore(store.id);
  }
}

export async function fetchAllProductsInStore(storeId) {
  try {
    console.log(`Fetching products for storeId: ${storeId}`);

    // Check if cache is available and valid
    if (
      storeProductsCache[storeId] &&
      isCacheValid(storeProductsCache[storeId].timestamp)
    ) {
      console.log(`Returning products from cache for storeId: ${storeId}`);
      return storeProductsCache[storeId].products;
    }

    const firestore = await getFirestoreInstance();
    if (!firestore) {
      console.log(`Firestore instance could not be obtained`);
      return [];
    }

    const storeRef = firestore.doc(`stores_new/${storeId}`);

    const storeDoc = await storeRef.get();
    if (!storeDoc.exists) {
      console.log(`No store found with storeId: ${storeId}`);
      return [];
    }

    const storeData = storeDoc.data();
    if (!storeData || !Array.isArray(storeData.productIds)) {
      console.log(`No data found for store with storeId: ${storeId}`);
      return [];
    }

    const productStocks = storeData.productIds;

    // Fetch products in a batch
    const products = await fetchProductsInBatch(firestore, productStocks);
    console.log(`Fetched ${products.length} products for storeId: ${storeId}`);

    // Cache and return products
    storeProductsCache[storeId] = {
      products,
      timestamp: new Date().getTime(),
    };
    return products;
  } catch (error) {
    console.error(`Error fetching products for storeId: ${storeId} - ${error}`);
    throw error;
  }
}

// Helper function to fetch products in a batch
async function fetchProductsInBatch(firestore, productStocks) {
  try {
    const productRefs = productStocks.map((item) =>
      firestore.doc(`products/${item.productId}`)
    );
    const productDocs = await firestore.getAll(...productRefs);

    return productDocs
      .map((doc, index) => {
        if (!doc.exists) {
          console.log(
            `No product found with id: ${productStocks[index].productId}`
          );
          return null;
        }
        return {
          productId: doc.id,
          stock: productStocks[index].stock,
          ...doc.data(),
        };
      })
      .filter((product) => product !== null);
  } catch (error) {
    console.error(`Error fetching products in batch - ${error}`);
    throw error;
  }
}

let storesCache = null;
let lastFetchedStores: number | null = null;

export async function fetchAllStores() {
  try {
    if (isCacheValid(lastFetchedStores)) {
      return storesCache; // Return cached data if still valid
    }

    const vinmonopoletApiKey = await getSecret("VINMONOPOLET_API_KEY");

    const response =
      vinmonopoletApiKey &&
      (await axios.get("https://apis.vinmonopolet.no/stores/v0/details", {
        headers: {
          "Cache-Control": "no-cache",
          "Ocp-Apim-Subscription-Key": vinmonopoletApiKey.trim(),
        },
      }));

    if (response && response.data) {
      storesCache = response.data; // Update cache
      lastFetchedStores = new Date().getTime(); // Update last fetched timestamp
      return storesCache;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching stores: " + error);
  }
}

export async function fetchAllProducts() {
  try {
    console.log("Fetching all products");
  } catch (e) {
    console.error(e);
  }
}
