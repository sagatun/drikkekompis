import React, { useCallback } from "react";
import { useAppState } from "../context/AppState.context";

function ViewButtons() {
  const [state, dispatch] = useAppState();

  const { productsInStore, view } = state;

  const setView = useCallback(
    (view: string) => {
      dispatch({ type: "SET_VIEW", payload: view });
    },
    [dispatch]
  );

  const productsDisabled = !productsInStore || productsInStore.length === 0;

  function handleChangeView(view: string) {
    if (view === "chat") {
      setView("products");
    } else {
      setView("chat");
    }
  }

  return (
    <div className="flex justify-start gap-2 align-middle">
      <button
        onClick={() => handleChangeView("products")}
        className={`rounded px-4 py-2 text-white ${
          view === "chat" ? "bg-orange-400" : "bg-gray-400"
        }`}
      >
        Chat
      </button>
      <button
        disabled={productsDisabled}
        onClick={() => handleChangeView("chat")}
        className={`rounded px-4 py-2 text-white ${
          view === "products" ? "bg-orange-400" : " bg-gray-400"
        } ${productsDisabled ? "pointer:not-allowed opacity-5" : ""}`}
      >
        Produkter
      </button>
    </div>
  );
}

export default ViewButtons;
