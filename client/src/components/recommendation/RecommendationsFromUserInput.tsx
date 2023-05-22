import React, { useState } from "react";
import { createSystemPromptForUserInputRecommendation } from "../../utils/chatGPT-prompts";
import { useIsFetching, useMutation } from "@tanstack/react-query";
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
  const [persona, setPersona] = useState("no-products");

  const productsIsFetching = useIsFetching({
    queryKey: ["fetchProductsInStore"],
  });

  const {
    categories,
    subCategories,
    personality,
    productsInStore,
    selectedCategory,
    selectedProducts,
    recommendedProducts,
    inputMessage,
    chatGPTModel,
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

    const listSizeLimit = chatGPTModel === "gpt-4" ? 200 : 100;

    const randomizedAndCappedProducts = randomizeAndCap(
      mappedProducts,
      listSizeLimit
    );

    setGPTProductList(randomizedAndCappedProducts);

    let p = "no-products";
    if (productsInStore.length > 0) {
      p = personality;
      setPersona(p);
    }

    const prompt = createSystemPromptForUserInputRecommendation(
      category,
      p,
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

    if (
      categoryFound ||
      messages.length === 1 ||
      (persona === "no-products" && productsInStore.length > 0)
    ) {
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
        const packageForChatGPT = {
          conversationHistory: updatedMessages,
          chatGPTModel: chatGPTModel,
        };
        try {
          chatGPTMutation.mutate(packageForChatGPT);
        } catch (e) {
          console.error(e);
        }
        return;
      }
    }

    const updatedMessages = [
      ...messages,
      { content: inputMessage, role: "user" },
    ];

    setMessages(updatedMessages);
    const packageForChatGPT = {
      conversationHistory: updatedMessages,
      chatGPTModel: chatGPTModel,
    };
    try {
      chatGPTMutation.mutate(packageForChatGPT);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ChatComponent
      products={recommendedProducts}
      disabled={inputMessage.trim() === "" || productsIsFetching > 0}
      handleSendMessage={handleSendMessage}
      inputMessage={inputMessage}
      isLoading={chatGPTMutation.isLoading}
      setInputMessage={setInputMessage}
      messages={messages}
      setMessages={setMessages}
    />
  );
}
