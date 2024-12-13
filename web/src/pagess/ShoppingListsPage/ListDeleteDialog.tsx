import { useQueryClient } from "@tanstack/react-query";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import {
  SHOPPING_LISTS_QUERY_KEY,
  ShoppingListsResponse,
} from "../../api/useShoppingListsQuery";
import { useUpdateShoppingListMutation } from "../../api/useRenameShoppingListMutation";

export type ListDeleteDialog = {
  shoppingListId?: string;
  onClose: () => void;
};

export const ListDeleteDialog = ({
  shoppingListId,
  onClose,
}: ListDeleteDialog) => {
  const queryClient = useQueryClient();
  const { mutate: updateShoppingList, isPending: isArchivePending } =
    useUpdateShoppingListMutation();

  const handleConfirm = () => {
    if (!shoppingListId) return;

    updateShoppingList(
      { shoppingListId, archived: true },
      {
        onSuccess: () => {
          queryClient.setQueriesData<ShoppingListsResponse>(
            {
              exact: false,
              queryKey: SHOPPING_LISTS_QUERY_KEY,
            },
            (prev) => {
              if (!prev) return;

              const newShoppingLists = prev.shoppingLists.filter(
                (shoppingList) => {
                  if (shoppingList.id === shoppingListId) {
                    return { ...shoppingList, archived: true };
                  }

                  return shoppingList;
                },
              );

              return {
                ...prev,
                shoppingLists: newShoppingLists,
              };
            },
          );
          onClose();
        },
      },
    );
  };

  return (
    <ConfirmDialog
      isOpen={!!shoppingListId}
      isLoading={isArchivePending}
      title="Delete shopping list"
      description="This is irreversible operation"
      confirmText="Delete"
      confirmVariant="error"
      onCancel={onClose}
      onConfirm={handleConfirm}
    />
  );
};
