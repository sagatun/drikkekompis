import express from "express";

import {
  getAllStores,
  getAllProductsInStore,
  chatGPTConversationController,
  getChatGPTRecommendationFromList,
  getChatGPTRecommendationsFromUserInput,
} from "../controllers/controllers";

export const router = express.Router();

console.log("router: " + JSON.stringify(router));

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/get-conversation", chatGPTConversationController);

router.get("/get-all-stores", getAllStores);

router.get("/get-all-products-in-store/:storeId", getAllProductsInStore);

router.post(
  "/get-chatgpt-recommendation-from-list",
  getChatGPTRecommendationFromList
);

router.post(
  "/get-chatgpt-recommendations-from-user-input",
  getChatGPTRecommendationsFromUserInput
);
