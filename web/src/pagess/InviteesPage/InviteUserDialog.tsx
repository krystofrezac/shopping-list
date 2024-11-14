import { FormEventHandler, useState } from "react";
import { Button } from "../../components/Button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "../../components/Dialog";
import { TextInput } from "../../components/TextInput";
import { useInviteUserMutation } from "../../api/useInviteUserMutation";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingList } from "../../api/types";
import { getShoppingListQueryKey } from "../../api/useShoppingListQuery";

export type InviteUserDialogProps = {
  isOpen: boolean;
  shoppingListId: string;
  onClose: () => void;
};

export const InviteUserDialog = ({
  isOpen,
  shoppingListId,
  onClose,
}: InviteUserDialogProps) => {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);

  const { mutate, isPending } = useInviteUserMutation();

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    if (!/.+@.+/.test(email)) {
      setEmailError("Is not valid email");
      return;
    }

    setEmailError(undefined);
    mutate(
      {
        shoppingListId,
        userEmail: email,
      },
      {
        onSuccess: (invitee) => {
          queryClient.setQueryData<ShoppingList>(
            getShoppingListQueryKey(shoppingListId),
            (data) => {
              if (!data) return;

              return {
                ...data,
                invitees: [...data.invitees, invitee],
              };
            },
          );
          onClose();
          setEmail("");
        },
      },
    );
  };

  return (
    <Dialog isOpen={isOpen}>
      <DialogTitle>Invite user</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogBody>
          <TextInput
            label="Email"
            value={email}
            error={emailError}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogBody>
        <DialogActions>
          <Button isLoading={isPending} onClick={onClose}>
            Cancel
          </Button>
          <Button isLoading={isPending} variant="primary" type="submit">
            Invite
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
