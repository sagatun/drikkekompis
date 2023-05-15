import React, { createContext, useContext, useEffect, useReducer } from "react";
import { AppState, AppStateActions } from "../types";
import { appStateReducer } from "./AppState.reducer";
import { getChatIntroduction } from "../utils/getChatIntroduction";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const server_url = import.meta.env.VITE_SERVER_URL;

// Create your initial state
const initialState: AppState = {
  selectedStore: null,
  categories: [],
  subCategories: [],
  selectedCategory: null,
  selectedProducts: [],
  productsInStore: [],
  personality: "",
  recommendedProducts: [],
  view: "chat",
  inputMessage: "",
  messages: [
    {
      role: "assistant",
      content: "",
    },
  ],
};

// Create the context
const AppStateContext = createContext<
  [AppState, React.Dispatch<AppStateActions>]
>([initialState, () => {}]);

interface AppStateProviderProps {
  children: React.ReactNode;
}

// Create a provider component
export const AppStateProvider: React.FC<AppStateProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  const { selectedStore, personality } = state;

  const localSelectedStore = localStorage.getItem("selectedStore");

  const hasSelectedStore =
    Boolean(localSelectedStore) || Boolean(selectedStore);

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
  }, [personality]);

  return (
    <AppStateContext.Provider value={[state, dispatch]}>
      {children}
    </AppStateContext.Provider>
  );
};

// Create a custom hook to use the AppStateContext
export const useAppState = () => {
  return useContext(AppStateContext);
};
