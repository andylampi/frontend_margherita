import { createElement } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import ProtectedRoute from "./utilities/ProtectedRoute";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: createElement(Navigate, { to: "/login", replace: true }),
  },
  {
    path: "/login",
    element: createElement(Login),
  },
  {
    element: createElement(ProtectedRoute),
    children: [
      {
        path: "/chat",
        element: createElement(Chat),
      },
    ],
  },
];
