import React from "react";
import StoreDropdown from "../components/StoreDropdown";
import { useQuery } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchStores } from "../api/storeService";

interface StartpageProps {
  selectedStore: any;
  setSelectedStore: (store: any) => void;
}

function Startpage({ selectedStore, setSelectedStore }: StartpageProps) {
  const { isLoading: isStoresLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: fetchStores,
  });

  return (
    <div
      id="startpage-container"
      className={
        "align-center bg-center-center bg-75-percent relative flex h-full w-full flex-col justify-start  bg-gray-800 bg-drikkekompisLogo bg-cover bg-no-repeat "
      }
      style={{
        backgroundPosition: "calc(50% + 5rem) calc(50% + 10rem)",
      }}
    >
      {isStoresLoading ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <ClipLoader
            color={"green"}
            loading={true}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className={""}>
          <div className={""}>
            <h1 className="my-16 p-4 text-start font-bangers text-5xl tracking-wider text-white">
              Drikkekompis 🍻
            </h1>
          </div>
          <StoreDropdown
            selectedStore={selectedStore}
            setSelectedStore={setSelectedStore}
          />
        </div>
      )}
    </div>
  );
}

export default Startpage;
