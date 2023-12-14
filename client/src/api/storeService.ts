import axios from "axios";

const server_url = import.meta.env.VITE_SERVER_URL;

export type Store = {
  store: Store | undefined;
  distance: any;
  id: string;
  name: string;
  lat: string;
  lng: string;
};

export const fetchStores = async () => {
  const data = await axios.get(`${server_url}/get-all-stores-with-products`);

  const storeList = data.data
    .map((store: any) => ({
      id: store.storeId,
      name: store.storeName,
      lat: store.address.gpsCoord.split(";")[0],
      lng: store.address.gpsCoord.split(";")[1],
    }))
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

  return storeList;
};
