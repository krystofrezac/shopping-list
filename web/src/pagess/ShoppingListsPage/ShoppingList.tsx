import { Link } from "react-router-dom";
import { Card, CardBody } from "../../components/Card";
import { ShoppingListOverview } from "../../api/types";
import { IconButton } from "../../components/IconButton";
import { useUserContext } from "../../contexts/UserContext";

export type ShoppingListProps = {
  shoppingList: ShoppingListOverview;
  onDelete: () => void;
};

export const ShoppingList = ({ shoppingList, onDelete }: ShoppingListProps) => {
  const { user } = useUserContext();
  return (
    <Link to={`/shopping-lists/${shoppingList.id}`}>
      <Card>
        <CardBody>
          <div className="flex flex-row items-center gap-4">
            <p className="text-lg">{shoppingList.name}</p>
            {user?.id === shoppingList.owner.id && !shoppingList.archived && (
              <div className="flex">
                <IconButton
                  iconName="TrashIcon"
                  size="sm"
                  color="error"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete();
                  }}
                />
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};
