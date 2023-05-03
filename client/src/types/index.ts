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
