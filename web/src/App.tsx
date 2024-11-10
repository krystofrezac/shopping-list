import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ShoppingListPage } from './pagess/ShoppingListPage/ShoppingListPage'
import { Layout } from './components/Layout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: null
      },
      {
        path: "/shopping-list/:id",
        element: <ShoppingListPage />
      }

    ]
  }
])

const queryclient = new QueryClient()

export const App = () => (
  <QueryClientProvider client={queryclient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)

