import {
  getOpenaiInstance,
  chatGPTProductConversationHandler,
} from "../chatGPT/chatGPTfunctions";

export async function chatGPTConversationService(req, res) {
  const openaiInstance = await getOpenaiInstance();
  const productsResponse = req.body;

  const conversationHistory = productsResponse?.conversationHistory;

  const chatGPTModel = productsResponse?.chatGPTModel ?? "gpt-3.5-turbo";

  try {
    const conversation = await chatGPTProductConversationHandler({
      openaiInstance,
      conversationHistory,
      chatGPTModel,
    });
    res.send(conversation);
  } catch (error) {
    res.status(500).send("Error fetching recommendation: " + error);
  }
}
