import { useQueryClient } from "@tanstack/react-query";
import { ShoppingList } from "../../api/types";
import { useRemoveUserMutation } from "../../api/useRemoveUserMutation";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { getShoppingListQueryKey } from "../../api/useShoppingListQuery";

export type RemoveUserDialog = {
  shoppingListId: string;
  userId?: string;
  onClose: () => void;
};

export const RemoveUserDialog = ({
  shoppingListId,
  userId,
  onClose,
}: RemoveUserDialog) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useRemoveUserMutation();

  const handleConfirm = () => {
    if (!userId) return;

    mutate(
      {
        shoppingListId: shoppingListId,
        userId,
      },
      {
        onSuccess: () => {
          queryClient.setQueryData<ShoppingList>(
            getShoppingListQueryKey(shoppingListId),
            (data) => {
              if (!data) return data;

              return {
                ...data,
                invitees: data.invitees.filter(
                  (invitee) => invitee.id !== userId,
                ),
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
      isOpen={!!userId}
      title="Remove user"
      description="This is irreversible operation"
      confirmText="Remove"
      isLoading={isPending}
      onCancel={onClose}
      onConfirm={handleConfirm}
    />
  );
};
