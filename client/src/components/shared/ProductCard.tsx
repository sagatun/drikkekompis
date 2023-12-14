import React, { useState } from "react";
import { type Product } from "src/types";
import { FaStar, FaHeart, FaPercent } from "react-icons/fa"; // Importere ikoner

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
    <div className="relative min-w-full">
      <ProductModal
        product={product}
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
        }}
      />
      {/* {!!toggleSelectHandler && showSelect && (
        <div onClick={toggleSelectHandler ? toggleSelectHandler() : () => {}}>
          {isSelected ? (
            <span className="absolute px-2 py-1 text-xs text-white bg-gray-900 rounded-md left-2 top-2">
              <CheckMark size="17" className="text-2xl" />
            </span>
          ) : (
            <span className="absolute px-2 py-1 text-xs text-white bg-gray-900 rounded-md left-2 top-2">
              <div className="p-2"></div>
            </span>
          )}
        </div>
      )} */}
      <div
        className={`flex  h-full    cursor-pointer flex-col justify-between rounded-md border shadow-md transition duration-200 ease-in-out hover:shadow-lg ${
          isSelected ? "bg-white opacity-50" : "bg-white"
        }`}
        onClick={() => {
          setModalIsOpen(true);
        }}
      >
        <div className="relative w-full">
          <img
            className="object-cover w-full pt-12 max-h-40 rounded-t-md"
            src={
              product?.images && product?.images.length > 0
                ? product?.images[2].url
                : ""
            }
            alt={product?.name}
            style={{ objectFit: "contain" }}
          />
          <div className="flex flex-col items-start justify-between m-auto text-white ">
            {product?.apertifRating && product?.apertifRating?.rating > 0 && (
              <div className="pl-2 ">
                <span className="flex items-center px-2 py-1 text-xs text-yellow-400 bg-white rounded-md left-2 bottom-2">
                  <span className="text-red-400"> Apéritif.no: </span>

                  <FaStar />
                  {product.apertifRating.rating}
                </span>
              </div>
            )}

            {product?.untappd && product?.untappd.rating > 0 && (
              <div className="pl-2 ">
                <span className="flex items-center px-2 py-1 text-xs text-yellow-400 bg-white rounded-md left-2 bottom-2">
                  <span className="text-green-400"> Untappd.com: </span>

                  <FaStar />
                  {product.untappd.rating}
                </span>
              </div>
            )}

            {product?.vivino && product?.vivino.averageRating > 0 && (
              <div className="pl-2 ">
                <span className="flex items-center px-2 py-1 text-xs text-yellow-400 bg-white rounded-md left-2 bottom-2">
                  <span className="text-blue-400"> Vivino.com: </span>

                  <FaStar />
                  {product.vivino.averageRating}
                </span>
              </div>
            )}
          </div>

          <span className="absolute px-2 py-1 text-xs text-white bg-gray-900 rounded-md right-2 top-2">
            {product?.mainCategory.name}
          </span>
        </div>

        <div className="p-4">
          <h2 className="pt-2 font-bold">{product?.name}</h2>
          <p className="mb-4 text-base text-gray-700">{product?.description}</p>
          <div className="w-full pb-4 text-xs italic font-extralight">
            <span>{` - ${
              Boolean(product?.apertifRating?.ratingComment)
                ? product?.apertifRating?.ratingComment
                : product?.taste
            }`}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>{`${product?.abv ? product?.abv + "%" : "0%"}`}</span>
            <span>{product?.containerSize} cl</span>
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
