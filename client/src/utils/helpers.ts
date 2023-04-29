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
