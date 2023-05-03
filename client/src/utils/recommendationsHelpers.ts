export function findCategoryInInputText(
  inputText: string,
  categories: any[],
  subCategories: any[]
): string | undefined {
  const cleanedInputText = inputText.replace(/[!?,.:;\/|]/g, " ").toLowerCase();

  const findInText = (text: string, searchWords: string[]) => {
    const regex = new RegExp("\\b(?:" + searchWords.join("|") + ")\\b", "i");
    const match = text.match(regex);
    return match && match[0];
  };

  let categoryCode: string | undefined = undefined;
  for (const category of categories.concat(subCategories)) {
    const foundCategoryName = findInText(cleanedInputText, category.names);
    if (foundCategoryName) {
      categoryCode = category.code;
      break;
    }
  }

  if (categoryCode === "vin") {
    const randomNumber = Math.random();
    return randomNumber < 0.5 ? "hvitvin" : "rødvin";
  }

  console.log("categoryCode: ", categoryCode);

  return categoryCode;
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
