import { Link, Outlet } from "react-router-dom";
import { UserPicker } from "./UserPicker";

export const Layout = () => (
  <div className="max-w-screen-lg mx-auto p-4">
    <div className="flex items-center navbar bg-neutral shadow-md rounded-box text-white">
      <Link to="/" className="btn btn-ghost text-xl">
        Shoppík
      </Link>
      <div className="grow" />
      <div className="mr-4">
        <UserPicker />
      </div>
    </div>
    <div className="mt-4 mx-2">
      <Outlet />
    </div>
  </div>
);
