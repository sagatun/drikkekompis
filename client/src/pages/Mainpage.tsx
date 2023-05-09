import React, { useRef, useEffect } from "react";
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

  const headerContainerRef = useRef<HTMLDivElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      headerContainerRef.current &&
      buttonContainerRef.current &&
      chatContainerRef.current
    ) {
      const windowHeight = window.innerHeight;
      const headerContainerHeight = headerContainerRef.current.offsetHeight;
      const buttonContainerHeight = buttonContainerRef.current.offsetHeight;
      const chatContainerMaxHeight =
        windowHeight - headerContainerHeight - buttonContainerHeight;
      chatContainerRef.current.style.height = `${chatContainerMaxHeight - 8}px`;
      chatContainerRef.current.style.maxHeight = `${
        chatContainerMaxHeight - 8
      }px`;
    }
  }, [headerContainerRef, buttonContainerRef, chatContainerRef, view]);

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
    <div className="mx-auto flex min-h-[100vh] flex-col  bg-gray-600 ">
      <div className="header-container" ref={headerContainerRef}>
        <Header />
      </div>
      <div
        className="button-container mx-auto w-[600px] max-w-[600px]   px-4 py-8"
        ref={buttonContainerRef}
      >
        <ViewButtons />
        {/* <MovableChatBubble /> */}
      </div>
      {view === "chat" && (
        <div
          className="chat-container mx-auto  flex h-full max-w-[600px] flex-col justify-between px-4"
          ref={chatContainerRef}
        >
          {renderRecommendationFromUserInput()}
        </div>
      )}
      {view === "products" && (
        <div className="products-container mx-auto  flex h-full flex-col justify-between px-4">
          {renderProductTable()}
        </div>
      )}
      {/* <Footer /> */}
    </div>
  );
}
