import axios from "axios";
import { getSecret } from "../utils/helpers.js";
import { getFirestoreInstance } from "./firestore-functions.js";

const storeProductsCache = {};

export async function fetchAllProductsInStore(storeId) {
  if (storeProductsCache[storeId]) {
    return storeProductsCache[storeId];
  }
  const firestore = await getFirestoreInstance();
  const storeRef = firestore?.collection("storesTest")?.doc(storeId);

  const productsCollectionRef = storeRef.collection("products");
  const productsSnapshot = await productsCollectionRef.get();

  const products: any[] = [];

  productsSnapshot.forEach((doc) => {
    const productData = doc.data();
    products.push({ productId: doc.id, ...productData });
  });

  storeProductsCache[storeId] = products;
  return products;
}

const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
let storesCache: number | null = null;
let lastFetched: number | null = null;

export async function fetchAllStores() {
  try {
    const currentTime = new Date().getTime();

    if (
      storesCache &&
      lastFetched &&
      currentTime - lastFetched < cacheDuration
    ) {
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
      lastFetched = currentTime; // Update last fetched timestamp
      return storesCache;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching stores: " + error);
  }
}
