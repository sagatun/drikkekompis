export interface Product {
  productId: any;
  abv: string | number;
  code: number;
  description: string;
  images: any[];
  name: string;
  price: string | number;
  mainCategory: {
    code: string;
    name: string;
    url: string;
  };
  mainSubCategory: {
    code: string;
    name: string;
    url: string;
  };
}

export interface Category {
  code: string;
  name: string;
  url: string;
  names?: string[];
}

export interface Store {
  id: number;
  name: string;
  lat: number;
  lng: number;
  distance?: number;
}

export interface StoreOption {
  value: number | string;
  label: string;
  store?: Store;
}

export interface StoreDropdownProps {
  selectedStore: Store | null;
  setSelectedStore: (store: Store) => void;
}

export interface ChatGPTResponse {
  recommendationText: string;
  conversationHistory: Array<{ message: string }>;
}

// Define the shape of your context state
export interface AppState {
  selectedStore: any;
  categories: any[];
  subCategories: any[];
  view: string;
  selectedCategory: any;
  selectedProducts: Product[];
  personality: string;
  productsInStore: Product[];
  recommendedProducts: Product[] | [];
  chatGPTModel: "gpt-3.5-turbo" | "gpt-4";
  messages: any[];
}

// Define the shape of your context actions
export type AppStateActions =
  | { type: "SET_SELECTED_STORE"; payload: any }
  | { type: "SET_CATEGORIES"; payload: any[] }
  | { type: "SET_SUB_CATEGORIES"; payload: any[] }
  | { type: "SET_SELECTED_CATEGORY"; payload: any }
  | { type: "SET_SELECTED_PRODUCTS"; payload: any[] }
  | { type: "SET_PRODUCTS_IN_STORE"; payload: Product[] }
  | { type: "SET_PERSONALITY"; payload: string }
  | { type: "SET_RECOMMENDED_PRODUCTS"; payload: Product[] | [] }
  | { type: "SET_CHAT_GPT_MODEL"; payload: "gpt-3.5-turbo" | "gpt-4" }
  | { type: "SET_MESSAGES"; payload: any[] }
  | { type: "SET_VIEW"; payload: string };
