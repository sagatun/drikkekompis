import express from "express";

import {
  getAllStores,
  getAllProducts,
  getAllProductsInStore,
  chatGPTConversationController,
} from "../controllers/controllers";
import { get } from "http";

export const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/get-conversation", chatGPTConversationController);

router.get("/get-all-stores", getAllStores);

router.get("/get-all-products", getAllProducts);

router.get("/get-all-products-in-store/:storeId", getAllProductsInStore);
