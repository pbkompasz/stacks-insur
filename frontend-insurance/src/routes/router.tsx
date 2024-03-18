import { createBrowserRouter } from "react-router-dom";

import Dashboard from "../components/dashboard/Dashboard.tsx";
import DashboardLayout from "../components/dashboard/DashboardLayout.tsx";
import Covers from "../components/dashboard/covers/Covers.tsx";
import Claims from "../components/dashboard/claims/Claims.tsx";
import Error from "../components/Error.tsx";
import LandingLayout from "../components/landing/LandingLayout.tsx";
import Landing from "../components/landing/Landing.tsx";
import HowItWorks from "../components/landing/HowItWorks.tsx";
import Products from "../components/landing/Products.tsx";

export const router = createBrowserRouter([
  {
    path: "",
    element: <LandingLayout />,
    children: [
      {
        path: "",
        element: <Landing />,
      },
      {
        path: "how-it-works",
        element: <HowItWorks />,
      },
      {
        path: "products",
        element: <Products />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "buy",
        element: <Covers />,
      },
      {
        path: "claim",
        element: <Claims />,
      },
    ],
  },
  {
    path: "*",
    element: <Error />,
  },
]);
