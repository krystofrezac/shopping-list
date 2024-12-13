import { ShoppingListItem as ShoppingListeItemType } from "../../api/types";
import { useUpdateShoppingListItemMutation } from "../../api/useUpdateShoppingListItemMutation";
import { Card, CardBody } from "../../components/Card";
import { CheckBox } from "../../components/CheckBox";
import { IconButton } from "../../components/IconButton";
import { Spinner } from "../../components/Spinner";
import { useGetUpdateItemQueryCache } from "./useGetUpdateItemQueryCache";

export type ShoppingListItemProps = {
  shoppingListId: string;
  item: ShoppingListeItemType;
  onEdit: () => void;
  onDelete: () => void;
};

export const ShoppingListItem = ({
  shoppingListId,
  item,
  onEdit,
  onDelete,
}: ShoppingListItemProps) => {
  const {
    mutate: updateShoppingListItem,
    isPending: isUpdateShoppingListItemPending,
    variables: updateShoppingListItemVariables,
  } = useUpdateShoppingListItemMutation();
  const updateItemQueryCache = useGetUpdateItemQueryCache();

  const handleCompletedChange = () => {
    updateShoppingListItem(
      {
        shoppingListId: shoppingListId,
        item: { ...item, completed: !item.completed },
      },
      {
        onSuccess: (newShoppingListItem) =>
          updateItemQueryCache({
            shoppingListId: shoppingListId,
            newData: newShoppingListItem,
          }),
      },
    );
  };

  const checkbox =
    item.id === updateShoppingListItemVariables?.item.id &&
    isUpdateShoppingListItemPending ? (
      <Spinner />
    ) : (
      <CheckBox checked={item.completed} onChange={handleCompletedChange} />
    );

  return (
    <Card key={item.id}>
      <CardBody>
        <div className="flex flex-row items-center gap-4">
          <div className="w-6 flex items-center">{checkbox}</div>
          <p className="text-lg">{item.name}</p>
          <div className="flex flex row gap-1">
            <IconButton
              iconName="TrashIcon"
              size="sm"
              color="error"
              onClick={onDelete}
            />
            <IconButton iconName="PencilIcon" size="sm" onClick={onEdit} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
