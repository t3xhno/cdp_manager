import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import ViewCdp from "./views/cdp/ViewCdp";
import ViewCdpList from "./views/cdp/ViewCdpList";

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
