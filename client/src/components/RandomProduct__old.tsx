import React, { useState } from "react";

function RandomProduct({
  selectedStore,
  allProductsInVinmonopletAPI,
  allProductsInSelectedStore,
}) {
  const [randomProduct, setRandomProduct] = useState(null);

  async function findRandomProductHandler() {
    if (!selectedStore || !allProductsInVinmonopletAPI) {
      return;
    }
    try {
      const allProductIds = Object.values(allProductsInSelectedStore)
        .map((products) => Object.keys(products))
        .flat();
      const randomProductId =
        allProductIds[Math.floor(Math.random() * allProductIds.length)];
      const randomProduct = allProductsInVinmonopletAPI.find(
        (product) => product.basic.productId === randomProductId
      );
      setRandomProduct(randomProduct);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <>
      {allProductsInVinmonopletAPI?.length > 0 && (
        <button
          disabled={!selectedStore}
          type="button"
          onClick={() => findRandomProductHandler()}
        >
          Hent random drikke
        </button>
      )}
      {randomProduct && (
        <div>
          <h2>{randomProduct?.basic?.productShortName}</h2>
          <img
            src={`https://bilder.vinmonopolet.no/cache/${"300"}x${"300"}-${"0"}/${
              randomProduct?.basic?.productId
            }-${"1"}.jpg`}
            alt={randomProduct.basic.productShortName}
          />
        </div>
      )}
    </>
  );
}

export default RandomProduct;
