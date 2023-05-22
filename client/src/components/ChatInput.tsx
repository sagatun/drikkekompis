import * as React from "react";
import { SelectProductsModal } from "./SelectProductsModal";
import { Product } from "src/types";

export interface IChatInputProps {
  inputMessage: string;
  setInputMessage: (inputMessage: string) => void;
  handleSendMessage: () => void;
  disabled: boolean;
  selectedProducts: Product[];
}

export function ChatInput(props: IChatInputProps) {
  const {
    inputMessage,
    setInputMessage,
    handleSendMessage,
    disabled,
    selectedProducts,
  } = props;

  function getSelectProductsStyle() {
    return inputMessage.length > 0
      ? {
          opacity: 0,
          transition: "opacity 0.3s ease-in-out",
          pointerEvents: "none",
        }
      : {
          opacity: 1,
          transition: "opacity 0.3s ease-in-out",
          pointerEvents: "all",
        };
  }
  return (
    <div className="flex h-16 justify-between pb-4 pt-2">
      <div className="relative flex flex-grow">
        <SelectProductsModal
          style={getSelectProductsStyle()}
          value={selectedProducts.length}
        />
        <input
          autoFocus
          type="text"
          placeholder="Aa"
          className="flex flex-grow rounded-lg border-2 border-gray-300 p-2"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} //  disable to check if input gets better on mobile
          style={{
            transition: "margin 0.3s ease-in-out",
            marginLeft: inputMessage.length > 0 ? "-2rem" : "1rem",
          }}
        />
      </div>

      <button
        className={`ml-4 rounded-lg bg-chat-blue px-4 py-2 font-bold text-white ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={handleSendMessage}
        disabled={disabled}
      >
        Send
      </button>
    </div>
  );
}
