import React, { useState, useEffect, useCallback } from "react";
import { ProductTable } from "../components/table/ProductTable.js";
import RecommendationFromUserInput from "../components/recommendation/RecommendationsFromUserInput";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { ClipLoader } from "react-spinners";
import MovableChatBubble from "../components/MovableChatBubble";
import {
  categorySynonyms,
  subCategorySynonyms,
} from "../utils/categorySynonyms.js";
import { useMainPage } from "../hooks/useMainpage.js";
import ViewButtons from "../components/ViewButtons.js";
import { useAppState } from "../context/AppStateContext.js";

export default function Mainpage() {
  const [view, setView] = useState("chat");
  const [state, dispatch] = useAppState();

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

  const { productsInStore, selectedProducts, categories, selectedCategory } =
    state;

  useEffect(() => {
    console.log("productsInStore", productsInStore);
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
            code: code.toLowerCase(),
            name: name.toLowerCase(),
            url: url.toLowerCase(),
            names: [name.toLowerCase(), ...synonyms],
          });
        }
      }

      if (product.mainSubCategory) {
        const { code, name, url } = product.mainSubCategory;
        const synonyms = subCategorySynonyms[code] || [];
        if (!subCategoryMap.has(code)) {
          subCategoryMap.set(code, {
            code: code.toLowerCase(),
            name: name.toLowerCase(),
            url: url.toLowerCase(),
            names: [name.toLowerCase(), ...synonyms],
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
    if (!Boolean(productsInStore)) {
      return (
        <ClipLoader
          color={"grey"}
          loading={!productsInStore}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      );
    }
    return <RecommendationFromUserInput />;
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

  console.log("view", view);

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className={"h-full bg-gray-600 p-4"}>
        <ViewButtons view={view} handleChangeView={handleChangeView} />
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
