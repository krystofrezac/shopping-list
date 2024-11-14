import classNames from "classnames";
import { ReactNode } from "react";

export type MenuItem = {
  id: React.Key;
  element: ReactNode;
  isHidden?: boolean;
  isActive?: boolean;
};

export type MenuProps = {
  items: MenuItem[];
  title?: string;
};

export const Menu = ({ items, title }: MenuProps) => {
  const mappedItems = items
    .filter((item) => !item.isHidden)
    .map((item) => (
      <li key={item.id}>
        <div className={classNames("flex", { active: item.isActive })}>
          {item.element}
        </div>
      </li>
    ));
  return (
    <ul className="menu">
      {title && <li className="menu-title">{title}</li>}
      {mappedItems}
    </ul>
  );
};
