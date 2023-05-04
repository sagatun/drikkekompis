import { createPromptForUserInputRecommendation } from "../../utils/chatGPT-prompts";
import { useMutation } from "@tanstack/react-query";
import { Product } from "../../types";
import {
  findCategoryInInputText,
  randomizeAndCap,
  filterProductsByCategory,
  extractJsonFromText,
  getContentFromResponse,
  convertProductList,
} from "../../utils/recommendationsUtils";
import ChatComponent from "../ChatComponent";
import { chatGPTConversation } from "../../api/chatGPT";
import { useAppState } from "../../context/AppStateContext";

export default function RecommendationFromUserInput() {
  const [state, dispatch] = useAppState();

  const {
    categories,
    subCategories,
    personality,
    productsInStore,
    selectedCategory,
    selectedProducts,
    recommendedProduct,
    inputMessage,
    messages,
  } = state;

  const setRecommendedProduct = (product: Product | null) =>
    dispatch({ type: "SET_RECOMMENDED_PRODUCT", payload: product });
  const setInputMessage = (message: string) =>
    dispatch({ type: "SET_INPUT_MESSAGE", payload: message });
  const setMessages = (newMessages: any[]) =>
    dispatch({ type: "SET_MESSAGES", payload: newMessages });

  function handleChatGPTResponse(response: any) {
    const rawContent = response.conversationHistory.pop().content;
    const content = getContentFromResponse(rawContent);

    setMessages([
      ...messages,
      {
        role: "assistant",
        content: content || "Error: Unable to parse content",
      },
    ]);

    const parsedJson = extractJsonFromText(rawContent);
    if (parsedJson && parsedJson.i) {
      const recommendedProduct: Product | undefined = productsInStore.find(
        (product: Product) => product.code === parsedJson.i
      );
      if (recommendedProduct) {
        setRecommendedProduct(recommendedProduct);
      }
    }
  }

  function prepareChatGPTPackage(inputText: string) {
    if (inputText.length === 0) return;

    const categoryFromUserInput =
      findCategoryInInputText(inputText, categories, subCategories) ?? "";

    console.log("categoryFromUserInput", categoryFromUserInput);

    const filteredProductsByCategory = categoryFromUserInput
      ? filterProductsByCategory(
          productsInStore,
          categoryFromUserInput,
          subCategories
        )
      : selectedCategory
      ? filterProductsByCategory(
          productsInStore,
          selectedCategory.value,
          subCategories
        )
      : [];

    const category: string =
      categoryFromUserInput ||
      (selectedCategory && selectedCategory.label) ||
      "product";

    const products = Boolean(selectedProducts.length)
      ? selectedProducts
      : filteredProductsByCategory && Boolean(filteredProductsByCategory.length)
      ? filteredProductsByCategory
      : productsInStore;

    const mappedProducts = products && convertProductList(products);

    console.log(randomizeAndCap(mappedProducts, 50));

    const prompt = createPromptForUserInputRecommendation(
      category,
      personality,
      randomizeAndCap(mappedProducts, 50),
      inputText
    );

    const conversationHistory = [
      { role: "assistant", content: prompt },
      { role: "user", content: inputText },
    ];

    return conversationHistory;
  }

  const chatGPTMutation = useMutation(chatGPTConversation, {
    onSuccess: (response) => {
      handleChatGPTResponse(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSendMessage = () => {
    const preparedMessage = prepareChatGPTPackage(inputMessage);
    if (messages.length === 1 && preparedMessage) {
      setInputMessage("");
      setMessages([...messages, preparedMessage[1]]);
      const packageForChatGPT = { conversationHistory: preparedMessage };
      chatGPTMutation.mutate(packageForChatGPT);
      return;
    }
    const updatedMessages = [
      ...messages,
      { content: inputMessage, role: "user" },
    ];
    setInputMessage("");
    setMessages(updatedMessages);

    const packageForChatGPT = { conversationHistory: updatedMessages };
    chatGPTMutation.mutate(packageForChatGPT);
  };

  return (
    <ChatComponent
      product={recommendedProduct}
      handleSendMessage={handleSendMessage}
      inputMessage={inputMessage}
      isLoading={chatGPTMutation.isLoading}
      setInputMessage={setInputMessage}
      messages={messages}
      setMessages={setMessages}
    />
  );
}
