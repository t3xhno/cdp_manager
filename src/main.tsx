import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./main.scss";
import router from "./router.ts";
import { CacheProvider } from "./context/CacheContext.tsx";
import { GlobalContextProvider } from "./context/GlobalContext.tsx";

const { ethereum } = window;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {!ethereum ? (
      <h1>Please install MetaMask to use this application.</h1>
    ) : (
      <GlobalContextProvider>
        <CacheProvider>
          <RouterProvider router={router} />
        </CacheProvider>
      </GlobalContextProvider>
    )}
  </React.StrictMode>
);
