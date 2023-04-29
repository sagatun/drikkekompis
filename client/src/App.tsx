import React, { useEffect, useState } from "react";
import Startpage from "./views/Startpage";
import Mainpage from "./views/Mainpage";

function App() {
  const [selectedStore, setSelectedStore] = useState(null);

  if (!selectedStore) {
    return (
      <div className={"dark:bg-gray-800 h-full"}>
        <Startpage
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
        />
      </div>
    );
  }

  return (
    <div className={"dark:bg-gray-800 h-auto"}>
      <Mainpage selectedStore={selectedStore} />
    </div>
  );
}

export default App;
