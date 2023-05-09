import { AppState, AppStateActions } from "../types";

// Define your reducer function
export function appStateReducer(
  state: AppState,
  action: AppStateActions
): AppState {
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
    case "SET_RECOMMENDED_PRODUCTS":
      return { ...state, recommendedProducts: action.payload };
    case "SET_INPUT_MESSAGE":
      return { ...state, inputMessage: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_VIEW":
      return { ...state, view: action.payload };
    default:
      return state;
  }
}
