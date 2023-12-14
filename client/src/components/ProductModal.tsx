import React, { useEffect } from "react";
import Modal from "react-modal";
import { FaWineBottle, FaUtensils, FaTimes } from "react-icons/fa";

Modal.setAppElement("#root");

const ProductModal = ({
  isOpen,
  onRequestClose,
  product,
  productsInMessage,
}: any) => {
  // useEffect(() => {
  //   const handleBodyScroll = isOpen ? "add" : "remove";
  //   document.body.classList[handleBodyScroll]("overflow-y-hidden");
  // }, [isOpen]);

  if (!product) return null;

  const {
    name,
    acid,
    apertifRating,
    untappd,
    productType,
    abv,
    price,
    pricePerLiter,
    images,
    containerSize,
    mainCountry,
    sugarContent,
    rawMaterial,
    vintage,
    color,
    aroma,
    taste,
    storable,
    foodPairing,
    vivino,
    url,
  } = product;

  const primaryImage = images.find(
    (image: { format: string }) => image.format === "product"
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-50"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
    >
      <div
        onClick={onRequestClose}
        className="flex items-center justify-center min-h-screen px-4"
      >
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg">
          <button
            onClick={onRequestClose}
            className="fixed p-2 mt-2 mr-2 bg-white rounded-full right-4 top-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <FaTimes className="w-5 h-5 text-gray-600" />
          </button>

          {/* Modal content */}
          <div className="flex flex-col overflow-hidden rounded-lg">
            <img
              src={primaryImage?.url}
              alt={name}
              className="object-contain w-full h-48 sm:h-64"
            />
            <div className="px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
              <p className="mt-1 text-sm font-medium text-gray-500">
                {productType}
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-indigo-600 hover:underline"
              >
                Se hos vinmonopolet
              </a>

              {/* Price and rating */}
              <p className="mt-4">
                <strong className="font-bold">Pris:</strong> kr {price}
                <span className="ml-2 text-sm text-gray-600">
                  ({pricePerLiter} kr/l)
                </span>
              </p>

              {/* Data rows with spacing */}
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">
                  {mainCountry.name}, {containerSize}cl,{" "}
                  {abv ? `Alk. ${abv}%` : ``}
                </p>

                {!!sugarContent && (
                  <p className="text-gray-600">
                    {`Sukker: ${sugarContent?.formattedValue}, Syre: ${acid} g/l`}
                  </p>
                )}
                {/* {!!acid && <p className="text-gray-600">Syre: {acid} g/l</p>} */}

                <div className="flex space-x-2">
                  <FaWineBottle className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700">
                    {rawMaterial
                      .map(
                        (grape: { name: any; percentage: any }) =>
                          `${grape.name} ${
                            grape?.percentage ? grape.percentage + "%" : ""
                          }`
                      )
                      .join(", ")}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <FaUtensils className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700">
                    {foodPairing
                      .map((food: { name: any }) => food.name)
                      .join(", ")}
                  </span>
                </div>

                {apertifRating && apertifRating.rating > 0 && (
                  <>
                    <div className="flex items-center mt-4 space-x-2">
                      <strong className="font-bold">Apéritif.no:</strong>
                      <a
                        href={apertifRating.ratingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 hover:underline"
                      >
                        <span className="text-yellow-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 1.837a1 1 0 00-2.098 0L5.48 6.625l-5.239.763a1 1 0 00-.554 1.705l3.792 3.696-.895 5.22a1 1 0 001.451 1.054L10 16.347l4.684 2.462a1 1 0 001.451-1.054l-.895-5.22 3.792-3.696a1 1 0 00-.554-1.705l-5.239-.763-2.471-4.788z" />
                          </svg>
                        </span>
                        <span className="text-xl text-indigo-600">
                          {apertifRating.rating}
                        </span>
                      </a>
                    </div>
                    <div className="italic text-gray-600 ">
                      {`- ${apertifRating.ratingComment}`}
                    </div>
                    <div className="mt-12 border-t border-gray-200"></div>
                  </>
                )}

                {untappd && untappd?.rating > 0 && (
                  <>
                    <div className="flex items-center mt-4 space-x-2">
                      <strong className="font-bold">Untappd.com:</strong>
                      <a
                        href={untappd.ratingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 hover:underline"
                      >
                        <span className="text-yellow-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 1.837a1 1 0 00-2.098 0L5.48 6.625l-5.239.763a1 1 0 00-.554 1.705l3.792 3.696-.895 5.22a1 1 0 001.451 1.054L10 16.347l4.684 2.462a1 1 0 001.451-1.054l-.895-5.22 3.792-3.696a1 1 0 00-.554-1.705l-5.239-.763-2.471-4.788z" />
                          </svg>
                        </span>
                        <span className="text-xl text-indigo-600">
                          {untappd.rating}
                        </span>
                      </a>
                    </div>
                    <div className="mt-8 border-t border-gray-200"></div>
                  </>
                )}
                {vivino && vivino?.averageRating > 0 && (
                  <>
                    <div className="flex items-center mt-4 space-x-2">
                      <strong className="font-bold">Vivino.com:</strong>
                      <a
                        href={vivino.vivinoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 hover:underline"
                      >
                        <span className="text-yellow-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 1.837a1 1 0 00-2.098 0L5.48 6.625l-5.239.763a1 1 0 00-.554 1.705l3.792 3.696-.895 5.22a1 1 0 001.451 1.054L10 16.347l4.684 2.462a1 1 0 001.451-1.054l-.895-5.22 3.792-3.696a1 1 0 00-.554-1.705l-5.239-.763-2.471-4.788z" />
                          </svg>
                        </span>
                        <span className="text-xl text-indigo-600">
                          {vivino.averageRating}
                        </span>
                      </a>
                    </div>
                    <div className="mt-8 border-t border-gray-200"></div>
                  </>
                )}
              </div>

              {/* Additional information */}
              <div className="pt-4 mt-0">
                {vintage && (
                  <p className="text-gray-600">
                    <strong className="font-bold">Årgang:</strong> {vintage}
                  </p>
                )}
                <p className="text-gray-600">
                  <strong className="font-bold">Farge:</strong> {color}
                </p>
                <p className="text-gray-600">
                  <strong className="font-bold">Aroma:</strong> {aroma}
                </p>
                <p className="text-gray-600">
                  <strong className="font-bold">Smak:</strong> {taste}
                </p>
                {storable ? (
                  <p className="text-gray-600">
                    <strong className="font-bold">Lagring:</strong> {storable}
                  </p>
                ) : (
                  ""
                )}
                <p className="text-gray-600">
                  <strong className="font-bold">Går til:</strong>{" "}
                  {foodPairing?.map(
                    (
                      item: {
                        code: React.Key | null | undefined;
                        name:
                          | string
                          | number
                          | boolean
                          | React.ReactElement<
                              any,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | null
                          | undefined;
                      },
                      index: number
                    ) => (
                      <span key={item.code}>
                        {item.name}
                        {index < foodPairing.length - 1 ? ", " : ""}
                      </span>
                    )
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;
