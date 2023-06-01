import React, { useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ProductModal = ({ isOpen, onRequestClose, product }: any) => {
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
    url,
  } = product;

  const primaryImage = images.find((image: any) => image.format === "product");

  if (!product) return <></>;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 z-10 m-auto overflow-y-auto bg-gray-600"
      overlayClassName={"overflow-auto z-10 inset-0 fixed "}
    >
      <button
        className={
          "fixed right-4 top-4 z-10 w-8 rounded   py-2 font-bold text-white shadow-md transition duration-200 hover:bg-gray-500"
        }
        onClick={onRequestClose}
      >
        X
      </button>
      <div className="m-0 flex flex-col rounded-lg bg-gray-600  ">
        <div className="m-auto my-8 max-w-[22rem] rounded-full bg-white p-12 ">
          <img
            src={primaryImage.url}
            alt={name}
            className="m-auto h-64 w-64 cursor-pointer object-contain"
          />
        </div>
        <div className={"flex flex-col items-start gap-2 p-4 text-gray-200"}>
          <h2 className="mb-2 self-center text-4xl font-bold">{name}</h2>
          <p className="mb-6 text-gray-600">{productType}</p>
          <a
            className="cursor-pointer underline visited:text-gray-200 hover:text-gray-200"
            href={url}
            rel="noreferrer"
          >
            Lenke til vinmonopolets produktside
          </a>
          {abv ? (
            <p className="my-2 mt-6">
              <strong>Alkohol prosent:</strong> {abv}%
            </p>
          ) : (
            <p className="my-2 mt-6">Alkoholfri</p>
          )}
          <p className="mb-2">
            <strong>Pris:</strong> {price} per unit
          </p>
          <p className="mb-2">
            <strong>Pris per liter:</strong> {pricePerLiter}
          </p>
          <p className="mb-2">
            <strong>Størrelse:</strong> {containerSize} L
          </p>
          <p className="mb-2">
            <strong>Embalasje:</strong> {containerType}
          </p>
          {vintage && (
            <p className="mb-2">
              <strong>Årgang:</strong> {vintage}
            </p>
          )}
          <p className="mb-2">
            <strong>Farge:</strong> {color}
          </p>
          <p className="mb-2">
            <strong>Aroma:</strong> {aroma}
          </p>
          <p className="mb-2">
            <strong>Smak:</strong> {taste}
          </p>
          <p className="mb-2">
            <strong>Lagring:</strong> {storable}
          </p>
          <p className="mb-4">
            <strong>Går til: </strong>
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
            <strong>Glutenfri:</strong> {gluten ? "Yes" : "No"}
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
            <strong>Produsent:</strong>{" "}
            <a href={mainProducer.url} target="_blank" rel="noreferrer">
              {mainProducer.name}
            </a>
          </p>
          <p className="mb-2">
            <strong>Distributør:</strong> {distributor}
          </p>
          <p className="mb-4">
            <strong>Wholesaler:</strong> {wholesaler}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;
