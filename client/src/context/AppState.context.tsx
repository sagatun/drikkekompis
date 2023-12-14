import React, { createContext, useContext, useEffect, useReducer } from "react";
import { Product, type AppState, type AppStateActions } from "../types";
import { appStateReducer } from "./AppState.reducer";
import { getChatIntroduction } from "../utils/getChatIntroduction";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const server_url = import.meta.env.VITE_SERVER_URL;

interface Filters {
  priceRange: [number, number];
  categoryFilter: string;
  subCategoryFilter: string;
  globalFilter: string;
}

// Create your initial state
const initialState: AppState = {
  selectedStore: null,
  categories: [],
  subCategories: [],
  selectedCategory: null,
  productsInStore: [],
  filteredProductsInStore: [],
  personality: "",
  recommendedProducts: [],
  view: "chat",
  messages: [
    {
      role: "assistant",
      content: "",
    },
  ],
};

// Create the context
const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppStateActions>;
  filterProducts: (filters: Filters) => void;
}>({
  state: initialState,
  dispatch: () => {},
  filterProducts: () => {},
});

interface AppStateProviderProps {
  children: React.ReactNode;
}

// Create a provider component
export const AppStateProvider: React.FC<AppStateProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);
  const [hasSelectedStore, setHasSelectedStore] = React.useState(false);

  const { selectedStore, personality } = state;

  const localSelectedStore = localStorage.getItem("selectedStore");

  useEffect(() => {
    setHasSelectedStore(Boolean(localSelectedStore) || Boolean(selectedStore));
  }, [localSelectedStore, selectedStore]);

  const { data: productsInStore } = useQuery({
    queryKey: ["fetchProductsInStore", selectedStore?.id],
    enabled: Boolean(selectedStore),
    queryFn: async () => {
      const { data } = await axios.get(
        `${server_url}/get-all-products-in-store/${selectedStore?.id}`
      );

      return data;
    },
  });

  useEffect(() => {
    if (productsInStore) {
      dispatch({ type: "SET_PRODUCTS_IN_STORE", payload: productsInStore });
      dispatch({
        type: "SET_FILTERED_PRODUCTS_IN_STORE",
        payload: productsInStore,
      });
    }
  }, [productsInStore]);

  useEffect(() => {
    const loadPersonality = async () => {
      const storedPersonality: string =
        localStorage.getItem("personality") ?? "";
      if (storedPersonality) {
        dispatch({ type: "SET_PERSONALITY", payload: storedPersonality });
        dispatch({
          type: "SET_MESSAGES",
          payload: [
            {
              role: "assistant",
              content: getChatIntroduction(storedPersonality, hasSelectedStore),
            },
          ],
        });
      } else {
        const personality = "expert";
        localStorage.setItem("personality", personality);
        dispatch({ type: "SET_PERSONALITY", payload: personality });
        dispatch({
          type: "SET_MESSAGES",
          payload: [
            {
              role: "assistant",
              content: getChatIntroduction(personality, hasSelectedStore),
            },
          ],
        });
      }
    };
    loadPersonality();
  }, [personality, hasSelectedStore]);

  const filterProducts = (filters: Filters) => {
    const { priceRange, categoryFilter, subCategoryFilter, globalFilter } =
      filters;

    if (!productsInStore?.length) {
      return;
    }

    const filteredProducts = state.productsInStore.filter(
      (product: Product) => {
        const price = Number(product.price);
        const isPriceInRange = price >= priceRange[0] && price <= priceRange[1];

        // Sjekk om kategori er i categoryFilter array, eller om arrayet er tomt
        const isCategoryMatch =
          !categoryFilter.length ||
          categoryFilter.includes(product?.mainCategory?.name);

        // Sjekk om underkategori er i subCategoryFilter array, eller om arrayet er tomt
        const isSubCategoryMatch =
          !subCategoryFilter.length ||
          subCategoryFilter.includes(product?.mainSubCategory?.name);

        const isGlobalMatch =
          globalFilter === "" ||
          product.name.toLowerCase().includes(globalFilter.toLowerCase());

        return (
          isPriceInRange &&
          isCategoryMatch &&
          isSubCategoryMatch &&
          isGlobalMatch
        );
      }
    );

    dispatch({
      type: "SET_FILTERED_PRODUCTS_IN_STORE",
      payload: filteredProducts.length > 0 ? filteredProducts : productsInStore,
    });
  };

  return (
    <AppStateContext.Provider value={{ state, dispatch, filterProducts }}>
      {children}
    </AppStateContext.Provider>
  );
};

// Create a custom hook to use the AppStateContext
export const useAppState = () => {
  return useContext(AppStateContext);
};
