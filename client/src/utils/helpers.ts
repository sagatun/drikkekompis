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
  switch (personality) {
    case "expert":
      return "/personas/expert192.png";
    case "rapper":
      return "/personas/gangsta192.png";
    case "sarcastic":
      return "/personas/sarkastisk192.png";
    case "pirat":
      return "/personas/pirat192.png";
    case "poet":
      return "/personas/poet192.png";
    default:
      return "/personas/expert192.png";
  }
}
