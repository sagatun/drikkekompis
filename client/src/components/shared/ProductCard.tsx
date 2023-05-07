import React, { useEffect } from "react";
import { Product } from "src/types";
import ChatModal from "../ChatModal";
import { createSystemPromptForProductConversation } from "../../utils/chatGPT-prompts";

// @ts-ignore
import CommentAlt from "@iconscout/react-unicons/icons/uil-comment-alt";
//@ts-ignore
import CheckMark from "@iconscout/react-unicons/icons/uil-check";

interface Props {
  product: Product | undefined;
  isSelected?: boolean;
  toggleSelectHandler?: any;
}

export default function ProductCard({
  product,
  isSelected,
  toggleSelectHandler,
}: Props) {
  const [systemPrompt, setSystemPrompt] = React.useState<any>(null);
  const [showChatModal, setShowChatModal] = React.useState(false);

  useEffect(() => {
    async function createSystemPrompt() {
      if (product) {
        const systemPrompt = createSystemPromptForProductConversation(product);
        setSystemPrompt(systemPrompt);
      }
    }
    createSystemPrompt();
  }, [product]);

  function openModal() {
    document.body.classList.add("modal-open");
    setShowChatModal(true);
  }

  function closeModal() {
    document.body.classList.remove("modal-open");
    setShowChatModal(false);
  }

  return (
    <>
      {Boolean(systemPrompt) && (
        <ChatModal
          isOpen={showChatModal}
          onRequestClose={closeModal}
          systemPrompt={systemPrompt}
          product={product}
        />
      )}
      <div
        className={`flex w-full cursor-pointer flex-col justify-between rounded-md border shadow-md transition duration-200 ease-in-out hover:shadow-lg ${
          isSelected ? "bg-white opacity-50" : "bg-white"
        }`}
      >
        <div className="relative">
          <img
            className="max-h-40 w-full rounded-t-md object-cover pt-12"
            src={
              product && product.images && product?.images.length > 0
                ? product?.images[2].url
                : ""
            }
            alt={product?.name}
            style={{ objectFit: "contain" }}
          />
          {!!toggleSelectHandler && (
            <div
              onClick={toggleSelectHandler ? toggleSelectHandler() : () => {}}
            >
              {isSelected ? (
                <span className="absolute left-2 top-2 rounded-md bg-gray-900 px-2 py-1 text-xs text-white">
                  <CheckMark size="17" className="text-2xl" />
                </span>
              ) : (
                <span className="absolute left-2 top-2 rounded-md bg-gray-900 px-2 py-1 text-xs text-white">
                  <div className="p-2"></div>
                </span>
              )}
            </div>
          )}

          <span className="absolute right-2 top-2 rounded-md bg-gray-900 px-2 py-1 text-xs text-white">
            {product?.mainCategory.name}
          </span>
        </div>
        <div className="p-4">
          <h2 className="font-bold">{product?.name}</h2>
          <p className="mb-4 text-base text-gray-700">{product?.description}</p>
          <span className="text-sm text-gray-500">{`${
            Boolean(product?.abv) ? product?.abv + "%" : ""
          }`}</span>
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">{product?.price} kr</div>

            {!!toggleSelectHandler && (
              <button
                onClick={openModal}
                className="flex gap-2 rounded-md bg-gray-900 px-2 py-2 text-white transition duration-200 ease-in-out hover:bg-gray-800"
              >
                <CommentAlt size="16" className="text-2xl" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
