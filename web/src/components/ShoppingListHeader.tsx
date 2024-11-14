import { ReactNode } from "react";
import { H1 } from "./Typography";
import { ShoppingList } from "../api/types";
import { Link } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export type ShoppingListHeaderProps = {
  shoppingList: ShoppingList;
  rightElement: ReactNode;
  backText: string;
  backPath: string;
  namePrefix?: string;
};

export const ShoppingListHeader = ({
  shoppingList,
  rightElement,
  backText,
  backPath,
  namePrefix,
}: ShoppingListHeaderProps) => {
  return (
    <div>
      <div className="flex">
        <Link to={backPath} className="flex items-center hover:underline">
          <div className="size-5">
            <ChevronLeftIcon />
          </div>
          {backText}
        </Link>
      </div>
      <div className="flex gap-4 items-center mt-4">
        <div className="grow">
          <H1>{(namePrefix ?? "") + shoppingList.name}</H1>
          <p>{`Owner: ${shoppingList.owner.email}`}</p>
        </div>
        <div>{rightElement}</div>
      </div>

      <div className="divider mb-6" />
    </div>
  );
};
