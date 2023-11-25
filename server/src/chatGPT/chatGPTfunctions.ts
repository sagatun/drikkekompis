// import { Configuration, OpenAIApi } from "openai";
import OpenAI from "openai";
import { getSecret } from "../utils/helpers";

let openaiInstance: OpenAI;

export async function initializeOpenAI() {
  if (!openaiInstance) {
    const gptApiKey = (await getSecret("GPT_API_KEY")) ?? "";

    console.log("OpenAI initialized");

    openaiInstance = new OpenAI({ apiKey: gptApiKey });
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
  chatGPTModel = "gpt-4-1106-preview", // "gpt-4",
  temperature = 0.8,
}) {
  try {
    // const response = await openaiInstance.createChatCompletion({
    //   model: chatGPTModel,
    //   messages: conversationHistory,
    //   temperature: temperature,
    // });

    const completion = await openaiInstance.chat.completions.create({
      messages: conversationHistory,
      model: chatGPTModel,
    });

    const updatedConversationHistory = [
      ...conversationHistory,
      completion.choices[0].message,
    ];

    return {
      conversationText: completion.choices[0]?.message?.content,
      conversationHistory: updatedConversationHistory,
    };
  } catch (error) {
    throw new Error("Error getting recommendation : " + error);
  }
}
