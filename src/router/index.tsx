import React from "react";
import {
  Outlet,
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Navbar from "components/navbar";
import Dashboard from "pages/dashboard";
import ErrorPage from "pages/error";
import Guide from "pages/guide";
import { routes } from "./routes";

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
