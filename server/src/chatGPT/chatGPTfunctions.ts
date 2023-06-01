import { Configuration, OpenAIApi } from "openai";
import { getSecret } from "../utils/helpers";

let openaiInstance: OpenAIApi;

export async function initializeOpenAI() {
  if (!openaiInstance) {
    const gptApiKey = (await getSecret("GPT_API_KEY")) ?? "";

    const configuration = new Configuration({
      organization: "org-SoyEWJwFXEdXKN7iB35K25tu",
      apiKey: gptApiKey.trim(),
    });

    console.log("OpenAI initialized: " + Boolean(configuration));

    openaiInstance = new OpenAIApi(configuration);
  }
}

export async function getOpenaiInstance() {
  if (!openaiInstance) {
    await initializeOpenAI();
  }
  return openaiInstance;
}

export async function chatGPTProductConversationHandler({
  openaiInstance,
  conversationHistory,
  chatGPTModel = "gpt-3.5-turbo", // "gpt-4",
  temperature = 0.9,
}) {
  try {
    const response = await openaiInstance.createChatCompletion({
      model: chatGPTModel,
      messages: conversationHistory,
      temperature: temperature,
    });

    const updatedConversationHistory = [
      ...conversationHistory,
      response?.data?.choices[0].message,
    ];

    return {
      conversationText: response?.data?.choices[0]?.message?.content,
      conversationHistory: updatedConversationHistory,
    };
  } catch (error) {
    throw new Error("Error getting recommendation : " + error);
  }
}
