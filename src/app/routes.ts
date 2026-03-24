import { createBrowserRouter } from "react-router";
import SituationRoom from "./pages/SituationRoom";
import Customize from "./pages/Customize";
import UnitManagement from "./pages/UnitManagement";
import OperationLogs from "./pages/OperationLogs";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";

export const router = createBrowserRouter([
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
]);