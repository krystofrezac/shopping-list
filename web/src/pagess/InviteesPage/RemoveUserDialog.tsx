import { useQueryClient } from "@tanstack/react-query";
import { User } from "../../api/types";
import { useRemoveUserMutation } from "../../api/useRemoveUserMutation";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { getShoppingListInviteesQueryKey } from "../../api/useShoppingListInviteesQuery";

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
          queryClient.setQueryData<User[]>(
            getShoppingListInviteesQueryKey(shoppingListId),
            (data) => {
              if (!data) return data;

              return data.filter((invitee) => invitee.id !== userId);
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
