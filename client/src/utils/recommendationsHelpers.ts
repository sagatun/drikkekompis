// import { Product, RecommendationFromUserInputProps } from "../types";
import { randomizeAndCap } from "./helpers";

export function findCategoryInInputText(
  inputText: string,
  categories: string[]
): string | undefined {
  const categoryLowerCase = categories.map((category: any) =>
    category.name.toLowerCase().trim()
  );

  categoryLowerCase.push("vin");

  const cleanedInputText = inputText.replace(/[!?,.:;\/|]/g, " ").toLowerCase();

  const inputTextWords = cleanedInputText.split(" ").filter((word) => word);

  const categoryFromUserInput = inputTextWords.find((word) => {
    const isWordInCategories = categoryLowerCase.includes(word);

    return isWordInCategories;
  });

  if (categoryFromUserInput === "vin") {
    const randomNumber = Math.random();
    return randomNumber < 0.5 ? "hvitvin" : "rødvin";
  }

  return categoryFromUserInput; //?.toLowerCase().replace(/\s+/g, "_");
}

export function createPackageForChatGPT(
  inputText: string,
  category: string,
  conversationHistory: Array<{ message: string }>,
  productName: string
) {
  return {
    inputText,
    category,
    conversationHistory,
    productName,
  };
}

// export function createPackageForChatGPT__OLD(
//   inputText: string,
//   category: string,
//   conversationHistory: Array<{ message: string }>,
//   productList?: { productId: number; productName: string }[]
// ) {
//   return {
//     inputText,
//     category,
//     productList:
//       productList && productList.length > 50
//         ? randomizeAndCap(productList, 50)
//         : productList,
//     conversationHistory,
//   };
// }

export function findRecommendedProduct(
  parsedResult: {
    id: number;
  },
  selectedProducts: any,
  allProductsInSelectedStore: any
): any {
  if (Object.keys(selectedProducts).length > 0) {
    return Object.values(selectedProducts).find(
      (product: any) => product.code == parsedResult.id
    );
  } else {
    return allProductsInSelectedStore.find(
      (product: any) => product.code == parsedResult.id
    );
  }
}
