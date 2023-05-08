import React, { useEffect } from "react";
import ProductCard from "./shared/ProductCard";
import { getPersonalityImgUrl } from "../utils/helpers";
import { useAppState } from "../context/AppStateContext";
import { Product } from "../types";
import StoreDropdown from "./StoreDropdown";

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
        <div className="m-2 ml-12 flex w-[10rem] justify-start">
          {productsInMessage.map((product) => (
            <ProductCard key={product.code} product={product} />
          ))}
        </div>
      )}
      <div
        className={`my-2 flex ${
          message.role === "user" ? "justify-end" : "justify-start"
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
          className={`rounded-lg px-4 py-2 ${
            message.role === "user"
              ? "bg-chat-blue text-white"
              : "bg-chat-gray text-black"
          }`}
        >
          {formattedContent}
          {message.role === "assistant" && !selectedStore && (
            <>
              {`Hvis jeg skal gi deg anbefalinger, må du velge en butikk først. 
              Du kan gjøre det ved å trykke på menyen under.
              `}
              <StoreDropdown />
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}