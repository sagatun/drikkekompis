import React from "react";
import { ProductTable } from "../components/table/ProductTable.js";
import RecommendationFromUserInput from "../components/recommendation/RecommendationsFromUserInput";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { ClipLoader } from "react-spinners";
import MovableChatBubble from "../components/MovableChatBubble";
import ViewButtons from "../components/ViewButtons.js";
import { useAppState } from "../context/AppState.context.js";
import useCategories from "../hooks/useCategories.js";

export default function Mainpage() {
  const [state] = useAppState();

  const { productsInStore, view } = state;

  // Map categories
  useCategories(productsInStore);

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

    return <ProductTable />;
  }

  return (
    <div className="mx-auto flex h-screen flex-col items-center  bg-gray-600 ">
      <div className="header-container h-16 w-full">
        <Header />
      </div>
      <div className="button-container mx-auto flex h-16 w-full max-w-[600px] items-center justify-start px-4">
        <ViewButtons />
        {/* <MovableChatBubble /> */}
      </div>
      {view === "chat" && (
        <div
          style={{
            position: "absolute",
            top: "128px",
            bottom: "0px",
            overflowY: "auto",
          }}
          className="chat-container mx-auto flex w-full max-w-[600px] flex-col justify-end bg-gray-600 px-4"
        >
          {renderRecommendationFromUserInput()}
        </div>
      )}
      {view === "products" && (
        <div className="products-container mx-auto flex max-w-[600px] flex-col justify-between px-4">
          {renderProductTable()}
        </div>
      )}
      {/* <Footer /> */}
    </div>
  );
}
