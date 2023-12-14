import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { calculateDistance } from "../utils/geolocation";
import { useAppState } from "../context/AppState.context";
import { fetchStores, Store } from "../api/storeService";
import CustomSelect from "../blocks/CustomSelect";

interface CustomSelectOption {
  value: string;
  label: string;
  store?: Store;
}

function StoreDropdown() {
  const { state, dispatch } = useAppState();
  const [sortedStores, setSortedStores] = useState<Store[]>([]);
  const [isFindingNearestStore, setIsFindingNearestStore] = useState(false);

  // Access state properties
  const { selectedStore } = state;

  const {
    isLoading: storesIsLoading,
    error: storesError,
    data: stores,
  } = useQuery<Store[], Error>({
    queryKey: ["stores"],
    queryFn: fetchStores,
    enabled: true,
  });

  useEffect(() => {
    if (stores && stores.length > 0) {
      if (!selectedStore && navigator.permissions) {
        // Prøv å hente selectedStore fra localStorage
        const storedSelectedStore = localStorage.getItem("selectedStore");
        if (storedSelectedStore) {
          dispatch({
            type: "SET_SELECTED_STORE",
            payload: JSON.parse(storedSelectedStore),
          });

          const parsedSelectedStore = JSON.parse(storedSelectedStore);
          findNearestStore(parsedSelectedStore);
        } else {
          navigator.permissions
            .query({ name: "geolocation" })
            .then((result) => {
              if (result.state === "granted") {
                findNearestStore();
              } else {
                // Hvis geolocation ikke er tillatt, sett sortedStores til stores uten å beregne avstanden
                setSortedStores(stores);
              }
            });
        }
      } else if (!selectedStore) {
        // Hvis selectedStore ikke er satt, sett sortedStores til stores uten å beregne avstanden
        setSortedStores(stores);
      }
    }
  }, [stores, selectedStore]);

  const getPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  async function findNearestStore(storeFromLocalStorage?: Store) {
    setIsFindingNearestStore(true);
    try {
      const position = await getPosition();
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      let nearest: Store | null = null;
      let minDistance = Infinity;

      if (!stores) {
        return;
      }

      if (storeFromLocalStorage) {
        nearest = storeFromLocalStorage;
        minDistance = calculateDistance(
          userLat,
          userLng,
          Number(storeFromLocalStorage.lat),
          Number(storeFromLocalStorage.lng)
        );
      }

      const updatedStores = stores.map((store: Store) => {
        const distance = calculateDistance(
          userLat,
          userLng,
          Number(store.lat),
          Number(store.lng)
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearest = store;
        }

        return { ...store, distance };
      });

      if (nearest) {
        dispatch({ type: "SET_SELECTED_STORE", payload: nearest });
        localStorage.setItem("selectedStore", JSON.stringify(nearest));
      }
      setSortedStores(updatedStores.sort((a, b) => a.distance - b.distance));
    } catch (error) {
      console.error(error);
    } finally {
      setIsFindingNearestStore(false);
    }
  }

  function handleSelectChange(optionValue: string) {
    if (optionValue === "find_nearest") {
      findNearestStore();
    } else {
      const selectedStore = stores?.find((store) => store.id === optionValue);
      if (selectedStore) {
        dispatch({ type: "SET_SELECTED_STORE", payload: selectedStore });
        localStorage.setItem("selectedStore", JSON.stringify(selectedStore));
      } else {
        console.warn(`Store with id ${optionValue} not found`);
      }
    }
  }

  const storeOptions: CustomSelectOption[] = sortedStores.map((store) => ({
    value: store.id,
    label: store.distance
      ? `${store.name} (${store.distance.toFixed(0)} km unna)`
      : store.name,
    store,
  }));

  if (storeOptions.length === 0) {
    // Hvis ingen butikker er tilgjengelige, legg til et standardvalg
    storeOptions.push({ value: "none", label: "Velg butikk" });
  } else {
    // Legg til et alternativ for å finne nærmeste butikk
    storeOptions.unshift({
      value: "find_nearest",
      label: "Finn nærmeste butikk",
    });
  }

  return (
    <CustomSelect
      value={selectedStore?.id ?? ""}
      options={storeOptions}
      onChange={handleSelectChange}
      isSearchable
      placeholder="Søk..."
      className="w-fit-content"
      isLoading={storesIsLoading || isFindingNearestStore}
      triggerElement={
        <div className="flex flex-col">
          <button
            className={`flex h-8 items-center justify-center rounded-full text-xs ${
              selectedStore ? "bg-orange-400" : "bg-gray-400"
            } p-2 text-white`}
          >
            {selectedStore
              ? selectedStore.name.split(",").length > 1
                ? selectedStore.name.split(",").slice(1).join(" ")
                : selectedStore.name
              : "Velg butikk"}
          </button>
        </div>
      }
    />
  );
}

export default StoreDropdown;
