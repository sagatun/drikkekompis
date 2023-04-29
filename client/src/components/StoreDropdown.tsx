import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import { Store } from "../types";

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

  useEffect(() => {
    if (!stores.length) return;

    findNearestStore();
  }, [stores]);

  async function findNearestStore() {
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
  }

  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number) => {
    return (value * Math.PI) / 180;
  };

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
          className="max-w-xs mx-auto "
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
