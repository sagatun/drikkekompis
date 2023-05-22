import React, { useEffect } from "react";
import ProductCard from "./shared/ProductCard";
import { getPersonalityImgUrl } from "../utils/helpers";
import { useAppState } from "../context/AppState.context";
import { Product } from "../types";
import StoreDropdown from "./StoreDropdown";
import { SmoothCarousel } from "./SmoothCarousel";

interface MessageProps {
  message: { content: string; role: string };
  index: number;
  products: any[];
}

export function Message({ message, index, products }: MessageProps) {
  const [state] = useAppState();
  const { personality, selectedStore } = state;
  const [productsInMessage, setProductsInMessage] = React.useState<Product[]>(
    []
  );

  useEffect(() => {
    const productsInMessage = products.filter((product) =>
      message.content.includes(`${product.name}`)
    );
    setProductsInMessage(productsInMessage);
  }, [message, products]);

  const formattedContent = message.content
    .split("\n")
    .map((line: string, i: number) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));

  return (
    <React.Fragment key={index}>
      {productsInMessage.length > 0 && (
        <div className="mb-2 mt-12 flex items-start justify-start">
          <SmoothCarousel products={productsInMessage} />
        </div>
      )}
      <div
        className={`my-2 flex ${
          message.role === "user" ? "justify-end pr-4" : "justify-start"
        }`}
      >
        {message.role === "assistant" && (
          <img
            className="mr-2 h-10 w-10 rounded-full"
            src={getPersonalityImgUrl(personality)}
            alt="Drikkekompisen"
          />
        )}
        <div
          className={`h-fit max-w-[75%] rounded-lg px-4 py-2 ${
            message.role === "user"
              ? "bg-chat-blue text-white"
              : "bg-chat-gray text-black"
          }`}
        >
          {formattedContent}
        </div>
      </div>
    </React.Fragment>
  );
}
