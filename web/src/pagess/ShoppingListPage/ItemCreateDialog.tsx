import { FormEventHandler, useState } from "react";
import { Button } from "../../components/Button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "../../components/Dialog";
import { TextInput } from "../../components/TextInput";

import { ShoppingListItem } from "../../api/types";
import { useCreateShoppingListItemMutation } from "../../api/useCreateShoppingListItemMutation";
import { useQueryClient } from "@tanstack/react-query";
import { getShoppingListItemsQueryKey } from "../../api/useShoppingListItemsQuery";

type ItemCreateDialogProps = {
  isOpen: boolean;
  shoppingListId: string;
  onClose: () => void;
};

type Errors = {
  name?: string;
};
export const ItemCreateDialog = ({
  isOpen,
  shoppingListId,
  onClose,
}: ItemCreateDialogProps) => {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateShoppingListItemMutation();

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    const newErrors: Errors = {};
    if (name.trim().length === 0) newErrors.name = "Name cannot be empty";

    setErrors(newErrors);
    if (Object.entries(newErrors).length !== 0) return;

    mutate(
      {
        shoppingListId,
        name,
      },
      {
        onSuccess: (newItem) => {
          queryClient.setQueriesData<ShoppingListItem[]>(
            {
              exact: false,
              queryKey: getShoppingListItemsQueryKey(shoppingListId),
            },
            (items) => {
              if (!items) return;

              return [...items, newItem];
            },
          );
          onClose();
          setName("");
        },
      },
    );
  };

  return (
    <Dialog isOpen={isOpen}>
      <DialogTitle>Create item</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogBody>
          <TextInput
            name="name"
            label="Name"
            value={name}
            error={errors.name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogBody>
        <DialogActions>
          <Button isLoading={isPending} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isPending}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
