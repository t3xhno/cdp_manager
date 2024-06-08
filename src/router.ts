import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import ViewCdp from "./views/cdpSingle";
import ViewCdpList from "./views/cdpList";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/",
        Component: ViewCdpList,
      },
      {
        path: "/cdp/:cdpId",
        Component: ViewCdp,
      },
    ],
  },
]);

export default router;
