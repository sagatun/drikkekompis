import React, { useState, useEffect } from "react";
import { ProductTable } from "../components/table/ProductTable.js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import RecommendationFromUserInput from "../components/recommendation/RecommendationsFromUserInput";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { ClipLoader } from "react-spinners";
import MovableChatBubble from "../components/MovableChatBubble";
import { useAppState } from "../context/AppStateContext.js";

const server_url = import.meta.env.VITE_SERVER_URL;

export default function Mainpage() {
  const [state, dispatch] = useAppState();
  const [view, setView] = useState("chat");

  // Access state properties
  const { selectedStore, categories, selectedCategory, selectedProducts } =
    state;

  // Dispatch actions

  const setCategories = (categories: any[]) =>
    dispatch({ type: "SET_CATEGORIES", payload: categories });
  const setSelectedCategory = (category: any) =>
    dispatch({ type: "SET_SELECTED_CATEGORY", payload: category });
  const setSelectedProducts = (products: any[]) =>
    dispatch({ type: "SET_SELECTED_PRODUCTS", payload: products });

  // Your component implementation

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
    if (!Boolean(productsInStore)) {
      return;
    }
    const categoryMap = new Map();

    productsInStore.forEach((product: any) => {
      if (product.mainCategory) {
        const { code, name, url } = product.mainCategory;

        if (!categoryMap.has(code)) {
          categoryMap.set(code, { code, name, url });
        }
      }
    });

    const categories = Array.from(categoryMap.values());
    setCategories(categories);
  }, [productsInStore]);

  function renderRecommendationFromUserInput() {
    // if (selectedStore && categories && productsInStore && selectedProducts) {
    return (
      <RecommendationFromUserInput
        selectedStore={selectedStore}
        categories={categories}
        productsInStore={productsInStore}
        selectedProducts={selectedProducts}
        selectedCategory={selectedCategory}
      />
    );
    // }

    // return null;
  }

  function renderProductTable() {
    if (!Boolean(productsInStore) && isFetchProductsInStoreLoading) {
      return (
        <div className={"my-8 flex justify-center align-middle"}>
          <ClipLoader
            color={"grey"}
            loading={!productsInStore && isFetchProductsInStoreLoading}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      );
    }

    if (
      categories &&
      productsInStore &&
      selectedProducts &&
      setSelectedProducts
    ) {
      return (
        <ProductTable
          categories={categories}
          productsData={productsInStore}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      );
    }

    return null;
  }

  function handleChangeView(view: string) {
    if (view === "chat") {
      setView("products");
    } else {
      setView("chat");
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex justify-start gap-2 align-middle">
        <button
          onClick={() => handleChangeView("products")}
          className={`rounded px-4 py-2 text-white ${
            view === "chat" ? "bg-orange-500" : "cursor-not-allowed bg-gray-400"
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => handleChangeView("chat")}
          className={`rounded px-4 py-2 text-white ${
            view === "products"
              ? "bg-orange-500"
              : "cursor-not-allowed bg-gray-400"
          }`}
        >
          Produkter
        </button>
      </div>

      <MovableChatBubble />
      <div className="main-content flex flex-1 flex-col">
        {/*TODO: Finne en måte å vise anbefaling fra brukerinput på*/}
        {view === "chat"
          ? renderRecommendationFromUserInput()
          : renderProductTable()}
      </div>

      {/* <Footer /> */}
    </div>
  );
}
