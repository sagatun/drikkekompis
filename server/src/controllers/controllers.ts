import {
  fetchAllStores,
  fetchAllProductsInStore,
} from "../functions/fetch-functions";

import { chatGPTConversationService } from "../services/services";

export async function getAllStores(req, res) {
  const stores = await fetchAllStores();
  res.send(stores);
}

export async function getAllProductsInStore(req, res) {
  const storeId = req.params.storeId;
  const allProductsInStore = await fetchAllProductsInStore(storeId);
  res.send(allProductsInStore);
}

export async function chatGPTConversationController(req, res) {
  chatGPTConversationService(req, res);
}
