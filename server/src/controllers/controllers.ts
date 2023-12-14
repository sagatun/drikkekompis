import {
  fetchAllStores,
  fetchAllProducts,
  fetchAllProductsInStore,
} from "../functions/fetch-functions";
import { getFirestoreInstance } from "../functions/firestore-functions";

import { chatGPTConversationService } from "../services/services";

export async function getAllStores(req, res) {
  const stores = await fetchAllStores();
  res.send(stores);
}

let storesIdsCache = null;
let lastFetchedStoreIds: number | null = null;

export async function getAllStoresWithProducts(req, res) {
  try {
    if (isCacheValid(lastFetchedStoreIds)) {
      return res.status(200).send(storesIdsCache); // Return cached data if still valid
    }

    const stores: any = await fetchAllStores();

    if (!stores) {
      console.log(`No stores found`);
      return res.status(404).send("No stores found");
    }

    const firestore = await getFirestoreInstance();
    if (!firestore) {
      console.log(`Firestore instance could not be obtained`);
      return res.status(500).send("Unable to connect to Firestore");
    }

    const storesSnapshot = await firestore.collection("stores_new").get();
    if (storesSnapshot.empty) {
      console.log("No stores found");
      return res.status(404).send("No stores found");
    }

    let storeIds: any = [];
    for (let storeDoc of storesSnapshot.docs) {
      storeIds.push(storeDoc.id);
    }

    // filter stores with storeIds
    const filteredStores = stores.filter((store) =>
      storeIds.includes(store.storeId)
    );

    storesIdsCache = filteredStores; // Update cache
    lastFetchedStoreIds = new Date().getTime(); // Update last fetched timestamp

    return res.status(200).send(filteredStores);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching store ids: " + error);
  }
}

function isCacheValid(timestamp) {
  const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  return new Date().getTime() - timestamp < ONE_DAY;
}

export async function getAllProducts(req, res) {
  const allProducts = await fetchAllProducts();
  res.send(allProducts);
}

export async function getAllProductsInStore(req, res) {
  const storeId = req.params.storeId;
  const allProductsInStore = await fetchAllProductsInStore(storeId);
  res.send(allProductsInStore);
}

export async function chatGPTConversationController(req, res) {
  chatGPTConversationService(req, res);
}
