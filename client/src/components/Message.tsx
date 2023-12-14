import React, { useEffect } from "react";
import { getPersonalityImgUrl } from "../utils/helpers";
import { useAppState } from "../context/AppState.context";
import { type Product } from "../types";
import { SmoothCarousel } from "./SmoothCarousel";
import { getNamesFromResponse } from "../utils/recommendationsUtils";
import slugify from "slugify";
import Markdown from "react-markdown";

interface MessageProps {
  message: { content: string; role: string };
  index: number;
  products: any[];
}

export function Message({ message, index, products }: MessageProps) {
  const { state } = useAppState();
  const { personality } = state;
  const [productsInMessage, setProductsInMessage] = React.useState<Product[]>(
    []
  );

  useEffect(() => {
    if (message.role === "user") {
      return;
    }

    const productNames = products.map((product) => product.name);

    const matchedNames = getNamesFromResponse(message.content, productNames);

    // Forsikre deg om at sammenligningen tar høyde for formateringen gjort av getNamesFromResponse
    const productsInMessage = products.filter((product) =>
      matchedNames.includes(
        slugify(product.name, {
          lower: true,
          locale: "nb",
          remove: /[*+~.()'"!:@]/g,
        })
      )
    );

    setProductsInMessage(productsInMessage);
  }, [message, products]);

  const formattedContent = message.content
    .split("\n")
    .map((line: string, i: number) => (
      <React.Fragment key={i}>
        {<Markdown>{line.trim()}</Markdown>}
      </React.Fragment>
    ));

  productsInMessage.sort((a, b) => {
    if (a.mainCategory.code < b.mainCategory.code) {
      return -1;
    }
    if (a.mainCategory.code > b.mainCategory.code) {
      return 1;
    }
    return 0;
  });

  return (
    <React.Fragment key={index}>
      {}
      {productsInMessage.length > 0 && (
        <div className="flex items-start justify-start mt-12 mb-2">
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
            className="w-10 h-10 mr-2 rounded-full"
            src={getPersonalityImgUrl(personality)}
            alt="Drikkekompisen"
          />
        )}
        <div
          className={`h-fit max-w-[75%] px-4 py-2 rounded-xl ${
            message.role === "user"
              ? "bg-chat-blue text-white rounded-tr-none"
              : "bg-chat-gray text-black rounded-tl-none"
          }`}
        >
          {formattedContent}
        </div>
      </div>
    </React.Fragment>
  );
}
