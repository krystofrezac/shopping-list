import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ShoppingListPage } from './pagess/ShoppingListPage/ShoppingListPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: null
  },
  {
    path: "/shopping-list/:id",
    element: <ShoppingListPage />
  }
])

export const App = () => (
  <RouterProvider router={router} />
)

