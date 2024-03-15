import { createBrowserRouter } from "react-router-dom";

import App from "../App.tsx";
import Dashboard from "../components/Dashboard.tsx";
import Covers from "../components/Covers.tsx";
import Error from "../components/Error.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/how-it-works",
    element: <App />,
  },
  {
    path: "/products",
    element: <App />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "buy",
        element: <Covers />,
      },
    ],
  },
  // {
  //   path: "/dashboard",
  //   element: <Layout />,
  //   children: [
  //     {
  //       path: "",
  //       element: (
  //         <ProtectedRoute redirectTo="/">
  //           <Dashboard />
  //         </ProtectedRoute>
  //       ),
  //     },
  //   ],
  // },
  {
    path: "*",
    element: <Error />,
  },
]);
