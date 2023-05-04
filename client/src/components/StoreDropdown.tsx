import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import { Store } from "../types";
import { calculateDistance } from "../utils/geolocation";

interface Props {
  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;
}

function StoreDropdown({ selectedStore, setSelectedStore }: Props) {
  const [stores, setStores] = useState<any>([]);
  const [geoShared, setGeoShared] = useState(false);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useQuery({ queryKey: ["stores"], onSuccess: (data) => setStores(data) });

  const getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const findNearestStore = useCallback(async () => {
    if (navigator.geolocation) {
      try {
        setIsLoading(true);
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
        setStores(
          sortedStores.sort((a: any, b: any) => a.distance - b.distance)
        );
      } catch (e) {
        console.log(e);
        setShowStoreDropdown(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, [setSelectedStore, stores]);

  useEffect(() => {
    if (!stores.length) return;

    findNearestStore();
  }, [findNearestStore, stores]);

  async function handleSelectChange(option: any) {
    if (option.value === "find_nearest") {
      try {
        await getPosition();
        findNearestStore();
      } catch (e) {
        alert("Du må dele lokasjon for å finne nærmeste butikk");
      } finally {
        setIsLoading(false);
      }
    } else {
      setSelectedStore(option.store);
    }
  }

  const storeOptions = [
    { value: "find_nearest", label: "Finn nærmeste butikk" },
    ...stores.map((store: any) => ({
      value: store.id,
      label:
        geoShared && store.distance
          ? `${store.name} (${Number(store.distance).toFixed(0)} km unna)`
          : store.name,
      store: store,
    })),
  ];

  return (
    <>
      {showStoreDropdown && (
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
      )}
      {isLoading && (
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
      )}
    </>
  );
}

export default StoreDropdown;
