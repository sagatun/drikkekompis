import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { calculateDistance } from "../utils/geolocation";
import { useAppState } from "../context/AppStateContext";
import { fetchStores } from "../api/storeService";

function StoreDropdown() {
  const [state, dispatch] = useAppState();
  const [stores, setStores] = useState<any>([]);
  const [sortedStores, setSortedStores] = useState<any>([]);

  const [geoShared, setGeoShared] = useState(false);

  // Access state properties
  const { selectedStore } = state;

  const setSelectedStore = useCallback(
    (store: any) => dispatch({ type: "SET_SELECTED_STORE", payload: store }),
    [dispatch]
  );

  const fetchStoresCallback = useCallback(() => fetchStores(), []);

  useQuery({
    queryKey: ["stores"],
    queryFn: fetchStoresCallback,
    onSuccess: (data) => setStores(data),
  });

  const getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  useEffect(() => {
    if (!stores.length) return;

    const findNearestStore = async () => {
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
        } catch (e) {
          console.log(e);
        }
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    findNearestStore();
  }, [setSelectedStore, selectedStore, stores]);

  async function handleSelectChange(option: any) {
    if (option.value === "find_nearest") {
      try {
        await getPosition();
      } catch (e) {
        alert("Du må dele lokasjon for å finne nærmeste butikk");
      }
    } else {
      setSelectedStore(option.store);
    }
  }

  const storeOptions = [
    { value: "find_nearest", label: "Finn nærmeste butikk" },
    ...sortedStores.map((store: any) => ({
      value: store.id,
      label:
        geoShared && store.distance
          ? `${store.name} (${Number(store.distance).toFixed(0)} km unna)`
          : store.name,
      store: store,
    })),
  ];

  return (
    <Select
      value={
        selectedStore && {
          value: selectedStore.id,
          label: selectedStore.name,
        }
      }
      options={storeOptions}
      onChange={handleSelectChange}
      isSearchable
      placeholder="Velg butikk..."
      className="mx-auto max-w-xs "
    />
  );
}

export default StoreDropdown;
