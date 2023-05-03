import React, { useState, useEffect, useCallback } from "react";
import { ProductTable } from "../components/table/ProductTable.js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import RecommendationFromUserInput from "../components/recommendation/RecommendationsFromUserInput";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { ClipLoader } from "react-spinners";
import MovableChatBubble from "../components/MovableChatBubble";
import { useAppState } from "../context/AppStateContext.js";
import {
  categorySynonyms,
  subCategorySynonyms,
} from "../utils/categorySynonyms.js";

export default function Mainpage() {
  const [state, dispatch] = useAppState();
  const [view, setView] = useState("chat");

  // Access state properties
  const { categories, productsInStore, selectedCategory, selectedProducts } =
    state;

  // Dispatch actions

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

  const setSelectedCategory = useCallback(
    (category: any) => {
      dispatch({ type: "SET_SELECTED_CATEGORY", payload: category });
    },
    [dispatch]
  );

  const setSelectedProducts = useCallback(
    (products: any[]) => {
      dispatch({ type: "SET_SELECTED_PRODUCTS", payload: products });
    },
    [dispatch]
  );

  // Your component implementation

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
            code,
            name,
            url,
            names: [name, ...synonyms],
          });
        }
      }

      if (product.mainSubCategory) {
        const { code, name, url } = product.mainSubCategory;
        const synonyms = subCategorySynonyms[code] || [];
        if (!subCategoryMap.has(code)) {
          subCategoryMap.set(code, {
            code,
            name,
            url,
            names: [name, ...synonyms],
          });
        }
      }
    });

    const categories = Array.from(categoryMap.values());
    const subCategories = Array.from(subCategoryMap.values());
    setCategories(categories);
    setSubCategories(subCategories);
  }, [productsInStore, setCategories, setSubCategories]);

  function renderRecommendationFromUserInput() {
    // if (selectedStore && categories && productsInStore && selectedProducts) {
    return <RecommendationFromUserInput />;
    // }

    // return null;
  }

  function renderProductTable() {
    if (!Boolean(productsInStore)) {
      return (
        <div className={"my-8 flex justify-center align-middle"}>
          <ClipLoader
            color={"grey"}
            loading={!productsInStore}
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
    <div className="flex h-screen flex-col">
      <Header />
      <div className={"h-full bg-gray-600 p-4"}>
        <div className="flex justify-start gap-2 align-middle">
          <button
            onClick={() => handleChangeView("products")}
            className={`rounded px-4 py-2 text-white ${
              view === "chat"
                ? "bg-orange-500"
                : "cursor-not-allowed bg-gray-400"
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
        {/* <MovableChatBubble /> */}
        <div
          className="main-content flex h-full flex-col justify-between"
          style={{ height: "calc(100vh - 11.5rem)" }}
        >
          {/*TODO: Finne en måte å vise anbefaling fra brukerinput på*/}
          {view === "chat"
            ? renderRecommendationFromUserInput()
            : renderProductTable()}
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
