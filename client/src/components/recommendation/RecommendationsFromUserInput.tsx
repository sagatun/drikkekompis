import React, { useState } from "react";
import { createSystemPromptForUserInputRecommendation } from "../../utils/chatGPT-prompts";
import { useMutation } from "@tanstack/react-query";
import { Product } from "../../types";
import {
  findCategoryInInputText,
  randomizeAndCap,
  filterProductsByCategory,
  convertProductList,
  getNamesFromResponse,
} from "../../utils/recommendationsUtils";
import ChatComponent from "../ChatComponent";
import { chatGPTConversation } from "../../api/chatGPT";
import { useAppState } from "../../context/AppState.context";
import slugify from "slugify";

export default function RecommendationFromUserInput() {
  const [state, dispatch] = useAppState();
  const [previousCategory, setPreviousCategory] = useState("");
  const [GPTProductList, setGPTProductList] = useState<string[]>([""]);

  const {
    categories,
    subCategories,
    personality,
    productsInStore,
    selectedCategory,
    selectedProducts,
    recommendedProducts,
    inputMessage,
    messages,
  } = state;

  const setRecommendedProducts = (products: Product[] | []) =>
    dispatch({ type: "SET_RECOMMENDED_PRODUCTS", payload: products });
  const setInputMessage = (message: string) =>
    dispatch({ type: "SET_INPUT_MESSAGE", payload: message });
  const setMessages = (newMessages: any[]) =>
    dispatch({ type: "SET_MESSAGES", payload: newMessages });

  function handleChatGPTResponse(response: any) {
    const rawContent = response.conversationHistory.pop().content;

    // const names = filteredProducts.map((product: Product) => product.name);

    const namesFromResponse = getNamesFromResponse(rawContent, GPTProductList);

    console.log("namesFromResponse: ", namesFromResponse);

    setMessages([
      ...messages,
      {
        role: "assistant",
        content: response.conversationText || "Error: Unable to parse content",
      },
    ]);

    const foundProducts = productsInStore.filter((product: Product) =>
      [...namesFromResponse].includes(
        slugify(product.name, { lower: true, strict: true })
      )
    );

    if (foundProducts) {
      const updatedRecommendedProducts = [
        ...recommendedProducts,
        ...foundProducts,
      ];

      setRecommendedProducts(updatedRecommendedProducts);
    }
  }

  function updateProductListOnCategoryChange(inputText: string) {
    if (inputText.length === 0) return;

    const categoryFromUserInput =
      findCategoryInInputText(inputText, categories, subCategories) ?? "";

    const filtered_products = categoryFromUserInput
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
      (selectedCategory && selectedCategory.name) ||
      "products";

    const products = Boolean(selectedProducts.length)
      ? selectedProducts
      : filtered_products && Boolean(filtered_products.length)
      ? filtered_products
      : productsInStore;

    const mappedProducts = products && convertProductList(products);

    const randomizedAndCappedProducts = randomizeAndCap(mappedProducts, 120);

    setGPTProductList(randomizedAndCappedProducts);

    const persona = productsInStore.length > 0 ? personality : "no-products";

    const prompt = createSystemPromptForUserInputRecommendation(
      category,
      persona,
      randomizedAndCappedProducts
    );

    const conversationHistory = [{ role: "system", content: prompt }];

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
    const categoryFound =
      findCategoryInInputText(inputMessage, categories, subCategories) ?? "";
    setInputMessage("");

    if (categoryFound || messages.length === 1) {
      const updatedProductList =
        previousCategory !== categoryFound || messages.length === 1
          ? updateProductListOnCategoryChange(inputMessage)
          : [];

      // Update the previousCategory state
      setPreviousCategory(categoryFound);

      if (updatedProductList && updatedProductList?.length > 0) {
        const filteredMessages = messages.filter(
          (message) => message.role !== "system"
        );
        const updatedMessages = [
          ...updatedProductList,
          ...filteredMessages,
          { content: inputMessage, role: "user" },
        ];

        setMessages(updatedMessages);
        const packageForChatGPT = { conversationHistory: updatedMessages };
        chatGPTMutation.mutate(packageForChatGPT);
        return;
      }
    }

    const updatedMessages = [
      ...messages,
      { content: inputMessage, role: "user" },
    ];

    setMessages(updatedMessages);
    const packageForChatGPT = { conversationHistory: updatedMessages };
    chatGPTMutation.mutate(packageForChatGPT);
  };

  return (
    <ChatComponent
      products={recommendedProducts}
      handleSendMessage={handleSendMessage}
      inputMessage={inputMessage}
      isLoading={chatGPTMutation.isLoading}
      setInputMessage={setInputMessage}
      messages={messages}
      setMessages={setMessages}
    />
  );
}
