import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ShoppingListPage } from "./pagess/ShoppingListPage/ShoppingListPage";
import { Layout } from "./components/Layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./contexts/UserContext";
import { InviteesPage } from "./pagess/InviteesPage/InviteesPage";
import { ShoppingListsPage } from "./pagess/ShoppingListsPage/ShoppingListsPage";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ShoppingListsPage />,
      },
      {
        path: "/shopping-lists/:id",
        element: <ShoppingListPage />,
      },
      {
        path: "/shopping-lists/:id/invitees",
        element: <InviteesPage />,
      },
    ],
  },
]);

const queryclient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // TODO: disable after api
      refetchOnMount: false,
    },
    mutations: {
      onError: () => alert("Something went wrong"),
    },
  },
});

export const App = () => (
  <QueryClientProvider client={queryclient}>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </QueryClientProvider>
);
