import * as React from "react";
import Header from "./components/header/Header";
import Navigation from "./components/Navigation.js";
import { useAppState } from "./context/AppState.context.js";
import useCategories from "./hooks/useCategories.js";
import { ChatPage } from "./pages/ChatPage";
import { ProductsPage } from "./pages/ProductsPage";
import {
  Outlet,
  RouterProvider,
  Router,
  Route,
  RootRoute,
} from "@tanstack/router";

// Create a root route
const rootRoute = new RootRoute({ component: Root });

function Root() {
  const [state] = useAppState();

  const { productsInStore } = state;

  // Init Map categories
  useCategories(productsInStore);
  return (
    <div className="mx-auto flex h-screen flex-col items-center  bg-gray-600 ">
      <div className="header-container h-16 w-full">
        <Header />
      </div>
      {/* <div className="button-container z-10 mx-auto flex h-16 w-full max-w-[600px] items-center justify-start px-4">
        <Navigation />
      </div> */}
      <Outlet />
    </div>
  );
}

const chatRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ChatPage,
});

const productsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ProductsPage,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([chatRoute, productsRoute]);

// Create the router using your route tree
const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/router" {
  interface Register {
    router: typeof router;
  }
}

// Wrap your entire application with RouterProvider
function App() {
  return <RouterProvider router={router} />;
}

export default App;
