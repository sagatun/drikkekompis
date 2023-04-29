import React, { useState, useEffect } from "react";
import { ProductTable } from "../components/table/ProductTable.js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import RecommendationFromUserInput from "../components/recommendation/RecommendationsFromUserInput";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { ClipLoader } from "react-spinners";

const server_url = import.meta.env.VITE_SERVER_URL;

export default function Mainpage({ selectedStore }: any) {
  const [categories, setCategories] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<any>([]);

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
        <div className={"flex justify-center align-middle my-8"}>
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

  return (
    <>
      <Header />
      <div className="main-content p-4 pt-0">
        {/*TODO: Finne en måte å vise anbefaling fra brukerinput på*/}

        {renderRecommendationFromUserInput()}
        {renderProductTable()}
      </div>

      <Footer />
    </>
  );
}
