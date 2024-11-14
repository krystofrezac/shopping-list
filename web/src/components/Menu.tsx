import classNames from "classnames";
import { ReactNode } from "react";

export type MenuItem = {
  id: React.Key;
  element: ReactNode;
  active?: boolean;
};

export type MenuProps = {
  items: MenuItem[];
  title?: string;
};

export const Menu = ({ items, title }: MenuProps) => {
  const mappedItems = items.map((item) => (
    <li key={item.id}>
      <div className={classNames("flex", { active: item.active })}>
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
