import {
  fetchAllStores,
  fetchAllProducts,
  fetchAllProductsInStore,
} from "../functions/fetch-functions";

import {
  chatGPTConversationService,
  vinmonopoletService,
} from "../services/services";

export async function getAllStores(req, res) {
  const stores = await fetchAllStores();
  res.send(stores);
}

export async function getAllProducts(req, res) {
  const allProducts = await fetchAllProducts();
  res.send(allProducts);
}

export async function vinmonopoletTest(req, res) {
  vinmonopoletService(req, res);
}

export async function getAllProductsInStore(req, res) {
  const storeId = req.params.storeId;
  const allProductsInStore = await fetchAllProductsInStore(storeId);
  res.send(allProductsInStore);
}

export async function chatGPTConversationController(req, res) {
  vinmonopoletService(req, res);
}
