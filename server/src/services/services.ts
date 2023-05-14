import vinmonopolet from "vinmonopolet";
import axios from "axios";
import { getSecret } from "../utils/helpers.js";

import {
  getOpenaiInstance,
  chatGPTProductConversationHandler,
} from "../chatGPT/chatGPTfunctions";

import { fetchAllStores } from "../functions/fetch-functions";

import { HeaderGenerator, PRESETS } from "header-generator";

export async function chatGPTConversationService(req, res) {
  const openaiInstance = await getOpenaiInstance();
  const productsResponse = req.body;

  const conversationHistory = productsResponse?.conversationHistory;

  try {
    const conversation = await chatGPTProductConversationHandler({
      openaiInstance,
      conversationHistory,
    });
    res.send(conversation);
  } catch (error) {
    res.status(500).send("Error fetching recommendation: " + error);
  }
}

export async function vinmonopoletService(req, res) {
  const stores = await fetchAllStores();

  // const beer = vinmonopolet.Facet.Category.BEER;
  // console.log("beer", beer);
  // const newBeersInBergen = await vinmonopolet.getProducts({
  //   facets: [newProduct, beer, bystasjonen],
  // });
  // console.log("newBeersInBergen", newBeersInBergen);
  // res.send(newBeersInBergen);
  const test = await FetchStoreStock(3516701, stores.slice(0, 3));
  console.log("test", test);
}

async function FetchStoreStock(productId: number, stores = []) {
  console.log({ productId, stores });
  const storeStocks = [];
  let expectedResults = 1;
  let fail = false;
  let tries = 0;
  const headerGenerator = new HeaderGenerator(PRESETS.MODERN_WINDOWS_CHROME);

  const vinmonopoletApiKey = (await getSecret("VINMONOPOLET_API_KEY")) ?? "";

  while (
    fail == false &&
    storeStocks.length < expectedResults &&
    stores.length > 0 &&
    tries < 50
  ) {
    const headers = headerGenerator.getHeaders();
    headers["Cache-Control"] = "no-cache";
    headers["Ocp-Apim-Subscription-Key"] = vinmonopoletApiKey.trim();
    console.log("headers", headers);
    const index = Math.floor(Math.random() * stores.length);
    const options = {
      method: "get",
      url: `https://www.vinmonopolet.no/api/products/${productId}/stock`,
      params: {
        pageSize: 1000,
        currentPage: 0,
        fields: "BASIC",
        latitude: stores[index].address.gpsCoord.split(";")[0],
        longitude: stores[index].address.gpsCoord.split(";")[1],
      },
      headers: headers,

      withCredentials: true,
    };

    stores.splice(index, 1);
    tries++;
    await axios(options)
      .then(async function (res) {
        res.data.stores.forEach((newStore) => {
          if (
            !storeStocks.some(
              (oldStore) =>
                oldStore.pointOfService.id === newStore.pointOfService.id
            )
          ) {
            delete newStore.pointOfService.address;
            delete newStore.pointOfService.formattedDistance;
            delete newStore.pointOfService.geoPoint;
            storeStocks.push(newStore);
            stores = stores.filter(
              (s) => s.storeId !== newStore.pointOfService.id
            );
          }
        });
        expectedResults = res.data.pagination.totalResults;
      })
      .catch(function (err) {
        console.log("Store stock fetch failed: " + err);
        fail = true;
      });
    if (expectedResults == 1 && storeStocks.length == 0) {
      fail = true;
    }
    await new Promise((r) => setTimeout(r, Math.random() * 2000 + 1000));
  }
  if (fail) {
    return { failed: fail, statusCode: 429, stocks: null };
  }

  console.log("Expected: " + expectedResults);
  console.log("Retrieved: " + storeStocks.length);
  console.log("tries: " + tries);

  return { failed: fail, statusCode: 200, stocks: storeStocks };
}
