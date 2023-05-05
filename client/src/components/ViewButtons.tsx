import React from "react";
import { useAppState } from "../context/AppStateContext";

interface ViewButtonsProps {
  view: string;
  handleChangeView: (view: string) => void;
}

const ViewButtons: React.FC<ViewButtonsProps> = ({
  view,
  handleChangeView,
}) => {
  const [state] = useAppState();

  const { productsInStore } = state;

  const productsDisabled = !productsInStore || productsInStore.length === 0;

  return (
    <div className="flex justify-start gap-2 align-middle">
      <button
        onClick={() => handleChangeView("products")}
        className={`rounded px-4 py-2 text-white ${
          view === "chat" ? "bg-orange-500" : "bg-gray-400"
        }`}
      >
        Chat
      </button>
      <button
        disabled={productsDisabled}
        onClick={() => handleChangeView("chat")}
        className={`rounded px-4 py-2 text-white ${
          view === "products" ? "bg-orange-500" : " bg-gray-400"
        } ${productsDisabled ? "pointer:not-allowed opacity-5" : ""}`}
      >
        Produkter
      </button>
    </div>
  );
};

export default ViewButtons;
