// ViewButtons.tsx
import React from "react";

interface ViewButtonsProps {
  view: string;
  handleChangeView: (view: string) => void;
}

const ViewButtons: React.FC<ViewButtonsProps> = ({
  view,
  handleChangeView,
}) => {
  return (
    <div className="flex justify-start gap-2 align-middle">
      <button
        onClick={() => handleChangeView("products")}
        className={`rounded px-4 py-2 text-white ${
          view === "chat" ? "bg-orange-500" : "cursor-not-allowed bg-gray-400"
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
  );
};

export default ViewButtons;
