import axios from "axios";

const server_url = import.meta.env.VITE_SERVER_URL;

export const fetchStores = async () => {
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
