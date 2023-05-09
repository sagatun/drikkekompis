import { useCallback, useEffect } from "react";
import { Product } from "../types";
import {
  categorySynonyms,
  subCategorySynonyms,
} from "../utils/categorySynonyms.js";
import { useAppState } from "../context/AppState.context";

interface Category {
  code: string;
  name: string;
  url: string;
  names: string[];
}

// Define your custom hook
function useCategories(productsInStore: Product[]) {
  const [, dispatch] = useAppState();

  const setCategories = useCallback(
    (categories: any[]) => {
      dispatch({ type: "SET_CATEGORIES", payload: categories });
    },
    [dispatch]
  );

  const setSubCategories = useCallback(
    (subCategories: any[]) => {
      dispatch({ type: "SET_SUB_CATEGORIES", payload: subCategories });
    },
    [dispatch]
  );

  useEffect(() => {
    if (!Boolean(productsInStore)) {
      return;
    }
    const categoryMap = new Map();
    const subCategoryMap = new Map();

    productsInStore.forEach((product: any) => {
      if (product.mainCategory) {
        const { code, name, url } = product.mainCategory;

        if (!categoryMap.has(code)) {
          const synonyms = categorySynonyms[code] || [];
          categoryMap.set(code, {
            code: code,
            name: name,
            url: url,
            names: [name, ...synonyms],
          });
        }
      }

      if (product.mainSubCategory) {
        const { code, name, url } = product.mainSubCategory;
        const synonyms = subCategorySynonyms[code] || [];
        if (!subCategoryMap.has(code)) {
          subCategoryMap.set(code, {
            code: code,
            name: name,
            url: url,
            names: [name, ...synonyms],
          });
        }
      }
    });

    const categories = Array.from(categoryMap.values());
    const subCategories = Array.from(subCategoryMap.values());

    setCategories(categories);
    setSubCategories(subCategories);
  }, [
    productsInStore,
    categorySynonyms,
    subCategorySynonyms,
    setCategories,
    setSubCategories,
  ]);
}

export default useCategories;
