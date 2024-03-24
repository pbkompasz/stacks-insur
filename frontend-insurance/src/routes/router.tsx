import { createBrowserRouter } from "react-router-dom";

import Dashboard from "../components/dashboard/Dashboard.tsx";
import DashboardLayout from "../components/dashboard/DashboardLayout.tsx";
import Covers from "../components/dashboard/covers/Covers.tsx";
import Cover from "../components/dashboard/covers/Cover.tsx";
import Claims from "../components/dashboard/claims/Claims.tsx";
import Error from "../components/Error.tsx";
import LandingLayout from "../components/landing/LandingLayout.tsx";
import Landing from "../components/landing/Landing.tsx";
import HowItWorks from "../components/landing/HowItWorks.tsx";
import Products from "../components/landing/Products.tsx";
import Exchange from "../components/dashboard/Exchange.tsx";
import Checkout from "../components/dashboard/Checkout.tsx";

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
        path: "exchange",
        element: <Exchange />,
      },
      {
        path: "buy",
        element: <Covers />,
      },
      {
        path: "cover/:name",
        element: <Cover />,
      },
      {
        path: "claim",
        element: <Claims />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
    ],
  },
  {
    path: "*",
    element: <Error />,
  },
]);
