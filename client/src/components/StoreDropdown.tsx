import React, { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { calculateDistance } from "../utils/geolocation";
import { useAppState } from "../context/AppState.context";
import { fetchStores } from "../api/storeService";
import CustomSelect from "../blocks/CustomSelect";
//@ts-ignore
import Shop from "@iconscout/react-unicons/icons/uil-store";

function StoreDropdown() {
  const [state, dispatch] = useAppState();
  const [stores, setStores] = useState<any>([]);
  const [sortedStores, setSortedStores] = useState<any>([]);
  const [isFindingNearestStore, setIsFindingNearestStore] = useState(false);
  const [geoShared, setGeoShared] = useState(false);

  // Access state properties
  const { selectedStore } = state;

  const setSelectedStore = useCallback(
    (store: any) => dispatch({ type: "SET_SELECTED_STORE", payload: store }),
    [dispatch]
  );

  const fetchStoresCallback = useCallback(() => fetchStores(), []);

  const { isLoading: storesIsLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: fetchStoresCallback,
    onSuccess: async (data) => {
      setStores(data);
    },
  });

  useEffect(() => {
    if (sortedStores.length <= 0 && !storesIsLoading) {
      async function findNearestStore() {
        if (navigator.geolocation) {
          try {
            const position: any = await getPosition();

            setGeoShared(true); // Set geoShared to true
            const userLat = position?.coords?.latitude;
            const userLng = position?.coords?.longitude;

            let nearest = null;
            let minDistance = Infinity;

            const sortedStores = stores.map((store: any) => {
              const distance = calculateDistance(
                userLat,
                userLng,
                store?.lat,
                store?.lng
              );

              if (distance < minDistance) {
                minDistance = distance;
                nearest = store;
              }

              return {
                ...store,
                distance: distance,
              };
            });
            setSelectedStore(nearest);
            // Sort stores by distance
            setSortedStores(
              sortedStores.sort((a: any, b: any) => a.distance - b.distance)
            );
            setIsFindingNearestStore(false);
          } catch (e) {
            console.log(e);
            setIsFindingNearestStore(false);
          }
        } else {
          alert("Geolocation is not supported by this browser.");
          setIsFindingNearestStore(false);
        }
      }
      findNearestStore();
    }
  }, [stores, storesIsLoading, sortedStores, setSelectedStore]);

  const getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  async function handleSelectChange(optionvalue: string) {
    if (optionvalue === "find_nearest") {
      try {
        await getPosition();
      } catch (e) {
        alert("Du må dele lokasjon for å finne nærmeste butikk");
      }
    } else {
      const option = storeOptions.find(
        (option) => option.value === optionvalue
      );

      setSelectedStore(option.store);
    }
  }

  const storeOptions =
    sortedStores.length > 0
      ? [
          // { value: "find_nearest", label: "Finn nærmeste butikk" },
          ...sortedStores.map((store: any) => ({
            value: store.id,
            label:
              geoShared && store.distance
                ? `${store.name} (${Number(store.distance).toFixed(0)} km unna)`
                : store.name,
            store: store,
          })),
        ]
      : [
          { value: "find_nearest", label: "Finn nærmeste butikk" },
          ...stores.map((store: any) => ({
            value: store.id,
            label: store.name,
            store: store,
          })),
        ];

  return (
    <CustomSelect
      value={selectedStore?.id ?? ""}
      options={storeOptions}
      onChange={handleSelectChange}
      isSearchable
      placeholder="Velg butikk..."
      className="w-fit-content"
      isLoading={storesIsLoading || isFindingNearestStore}
      triggerElement={
        <div className="flex flex-col">
          <Shop
            className={`h-8 w-8 rounded-full ${
              selectedStore ? "bg-orange-400" : "bg-gray-400"
            } p-2 text-white`}
          />
        </div>
      }
    />
  );
}

export default StoreDropdown;
