import React from "react";
import Startpage from "./views/Startpage";
import Mainpage from "./views/Mainpage";
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
  // const [selectedStore, setSelectedStore] = useState(null);

  // if (!selectedStore) {
  //   return (
  //     <div className={"h-full dark:bg-gray-800"}>
  //       <Startpage
  //         selectedStore={selectedStore}
  //         setSelectedStore={setSelectedStore}
  //       />
  //     </div>
  //   );
  // }

  // return (
  //   <div className={"h-full dark:bg-gray-800"}>
  //     <Mainpage selectedStore={selectedStore} />
  //   </div>
  // );
}

export default App;
