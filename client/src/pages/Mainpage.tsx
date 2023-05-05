import React, { useState, useEffect } from "react";
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

export default function Mainpage() {
  const [view, setView] = useState("chat");
  const {
    state,
    setCategories,
    setSubCategories,
    setSelectedCategory,
    setSelectedProducts,
  } = useMainPage();

  const { productsInStore, selectedProducts, categories, selectedCategory } =
    state;

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
