import { ReactNode } from "react";

export type DropdownProps = {
  activator: ReactNode;
  children: ReactNode;
};

export const Dropdown = ({ activator, children }: DropdownProps) => {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button">
        {activator}
      </div>
      <div className="dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow text-primary-content">
        {children}
      </div>
    </div>
  );
};
