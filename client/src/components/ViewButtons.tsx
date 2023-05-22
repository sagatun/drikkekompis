import React, { useCallback } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { useAppState } from "../context/AppState.context";
import { ClipLoader } from "react-spinners";

function ViewButtons() {
  const [state, dispatch] = useAppState();
  const productsIsFetching = useIsFetching({
    queryKey: ["fetchProductsInStore"],
  });
  const { productsInStore, view, selectedStore } = state;

  const setView = useCallback(
    (view: string) => {
      dispatch({ type: "SET_VIEW", payload: view });
    },
    [dispatch]
  );

  const productsDisabled =
    !productsInStore || productsInStore.length === 0 || productsIsFetching > 0;

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
      {!!selectedStore && (
        <button
          disabled={productsDisabled}
          onClick={() => handleChangeView("chat")}
          className={`rounded px-4 py-2 text-white ${
            view === "products" ? "bg-orange-400" : " bg-gray-400"
          } ${productsDisabled ? "pointer:not-allowed  opacity-50" : ""}`}
        >
          <div className=" flex items-center justify-start">
            <span>Produkter</span>
            {productsDisabled && (
              <ClipLoader className="ml-4 mr-2" color="grey" size={20} />
            )}
          </div>
        </button>
      )}
    </div>
  );
}

export default ViewButtons;
