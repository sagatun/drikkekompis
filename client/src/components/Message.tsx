import React from "react";
import ProductCard from "./shared/ProductCard";
import { getPersonalityImgUrl } from "../utils/helpers";
import { useAppState } from "../context/AppStateContext";

interface MessageProps {
  message: { content: string; role: string };
  index: number;
  products: any[];
  recommendationIndexes: number[];
}

export function Message({
  message,
  index,
  products,
  recommendationIndexes,
}: MessageProps) {
  const [state] = useAppState();
  const { personality } = state;

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
      {recommendationIndexes.includes(Number(index) + 2) && (
        <div className="m-2 ml-12 flex w-[10rem] justify-start">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
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
        </div>
      </div>
    </React.Fragment>
  );
}
