import React from "react";
import { useIsFetching } from "@tanstack/react-query";
import { useAppState } from "../context/AppState.context";
import { ClipLoader } from "react-spinners";
import { Link, useRouter } from "@tanstack/react-router";

function Navigation() {
  const { state } = useAppState();
  const productsIsFetching = useIsFetching({
    queryKey: ["fetchProductsInStore"],
  });
  const { productsInStore, selectedStore } = state;

  const params = useRouter();

  const view = params.state?.location?.pathname;

  const productsDisabled =
    !productsInStore || productsInStore.length === 0 || productsIsFetching > 0;

  const isProductsPage = view === "/products";

  return (
    <nav className="flex justify-start gap-2 align-middle">
      <Link
        from="/products"
        to="/"
        activeOptions={{ exact: true }}
        className={`rounded px-4 py-2 text-white ${
          view === "/" ? "bg-orange-400" : "bg-gray-400"
        }`}
      >
        Chat
      </Link>

      {!!selectedStore && (
        <Link to="/products" preload="intent">
          <button
            disabled={productsDisabled}
            className={`rounded px-4 py-2 text-white ${
              view === "/products" ? "bg-orange-400" : " bg-gray-400"
            } ${productsDisabled ? "pointer:not-allowed  opacity-50" : ""}`}
          >
            <div className="flex items-center justify-start ">
              <span>Produkter</span>
              {!isProductsPage && productsDisabled && (
                <ClipLoader className="ml-4 mr-2" color="grey" size={20} />
              )}
            </div>
          </button>
        </Link>
      )}
    </nav>
  );
}

export default Navigation;
