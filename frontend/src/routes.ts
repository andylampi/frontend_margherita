import { createElement } from "react";
import type { RouteObject } from "react-router-dom";
import Chat from "./pages/Chat";
import Documents from "./pages/Documents";
import Login from "./pages/Login";
import AuthRedirect from "./utilities/AuthRedirect";
import Layout from "./utilities/Layout";
import ProtectedRoute from "./utilities/ProtectedRoute";
import PublicRoute from "./utilities/PublicRoute";

export const routes: RouteObject[] = [
  {
    element: createElement(PublicRoute),
    children: [
      {
        path: "/login",
        element: createElement(Login),
      },
    ],
  },
  {
    element: createElement(ProtectedRoute),
    children: [
      {
        element: createElement(Layout),
        children: [
          {
            path: "/chat",
            element: createElement(Chat),
          },
          {
            path: "/documents",
            element: createElement(Documents),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: createElement(AuthRedirect),
  },
];
