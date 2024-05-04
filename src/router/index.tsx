import React from "react";
import {
  Outlet,
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { routes } from "./routes";
import Dashboard from "pages/dashboard";
import Guide from "pages/guide";
import ErrorPage from "containers/error-page";
import Navbar from "components/navbar";

function NavbarWrapper() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default function Router() {
  const router = createBrowserRouter([
    {
      path: routes.home,
      element: <NavbarWrapper />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: routes.home,
          element: <Dashboard />,
        },

        {
          path: routes.guide,
          element: <Guide />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to={routes.home} />,
    },
  ]);
  return <RouterProvider router={router} />;
}
