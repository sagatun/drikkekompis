import React from "react";
import Startpage from "./pages/Startpage";
import Mainpage from "./pages/Mainpage";
import { useAppState } from "./context/AppStateContext";

function App() {
  const [state, dispatch] = useAppState();

  // Access state properties
  const { selectedStore } = state;

  const setSelectedStore = (store: any) =>
    dispatch({ type: "SET_SELECTED_STORE", payload: store });

  if (!selectedStore) {
    return (
      <div className={"h-full dark:bg-gray-800"}>
        <Startpage
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
        />
      </div>
    );
  }

  return (
    <div className={"h-full dark:bg-gray-800"}>
      <Mainpage />
    </div>
  );
}

export default App;
