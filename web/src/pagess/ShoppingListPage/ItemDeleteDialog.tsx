import { ShoppingList, ShoppingListItem } from "../../api/types";
import { useUpdateShoppingListItemMutation } from "../../api/useUpdateShoppingListItemMutation";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useGetUpdateItemQueryCache } from "./useGetUpdateItemQueryCache";

export type ItemDeleteDialog = {
  shoppingList: ShoppingList;
  index?: number;
  item?: ShoppingListItem;
  onClose: () => void;
};

export const ItemDeleteDialog = ({
  shoppingList,
  index,
  item,
  onClose,
}: ItemDeleteDialog) => {
  const { mutate, isPending } = useUpdateShoppingListItemMutation();
  const updateItemQueryCache = useGetUpdateItemQueryCache();

  const isOpen = index !== undefined && !!item;

  const handleConfirm = () => {
    if (!isOpen) return;

    const newData: ShoppingListItem = {
      ...item,
      archived: true,
    };

    mutate(
      {
        shoppingListId: shoppingList.id,
        shoppingListItemIndex: index,
        data: newData,
      },
      {
        onSuccess: () => {
          updateItemQueryCache({
            shoppingListId: shoppingList.id,
            itemIndex: index,
            newData,
          });
          onClose();
        },
      },
    );
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Delete shopping list item"
      description="This is irreversible operation"
      confirmText="Delete"
      isLoading={isPending}
      onCancel={onClose}
      onConfirm={handleConfirm}
    />
  );
};
