import { AVAILABLE_USERS, useUserContext } from "../../contexts/UserContext";
import { Dropdown } from "../Dropdown";
import { Menu, MenuItem } from "../Menu";

export const UserPicker = () => {
  const userContext = useUserContext();

  const menuItems: MenuItem[] = AVAILABLE_USERS.map((user) => {
    const handleClick = () => {
      userContext.changeUser(user.id);
    };
    return {
      id: user.id,
      element: <button onClick={handleClick}>{user.email}</button>,
      isActive: user.id === userContext.user?.fakeId,
    };
  });

  const currentUser = AVAILABLE_USERS.find(
    (user) => user.id === userContext.user?.fakeId,
  );
  const initials = currentUser?.email.slice(0, 2).toUpperCase() ?? "??";

  return (
    <Dropdown
      activator={
        <div className="btn btn-circle btn-sm btn-secondary flex justify-center items-center ">
          {initials}
        </div>
      }
    >
      <Menu items={menuItems} title="Change user to" />
    </Dropdown>
  );
};
