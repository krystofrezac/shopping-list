import { useQueryClient } from "@tanstack/react-query";
import { useArchiveShoppingListMutation } from "../../api/useArchiveShoppingListMutation";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { SHOPPING_LISTS_QUERY_KEY } from "../../api/useShoppingListsQuery";
import { ShoppingListOverview } from "../../api/types";

export type ListDeleteDialog = {
  shoppingListId?: string;
  onClose: () => void;
};

export const ListDeleteDialog = ({
  shoppingListId,
  onClose,
}: ListDeleteDialog) => {
  const queryClient = useQueryClient();
  const { mutate: archive, isPending: isArchivePending } =
    useArchiveShoppingListMutation();

  const handleConfirm = () => {
    if (!shoppingListId) return;

    archive(
      { shoppingListId },
      {
        onSuccess: () => {
          queryClient.setQueryData<ShoppingListOverview[]>(
            SHOPPING_LISTS_QUERY_KEY,
            (prev) => {
              if (!prev) return;

              return prev.map((shoppingList) => {
                if (shoppingList.id === shoppingListId) {
                  return { ...shoppingList, archived: true };
                }

                return shoppingList;
              });
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
