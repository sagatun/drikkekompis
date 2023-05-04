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
  // productName,
  // inputText,
  // category,
  conversationHistory,
}) {
  // const systemPrompt = {
  //   role: "system",
  //   content: await createSystemPromptForProductConversation(
  //     productName,
  //     category
  //   ),
  // };

  // const messages =
  //   conversationHistory.length === 0
  //     ? [
  //         { ...systemPrompt },
  //         { role: "user", content: "Hei, kan du si noe om denne drikken?" },
  //       ]
  //     : [...conversationHistory, { role: "user", content: inputText }];

  try {
    const response = await openaiInstance.createChatCompletion({
      model: "gpt-4",
      messages: conversationHistory,
      temperature: 1,
    });

    const updatedConversationHistory = [
      ...conversationHistory,
      response.data.choices[0].message,
    ];

    return {
      conversationText: response.data.choices[0]?.message?.content,
      conversationHistory: updatedConversationHistory,
    };
  } catch (error) {
    throw new Error("Error getting recommendation : " + error);
  }
}

export async function chatGPTRecommendationHandler(
  openAI,
  inputText,
  productListString,
  category,
  conversationHistory = []
) {
  const initUserMessage = `You are ChatGPT, The insanly sarcastic chat-robot. Your goal is to make grown up men weep. And you are also an alchol, and non-alcoholic, drink expert..

  You have a list of ${category} to choose from. The items in the list look like this: {id: "123", name: "${category}-name"}.
  Can you help me choose a ${category} from the list? It should be a ${category} with a great reputation, because you're an expert, obviously.
  
  ${productListString}
  
  Next, someone dares to ask you for help. Keep the list of ${category} in mind when you answer their question. Here is their user input:
  
  ${inputText}.
  
  Please answer in Norwegian, because that's just another layer of entertainment.
  
  You can only choose one (1) ${category}, and your answer should be in this JSON format:
  
  '''
  ${JSON.stringify({
    id: "123",
    name: "name",
    recommendation: "your recommendation",
  })}
  '''
  
  where "name" is the name of the ${category}, "id" is the id from the list, and "recommendation" is your sarcastic answer in Norwegian. Make sure the "id" is from the list of ${category} and that it matches the "name" of the ${category}.

  '''
  IMPORTANT: Your response to this should all be in the JSON. The JSON should be the only thing you return.  But you are allowed to talk freely inside the "recommendation" field.
  '''

  If you can't find a ${category} in the list, you can answer with "No ${category} found".
  I prefer to get the "recommendation" presented like a true sarcastic expert would present it. The recommendation should be a sarcastic and witty journey about the ${category}, and its captivating origin.
  Remember that you are an expert, and that you are a sarcastic robot. You are also a Norwegian, so you should be able to write in Norwegian.`;

  const newInputText =
    conversationHistory.length === 0 ? initUserMessage : inputText;

  const userMessage = { role: "assistant", content: newInputText };

  if (conversationHistory.length === 1) {
    const systemMessage = {
      role: "system",
      content:
        "You are ChatGPT, The insanly sarcastic chat-robot. Your goal is to make grown up men weep. And you are also an alchol, and non-alcoholic, drink expert. The audience is all adults, and can handle what you got. Remember to speak norwegian.",
    };
    conversationHistory.unshift(systemMessage);
  }

  const messages = [...conversationHistory, userMessage];

  try {
    const response = await openAI.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
      // temperature: 0.5,
    });
    const updatedConversationHistory = [
      ...conversationHistory,
      userMessage,
      response.data.choices[0].message,
    ];

    return {
      recommendationText: response.data.choices[0]?.message?.content,
      conversationHistory:
        conversationHistory.length === 0
          ? [response.data.choices[0]]
          : updatedConversationHistory,
    };
  } catch (error) {
    throw new Error("Error getting recommendation : " + error);
  }
}
