import {
  fetchAllStores,
  fetchAllProductsInStore,
} from "../functions/fetch-functions";

import {
  getChatGPTRecommendation,
  chatGPTConversationService,
} from "../services/services";

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

export async function getChatGPTRecommendationFromList(req, res) {
  getChatGPTRecommendation(req, res);
}

export async function getChatGPTRecommendationsFromUserInput(req, res) {
  getChatGPTRecommendation(req, res);
}
