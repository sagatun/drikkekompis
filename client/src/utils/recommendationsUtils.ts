import { Category, Product } from "src/types";
import slugify from "slugify";

export function findCategoryInInputText(
  inputText: string,
  categories: Category[],
  subCategories: Category[]
): string | undefined {
  console.log({ inputText, categories, subCategories });

  const cleanedInputText = slugify(inputText, { lower: true, strict: true });

  function findInText(text: string, searchWords: string[]) {
    const escapedSearchWords = searchWords
      .map((word) =>
        word.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/ /g, "\\s")
      )
      .join("|");
    const regex = new RegExp(`\\b(?:${escapedSearchWords})\\b`, "i");
    const match = text.match(regex);
    return match && match[0];
  }

  function findCategoryWithFilter(filterFn: (name: string) => boolean) {
    for (const category of categories.concat(subCategories)) {
      if (!category.names) continue;
      const filteredNames = category.names
        .filter(filterFn)
        .map((name) => slugify(name, { lower: true, strict: true }));
      const foundCategoryName = findInText(cleanedInputText, filteredNames);
      if (foundCategoryName) {
        return category.code;
      }
    }
    return undefined;
  }

  let categoryCode: string | undefined;

  // Look for two-word categories containing "vin"
  categoryCode = findCategoryWithFilter(
    (name) =>
      slugify(name, { lower: true, strict: true }).includes("vin") &&
      name.split(" ").length === 2
  );

  // If no two-word category containing "vin" is found, look for "vin" directly
  if (!categoryCode) {
    const vinResult = findInText(cleanedInputText, ["vin"]);
    if (vinResult) {
      const randomNumber = Math.random();
      return randomNumber < 0.5 ? "hvitvin" : "rødvin";
    }
  }

  // If no two-word category containing "vin" is found, look for other categories
  if (!categoryCode) {
    categoryCode = findCategoryWithFilter(() => true);
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

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getNamesFromResponse(rawContent: string, names: string[]) {
  console.log({ rawContent, names });

  // Slugify rawContent
  const slugifiedContent = slugify(rawContent, { lower: true, strict: true });

  // Slugify names, escape special characters, and create a regex pattern with word boundaries and case-insensitive flag
  const slugifiedNames = names.map((name) =>
    escapeRegExp(slugify(name, { lower: true, strict: true }))
  );
  const pattern = new RegExp(
    `(?<=^|\\s|[^\\w])(${slugifiedNames.join("|")})(?=$|\\s|[^\\w])`,
    "gi"
  );

  // Find all names in slugifiedContent using regex pattern
  const matchedNames = slugifiedContent.match(pattern);
  console.log({ matchedNames });
  if (matchedNames) {
    console.log("kom hit");
    // Create a Set to remove duplicates, then convert it back to an array
    const uniqueMatchedNames = Array.from(new Set(matchedNames));
    console.log({ uniqueMatchedNames });
    return uniqueMatchedNames;
  } else {
    console.log("kom hit.... :(");
    return [];
  }
}

export function convertProductList(products: Product[]) {
  return products.map((product) => product.name + "\n");
}
