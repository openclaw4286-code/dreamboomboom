import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import SituationRoom from "./pages/SituationRoom";
import Customize from "./pages/Customize";
import UnitManagement from "./pages/UnitManagement";
import OperationLogs from "./pages/OperationLogs";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";

export const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        path: "/",
        Component: SituationRoom,
      },
      {
        path: "/customize",
        Component: Customize,
      },
      {
        path: "/unit",
        Component: UnitManagement,
      },
      {
        path: "/logs",
        Component: OperationLogs,
      },
      {
        path: "/stats",
        Component: Statistics,
      },
      {
        path: "/settings",
        Component: Settings,
      },
      {
        path: "/admin",
        Component: Admin,
      },
    ],
  },
]);
