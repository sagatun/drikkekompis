import axios from "axios";
import { getSecret } from "../utils/helpers.js";
import { getFirestoreInstance } from "./firestore-functions.js";

const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const storeProductsCache = {};

function isCacheValid(timestamp: number | null) {
  const currentTime = new Date().getTime();
  return timestamp && currentTime - timestamp < cacheDuration;
}

export async function fetchAllProductsInStore(storeId: string) {
  try {
    console.log(`Fetching products for storeId: ${storeId}`);

    if (
      storeProductsCache[storeId] &&
      isCacheValid(storeProductsCache[storeId].timestamp)
    ) {
      console.log(`Returning products from cache for storeId: ${storeId}`);
      return storeProductsCache[storeId].products;
    }

    const firestore = await getFirestoreInstance();
    const storeRef = firestore?.collection("stores")?.doc(storeId);

    console.log(`storeRef: ${storeRef}`);

    if (!storeRef) {
      console.log(`No store found with storeId: ${storeId}`);
      return [];
    }

    const productsCollectionRef = storeRef.collection("products");
    console.log(`productsCollectionRef: ${productsCollectionRef}`);
    const productsSnapshot = await productsCollectionRef.get();
    console.log(`productsSnapshot: ${productsSnapshot}`);

    const products: unknown[] = [];

    productsSnapshot.forEach((doc) => {
      const productData = doc.data();
      products.push({ productId: doc.id, ...productData });
    });

    console.log(`Fetched ${products.length} products for storeId: ${storeId}`);

    storeProductsCache[storeId] = {
      products: products,
      timestamp: new Date().getTime(),
    };
    return products;
  } catch (error) {
    console.error(`Error fetching products for storeId: ${storeId} - ${error}`);
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
