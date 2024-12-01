import { FormEventHandler, useState } from "react";
import { Button } from "../../components/Button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "../../components/Dialog";
import { TextInput } from "../../components/TextInput";
import { useCreateShoppingListMutation } from "../../api/useCreateShoppingListMutation";
import { useQueryClient } from "@tanstack/react-query";
import { SHOPPING_LISTS_QUERY_KEY } from "../../api/useShoppingListsQuery";
import { ShoppingListOverview } from "../../api/types";

export type ListCreateDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Errors = {
  name?: string;
};

export const ListCreateDialog = ({
  isOpen,
  onClose,
}: ListCreateDialogProps) => {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const queryClient = useQueryClient();
  const { mutate: createShoppingList, isPending: isCreateShoppingListPending } =
    useCreateShoppingListMutation();

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    const newErrors: Errors = {};
    if (name.trim().length === 0) newErrors.name = "Name cannot be empty";

    setErrors(newErrors);
    if (Object.values(newErrors).length > 0) return;

    createShoppingList(
      {
        name,
      },
      {
        onSuccess: (newShoppingList) => {
          queryClient.setQueryData<ShoppingListOverview[]>(
            SHOPPING_LISTS_QUERY_KEY,
            (prev) => {
              if (!prev) return;

              return [...prev, newShoppingList];
            },
          );
          onClose();
        },
      },
    );
  };

  return (
    <Dialog isOpen={isOpen}>
      <DialogTitle>Create new shopping list</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogBody>
          <TextInput
            label="Name"
            value={name}
            error={errors.name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogBody>
        <DialogActions>
          <Button isLoading={isCreateShoppingListPending} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isCreateShoppingListPending}
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
