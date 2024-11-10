import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ShoppingListPage } from "./pagess/ShoppingListPage/ShoppingListPage";
import { Layout } from "./components/Layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./contexts/UserContext";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: null,
      },
      {
        path: "/shopping-list/:id",
        element: <ShoppingListPage />,
      },
    ],
  },
]);

const queryclient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryclient}>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </QueryClientProvider>
);
