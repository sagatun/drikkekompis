import { useAppState } from "../context/AppState.context";

export const useSelectedStore = () => {
  const { state, dispatch } = useAppState();
  return {
    selectedStore: state.selectedStore,
    setSelectedStore: (store: any) => {
      dispatch({ type: "SET_SELECTED_STORE", payload: store });
    },
  };
};
