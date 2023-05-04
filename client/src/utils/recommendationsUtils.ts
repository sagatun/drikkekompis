import { Product } from "src/types";

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

  return categoryCode;
}

export function randomizeAndCap<T>(list: T[], maxItems: number): T[] {
  const shuffledList = list.sort(() => Math.random() - 0.5);

  return shuffledList.slice(0, maxItems);
}

export function filterProductsByCategory(
  products: Product[],
  categoryCode: string,
  subCategories: any[]
) {
  if (!categoryCode) {
    return;
  }

  const isSubCategory = subCategories.some(
    (subCategory) => subCategory.code === categoryCode
  );

  const filteredProducts = products.filter((product) => {
    if (isSubCategory) {
      return product.mainSubCategory?.code === categoryCode;
    } else {
      return product.mainCategory.code === categoryCode;
    }
  });

  return filteredProducts;
}

export function extractJsonFromText(text: string) {
  const jsonPattern = /{[^}]+}/;
  const jsonObject = text.match(jsonPattern);
  return jsonObject ? JSON.parse(jsonObject[0]) : null;
}

export function getContentFromResponse(rawContent: string) {
  try {
    const parsedContent = JSON.parse(rawContent);
    return parsedContent.r ? parsedContent.r : rawContent;
  } catch (e) {
    const embeddedJson = extractJsonFromText(rawContent);
    return embeddedJson && embeddedJson.r ? embeddedJson.r : rawContent;
  }
}

export function convertProductList(
  products: Product[]
): { id: string; name: string }[] {
  return products.map((product) => ({
    id: String(product.productId),
    name: product.name,
  }));
}
