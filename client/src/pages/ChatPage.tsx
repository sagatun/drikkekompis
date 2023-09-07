import * as React from "react";
import RecommendationFromUserInput from "../components/recommendation/RecommendationsFromUserInput";
import { ClipLoader } from "react-spinners";

import { useAppState } from "../context/AppState.context.js";

export function ChatPage() {
  const [state] = useAppState();

  const { productsInStore } = state;

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

  return (
    <div
      style={{
        position: "absolute",
        top: "128px",
        bottom: "0px",
        overflowY: "auto",
      }}
      className="chat-container mx-auto flex w-full max-w-[600px] flex-col justify-end bg-gray-600 pl-4"
    >
      {renderRecommendationFromUserInput()}
    </div>
  );
}
