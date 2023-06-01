import React, { useState } from "react";
import { Product } from "src/types";

//@ts-ignore
import CheckMark from "@iconscout/react-unicons/icons/uil-check";
import ProductModal from "../ProductModal";

interface Props {
  product: Product | undefined;
  isSelected?: boolean;
  toggleSelectHandler?: any;
  showSelect?: boolean;
}

export default function ProductCard({
  product,
  isSelected,
  toggleSelectHandler,
  showSelect = false,
}: Props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className="relative">
      <ProductModal
        product={product}
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      />
      {!!toggleSelectHandler && showSelect && (
        <div onClick={toggleSelectHandler ? toggleSelectHandler() : () => {}}>
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
      <div
        className={`flex h-full w-full cursor-pointer flex-col justify-between rounded-md border shadow-md transition duration-200 ease-in-out hover:shadow-lg ${
          isSelected ? "bg-white opacity-50" : "bg-white"
        }`}
        onClick={() => {
          setModalIsOpen(true);
        }}
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

          <span className="absolute right-2 top-2 rounded-md bg-gray-900 px-2 py-1 text-xs text-white">
            {product?.mainCategory.name}
          </span>
        </div>
        <div className="p-4">
          <h2 className="font-bold">{product?.name}</h2>
          <p className="mb-4 text-base text-gray-700">{product?.description}</p>
          <div className="flex justify-between text-xs text-gray-600">
            <span>{`${Boolean(product?.abv) ? product?.abv + "%" : ""}`}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">
              {Math.round(Number(product?.price))} kr
            </div>
    
          </div>
        </div>
      </div>
    </div>
  );
}
