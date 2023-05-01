import { createPromptForUserInputRecommendation } from "../../utils/chatGPT-prompts";
import { useMutation } from "@tanstack/react-query";
import { Product, Store } from "../../types";

import { findCategoryInInputText } from "../../utils/recommendationsHelpers";
import ChatComponent from "../ChatComponent";
import { chatGPTConversation } from "../../api/chatGPT";
import { useAppState } from "../../context/AppStateContext";

function randomizeAndCap<T>(list: T[], maxItems: number): T[] {
  const shuffledList = list.sort(() => Math.random() - 0.5);

  return shuffledList.slice(0, maxItems);
}

interface RecommendationFromUserInputProps {
  productsInStore: Product[];
  selectedStore: Store | null;
  categories: any[];
  selectedProducts: Product[];
  selectedCategory: { value: string; label: string; category: string } | null;
}

export default function RecommendationFromUserInput({
  productsInStore,
}: RecommendationFromUserInputProps) {
  const [state, dispatch] = useAppState();

  const {
    categories,
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

  function filterProductsByCategory(products: Product[], category: string) {
    if (!category) {
      return;
    }

    const filteredProducts = products.filter(
      (product) => product.mainCategory.code === category
    );

    return filteredProducts;
  }

  function extractJsonFromText(text: string) {
    const jsonPattern = /{[^}]+}/;
    const jsonObject = text.match(jsonPattern);
    return jsonObject ? JSON.parse(jsonObject[0]) : null;
  }

  function getContentFromResponse(rawContent: string) {
    try {
      const parsedContent = JSON.parse(rawContent);
      return parsedContent.r ? parsedContent.r : rawContent;
    } catch (e) {
      const embeddedJson = extractJsonFromText(rawContent);
      return embeddedJson && embeddedJson.r ? embeddedJson.r : rawContent;
    }
  }

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
        (product) => product.code === parsedJson.i
      );
      if (recommendedProduct) {
        console.log("recommendedProduct", recommendedProduct);
        setRecommendedProduct(recommendedProduct);
      }
    }
  }

  function prepareChatGPTPackage(message: string) {
    if (message.length === 0) return;

    const categoryFromUserInput =
      findCategoryInInputText(message, categories) ?? "";

    const filteredProductsByCategory = categoryFromUserInput
      ? filterProductsByCategory(productsInStore, categoryFromUserInput)
      : selectedCategory
      ? filterProductsByCategory(productsInStore, selectedCategory.value)
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

    const prompt = createPromptForUserInputRecommendation(
      category,
      randomizeAndCap(mappedProducts, 50),
      message
    );

    const conversationHistory = [
      { role: "assistant", content: prompt },
      { role: "user", content: message },
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

  function convertProductList(
    products: Product[]
  ): { id: string; name: string }[] {
    return products.map((product) => ({
      id: String(product.productId),
      name: product.name,
    }));
  }

  return (
    <>
      <ChatComponent
        product={recommendedProduct}
        handleSendMessage={handleSendMessage}
        inputMessage={inputMessage}
        isLoading={chatGPTMutation.isLoading}
        setInputMessage={setInputMessage}
        messages={messages}
        setMessages={setMessages}
      />
    </>
  );
}
