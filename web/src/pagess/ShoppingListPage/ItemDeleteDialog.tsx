import { useQueryClient } from "@tanstack/react-query";
import { ShoppingList, ShoppingListItem } from "../../api/types";
import { useDeleteShoppingListItemMutation } from "../../api/useDeleteShoppingListItemMutation";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { getShoppingListItemsQueryKey } from "../../api/useShoppingListItemsQuery";

export type ItemDeleteDialog = {
  shoppingList: ShoppingList;
  item?: ShoppingListItem;
  onClose: () => void;
};

export const ItemDeleteDialog = ({
  shoppingList,
  item,
  onClose,
}: ItemDeleteDialog) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useDeleteShoppingListItemMutation();

  const isOpen = !!item;

  const handleConfirm = () => {
    if (!isOpen) return;

    mutate(
      {
        shoppingListId: shoppingList.id,
        itemId: item.id,
      },
      {
        onSuccess: () => {
          queryClient.setQueriesData<ShoppingListItem[]>(
            {
              exact: false,
              queryKey: getShoppingListItemsQueryKey(shoppingList.id),
            },
            (items) => {
              if (!items) return items;

              return items.filter((cacheItem) => cacheItem.id !== item.id);
            },
          );
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
