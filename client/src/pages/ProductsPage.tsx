import * as React from "react";
import { ProductTable } from "../components/table/ProductTable.js";

import { ClipLoader } from "react-spinners";

import { useAppState } from "../context/AppState.context.js";

export interface IProductsPageProps {}

export function ProductsPage(props: IProductsPageProps) {
  const [state] = useAppState();

  const { productsInStore } = state;

  function renderProductTable() {
    if (!Boolean(productsInStore)) {
      return (
        <div className={"my-8 flex justify-center align-middle"}>
          <ClipLoader
            color={"grey"}
            loading={!productsInStore}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      );
    }

    return <ProductTable />;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "128px",
        bottom: "0px",
        overflowY: "auto",
      }}
      className="products-container mx-auto flex max-w-[600px] flex-col justify-between overflow-y-auto px-4 pr-0"
    >
      {renderProductTable()}
    </div>
  );
}
