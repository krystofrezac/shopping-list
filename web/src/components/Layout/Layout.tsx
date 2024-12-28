import { Link, Outlet } from "react-router-dom";
import { UserPicker } from "./UserPicker";
import { useUserContext } from "../../contexts/UserContext";
import { Spinner } from "../Spinner";
import { IconButton } from "../IconButton";
import {
  changeTheme,
  getCurrerntTheme as getCurrentTheme,
  renderTheme,
} from "../../helpers/theme";

export const Layout = () => {
  const { user } = useUserContext();
  if (!user) return <Spinner />;
  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <div className="flex items-center navbar bg-neutral shadow-md rounded-box text-white">
        <Link to="/" className="btn btn-ghost text-xl">
          Shoppík
        </Link>
        <div className="grow" />
        <div className="mr-4 flex items-center gap-2">
          <IconButton
            iconName="MoonIcon"
            onClick={() => {
              const newTheme = getCurrentTheme() === "light" ? "dark" : "light";
              changeTheme(newTheme);
              renderTheme(newTheme);
            }}
          />
          <UserPicker />
        </div>
      </div>
      <div className="mt-4 mx-2">
        <Outlet />
      </div>
    </div>
  );
};
