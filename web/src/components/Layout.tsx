import { Outlet } from 'react-router-dom'

export const Layout = () => (
  <div className="max-w-screen-lg mx-auto p-4">
    <Outlet />
  </div>
)
