import React, { createContext, useContext, useEffect, useReducer } from "react";
import { Product } from "../types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const server_url = import.meta.env.VITE_SERVER_URL;

// Define the shape of your context state
interface AppState {
  selectedStore: any;
  categories: any[];
  subCategories: any[];
  selectedCategory: any;
  selectedProducts: Product[];
  personality: string;
  productsInStore: Product[];
  recommendedProduct: Product | null;
  inputMessage: string;
  messages: any[];
}

// Define the shape of your context actions
type AppStateActions =
  | { type: "SET_SELECTED_STORE"; payload: any }
  | { type: "SET_CATEGORIES"; payload: any[] }
  | { type: "SET_SUB_CATEGORIES"; payload: any[] }
  | { type: "SET_SELECTED_CATEGORY"; payload: any }
  | { type: "SET_SELECTED_PRODUCTS"; payload: any[] }
  | { type: "SET_PRODUCTS_IN_STORE"; payload: Product[] }
  | { type: "SET_PERSONALITY"; payload: string }
  | { type: "SET_RECOMMENDED_PRODUCT"; payload: Product | null }
  | { type: "SET_INPUT_MESSAGE"; payload: string }
  | { type: "SET_MESSAGES"; payload: any[] };

function getChatIntroduction(personality: string) {
  switch (personality) {
    case "rapper":
      return `Yo, yo, yo! Jeg er DrikkeG-kompis🍻, din personlige gangsta guide og mester av både alkoholholdige og alkoholfrie drikker, yo!

      La oss kicke det i gang, og jeg vil droppe min kunnskap og innsikt, homie, for å hjelpe deg med å finne den illeste drikken for enhver anledning, du vet!
      `;
    case "expert":
      return `Hei kompis! Jeg er Drikkekompis🍻, din personlige guide og ekspert på både alkoholholdige og alkoholfrie drikkevarer! 

      La oss starte en samtale og jeg vil dele min kunnskap og innsikt med deg for å hjelpe deg med å finne den perfekte drikken for enhver anledning.
      `;
    case "sarcastic":
      return `Åh, hei da! Jeg er DrikkeIronikus🍻, din "personlige" guide og "ekspert" på både alkoholholdige og alkoholfrie drikkevarer! Fordi det er akkurat det du trenger, ikke sant?

      La oss "starte" en samtale, og jeg vil daaaele ut min "uvurderlige" kunnskap og innsikt for å hjelpe deg med å finne den "perfekte" drikken for enhver "uforglemmelig" anledning.`;
  }
}

// Create your initial state
const initialState: AppState = {
  selectedStore: null,
  categories: [],
  subCategories: [],
  selectedCategory: null,
  selectedProducts: [],
  productsInStore: [],
  personality: "",
  recommendedProduct: null,
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

// Define your reducer function
function appStateReducer(state: AppState, action: AppStateActions): AppState {
  switch (action.type) {
    case "SET_SELECTED_STORE":
      return { ...state, selectedStore: action.payload };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SET_SUB_CATEGORIES":
      return { ...state, subCategories: action.payload };
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_SELECTED_PRODUCTS":
      return { ...state, selectedProducts: action.payload };
    case "SET_PRODUCTS_IN_STORE":
      return { ...state, productsInStore: action.payload };
    case "SET_PERSONALITY":
      return { ...state, personality: action.payload };
    case "SET_RECOMMENDED_PRODUCT":
      return { ...state, recommendedProduct: action.payload };
    case "SET_INPUT_MESSAGE":
      return { ...state, inputMessage: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };

    default:
      return state;
  }
}

interface AppStateProviderProps {
  children: React.ReactNode;
}

// Create a provider component
export const AppStateProvider: React.FC<AppStateProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  const { personality, selectedStore } = state;

  const {
    data: productsInStore,
    isLoading: isFetchProductsInStoreLoading,
    isError: isFetchProductsInStoreError,
  } = useQuery({
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
              content: getChatIntroduction(storedPersonality),
            },
          ],
        });
      } else {
        const personalities = ["rapper", "expert", "sarcastic"];
        const randomPersonality =
          personalities[Math.floor(Math.random() * personalities.length)];
        localStorage.setItem("personality", randomPersonality);
        dispatch({ type: "SET_PERSONALITY", payload: randomPersonality });
        dispatch({
          type: "SET_MESSAGES",
          payload: [
            {
              role: "assistant",
              content: getChatIntroduction(randomPersonality),
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
