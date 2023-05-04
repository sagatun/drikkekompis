import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClientProvider } from "./providers/QueryClientProvider";
import { ReactQueryDevtools } from "./providers/ReactQueryDevtools";
import { AppStateProvider } from "./context/AppStateContext";

ReactDOM.createRoot(document.getElementById("root") as Element).render(
  <React.StrictMode>
    <QueryClientProvider>
      <AppStateProvider>
        <App />
        <ReactQueryDevtools />
      </AppStateProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
