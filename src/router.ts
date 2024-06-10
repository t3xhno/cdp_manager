import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import CdpPage from "@/pages/cdpSingle/CdpPage";
import CdpListPage from "@/pages/cdpList/CdpListPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/",
        Component: CdpListPage,
      },
      {
        path: "/cdp/:cdpId",
        Component: CdpPage,
      },
    ],
  },
]);

export default router;
