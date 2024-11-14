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
  index: number;
  onEdit: () => void;
  onDelete: () => void;
};

export const ShoppingListItem = ({
  shoppingListId,
  index,
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
        shoppingListItemIndex: index,
        data: { ...item, completed: !item.completed },
      },
      {
        onSuccess: (newShoppingListItem) =>
          updateItemQueryCache({
            shoppingListId: shoppingListId,
            itemIndex: index,
            newData: newShoppingListItem,
          }),
      },
    );
  };

  const checkbox =
    index === updateShoppingListItemVariables?.shoppingListItemIndex &&
    isUpdateShoppingListItemPending ? (
      <Spinner />
    ) : (
      <CheckBox checked={item.completed} onChange={handleCompletedChange} />
    );

  return (
    <Card key={index}>
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
