import React from "react";
import StoreDropdown from "../components/StoreDropdown";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const server_url = import.meta.env.VITE_SERVER_URL;

export default function Startpage({ selectedStore, setSelectedStore }: any) {
  const fetchStores = async () => {
    const data = await axios.get(`${server_url}/get-all-stores`);
    const storeList = data.data
      .map((store: any) => ({
        id: Number(store.storeId),
        name: store.storeName,
        lat: store.address.gpsCoord.split(";")[0],
        lng: store.address.gpsCoord.split(";")[1],
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));

    return storeList;
  };

  const { isLoading: isStoresLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: fetchStores,
  });

  return (
    <div
      id="startpage-container"
      className={
        "bg-gray-800 w-full h-full relative flex justify-start align-center flex-col bg-drikkekompisLogo  bg-center-center bg-no-repeat bg-75-percent bg-cover "
      }
      style={{
        backgroundPosition: "calc(50% + 5rem) calc(50% + 10rem)",
      }}
    >
      {/* <Header /> */}
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
            <h1 className="text-start text-white text-5xl p-4 tracking-wider my-16 font-bangers">
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
