import {
  getOpenaiInstance,
  chatGPTProductConversationHandler,
} from "../chatGPT/chatGPTfunctions";

export async function chatGPTConversationService(req, res) {
  const openaiInstance = await getOpenaiInstance();
  const productsResponse = req.body;

  console.log("productsResponse: ", productsResponse);

  const conversationHistory = productsResponse?.conversationHistory;

  const chatGPTModel = productsResponse?.chatGPTModel;

  try {
    const conversation = await chatGPTProductConversationHandler({
      openaiInstance,
      conversationHistory,
      chatGPTModel,
    });
    res.send(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching recommendation: " + error);
  }
}
