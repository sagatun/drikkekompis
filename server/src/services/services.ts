import {
  getOpenaiInstance,
  chatGPTProductConversationHandler,
  chatGPTRecommendationHandler,
} from "../chatGPT/chatGPTfunctions";

import {
  createPromptForListRecommendation,
  createPromptForUserInputRecommendation,
} from "../chatGPT/chatGPTprompts";

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
    res.status(500).send("Error fetching recommendation: " + error.message);
  }
}

export async function getChatGPTRecommendation(req, res) {
  const openaiInstance = await getOpenaiInstance();

  const productsResponse = req.body;

  const category = productsResponse?.category;
  const products = productsResponse?.productList;
  const inputText = productsResponse?.inputText;
  const conversationHistory = productsResponse?.conversationHistory;

  const randomizedProductList = products
    ?.sort(() => Math.random() - 0.5)
    ?.slice(0, 50);

  const productListString = randomizedProductList?.map(
    (product) => JSON.stringify(product) + ",\n"
  );

  const prompt =
    Boolean(inputText) && inputText?.length > 0
      ? await createPromptForUserInputRecommendation(
          category,
          randomizedProductList,
          inputText
        )
      : await createPromptForListRecommendation(
          category,
          randomizedProductList
        );

  try {
    const recommendation = await chatGPTRecommendationHandler(
      openaiInstance,
      inputText,
      productListString,
      category,
      conversationHistory
    );
    res.send(recommendation);
  } catch (error) {
    res.status(500).send("Error fetching recommendation: " + error.message);
  }
}
