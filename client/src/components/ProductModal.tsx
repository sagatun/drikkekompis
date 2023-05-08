import React, { useState, useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ProductModal = ({ isOpen, onRequestClose, product }: any) => {
  const [showLargeImage, setShowLargeImage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  const {
    name,
    productType,
    abv,
    price,
    pricePerLiter,
    images,
    containerSize,
    containerType,
    vintage,
    color,
    aroma,
    taste,
    storable,
    foodPairing,
    eco,
    gluten,
    kosher,
    fairTrade,
    bioDynamic,
    mainProducer,
    distributor,
    wholesaler,
  } = product;

  const primaryImage = images.find((image: any) => image.type === "PRIMARY");

  if (!product) return <></>;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mx-auto mt-20 w-full max-w-2xl rounded-md border border-gray-300 bg-white px-4 py-6 shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-30"
    >
      <div className="flex max-h-[60vh] flex-col overflow-y-auto md:flex-row">
        <div className="flex w-full justify-center md:w-1/2">
          <img
            src={primaryImage.url}
            alt={name}
            className="w24 mb-6 w-24 cursor-pointer md:mb-0"
            onClick={() => setShowLargeImage(true)}
          />
          {showLargeImage && (
            <div
              className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
              onClick={() => setShowLargeImage(false)}
            >
              <img
                src={primaryImage.url}
                alt={name}
                className="max-h-full w-auto max-w-full"
              />
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 md:pl-6">
          <h2 className="mb-2 text-2xl font-bold">{name}</h2>
          <p className="mb-4 text-gray-600">{productType}</p>
          <p className="mb-2">
            <strong>ABV:</strong> {abv}%
          </p>
          <p className="mb-2">
            <strong>Price:</strong> {price} per unit
          </p>
          <p className="mb-2">
            <strong>Price per liter:</strong> {pricePerLiter}
          </p>
          <p className="mb-2">
            <strong>Container size:</strong> {containerSize} L
          </p>
          <p className="mb-2">
            <strong>Container type:</strong> {containerType}
          </p>
          {vintage && (
            <p className="mb-2">
              <strong>Vintage:</strong> {vintage}
            </p>
          )}
          <p className="mb-2">
            <strong>Color:</strong> {color}
          </p>
          <p className="mb-2">
            <strong>Aroma:</strong> {aroma}
          </p>
          <p className="mb-2">
            <strong>Taste:</strong> {taste}
          </p>
          <p className="mb-2">
            <strong>Storable:</strong> {storable}
          </p>
          <p className="mb-4">
            <strong>Food Pairing:</strong>
            {foodPairing &&
              foodPairing.map((item: any, index: any) => (
                <span key={item.code}>
                  {item.name}
                  {index < foodPairing.length - 1 ? ", " : ""}
                </span>
              ))}
          </p>
          <p className="mb-2">
            <strong>Eco:</strong> {eco ? "Yes" : "No"}
          </p>
          <p className="mb-2">
            <strong>Gluten-free:</strong> {gluten ? "Yes" : "No"}
          </p>
          <p className="mb-2">
            <strong>Kosher:</strong> {kosher ? "Yes" : "No"}
          </p>
          <p className="mb-2">
            <strong>Fair Trade:</strong> {fairTrade ? "Yes" : "No"}
          </p>
          <p className="mb-2">
            <strong>Biodynamic:</strong> {bioDynamic ? "Yes" : "No"}
          </p>
          <p className="mb-4">
            <strong>Producer:</strong>{" "}
            <a href={mainProducer.url} target="_blank" rel="noreferrer">
              {mainProducer.name}
            </a>
          </p>
          <p className="mb-2">
            <strong>Distributor:</strong> {distributor}
          </p>
          <p className="mb-4">
            <strong>Wholesaler:</strong> {wholesaler}
          </p>
          <button
            className="rounded bg-red-500 px-4 py-2 font-bold text-white"
            onClick={onRequestClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;
