import { createBrowserRouter } from "react-router-dom";

import App from "../components/App";
import Agent from "../components/Agent";
import Job from "../components/Job";
import Error from "../components/Error";

export const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
  },
  {
    path: "agent/:id",
    element: <Agent />,
  },
  {
    path: "job/:id",
    element: <Job />,
  },
  {
    path: "*",
    element: <Error />,
  },
]);
