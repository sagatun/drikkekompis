import { Product } from "../types";

export function randomizeAndCap<T>(list: T[], maxItems: number): T[] {
  const shuffledList = list.sort(() => Math.random() - 0.5);

  return shuffledList.slice(0, maxItems);
}

export function convertProductList(
  products: Product[]
): { productId: number; productName: string }[] {
  return products.map((product) => ({
    productId: product.productId,
    productName: product.name,
  }));
}

export function getPersonalityImgUrl(personality: string) {
  if (personality === "expert") {
    return "/personas/expert192.png";
  } else if (personality === "rapper") {
    return "/personas/gangsta192.png";
  } else if (personality === "sarcastic") {
    return "/personas/sarkastisk192.png";
  } else if (personality === "17mai") {
    return "/personas/17mai192.png";
  } else {
    return "/personas/expert192.png";
  }
}
