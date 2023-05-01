import React, { createContext, useContext, useReducer } from "react";
import { Product } from "../types";

// Define the shape of your context state
interface AppState {
  selectedStore: any;
  categories: any[];
  selectedCategory: any;
  selectedProducts: any[];
  recommendedProduct: Product | null;
  inputMessage: string;
  messages: any[];
}

// Define the shape of your context actions
type AppStateActions =
  | { type: "SET_SELECTED_STORE"; payload: any }
  | { type: "SET_CATEGORIES"; payload: any[] }
  | { type: "SET_SELECTED_CATEGORY"; payload: any }
  | { type: "SET_SELECTED_PRODUCTS"; payload: any[] }
  | { type: "SET_RECOMMENDED_PRODUCT"; payload: Product | null }
  | { type: "SET_INPUT_MESSAGE"; payload: string }
  | { type: "SET_MESSAGES"; payload: any[] };

// Create your initial state
const initialState: AppState = {
  selectedStore: null,
  categories: [],
  selectedCategory: null,
  selectedProducts: [],
  recommendedProduct: null,
  inputMessage: "",
  messages: [
    {
      role: "assistant",
      content: `Hei kompis! Jeg er Drikkekompis🍻, din personlige guide og ekspert på både alkoholholdige og alkoholfrie drikkevarer! 

La oss starte en samtale og jeg vil dele min kunnskap og innsikt med deg for å hjelpe deg med å finne den perfekte drikken for enhver anledning.`,
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
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_SELECTED_PRODUCTS":
      return { ...state, selectedProducts: action.payload };
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
