import { FormEventHandler, useState } from "react";
import {
  DialogActions,
  DialogBody,
  DialogTitle,
  DialogWithData,
} from "../../components/Dialog";
import { TextInput } from "../../components/TextInput";
import { ShoppingList } from "../../api/types";
import { useUpdateShoppingListMutation } from "../../api/useRenameShoppingListMutation";
import { Button } from "../../components/Button";
import { useQueryClient } from "@tanstack/react-query";
import { getShoppingListQueryKey } from "../../api/useShoppingListQuery";

export type ListRenameDialogContentProps = {
  shoppingList: ShoppingList;
  onClose: () => void;
};
export type ListRenameDialogProps = Omit<
  ListRenameDialogContentProps,
  "shoppingList"
> & {
  shoppingList?: ShoppingList;
};

export const ListRenameDialog = ({
  shoppingList,
  onClose,
}: ListRenameDialogProps) => (
  <DialogWithData
    data={shoppingList}
    render={(shoppingList) => (
      <ListRenameDialogContent shoppingList={shoppingList} onClose={onClose} />
    )}
  />
);

const ListRenameDialogContent = ({
  shoppingList,
  onClose,
}: ListRenameDialogContentProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useUpdateShoppingListMutation();

  const [name, setName] = useState(shoppingList.name);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    if (name === "") {
      setError("Name cannot be empty");
      return;
    }

    setError(undefined);

    mutate(
      {
        name,
        shoppingListId: shoppingList.id,
      },
      {
        onSuccess: () => {
          queryClient.setQueriesData<ShoppingList>(
            {
              exact: false,
              queryKey: getShoppingListQueryKey(shoppingList.id),
            },
            (data) => {
              if (!data) return;

              return {
                ...data,
                name,
              };
            },
          );

          onClose();
        },
      },
    );
  };

  return (
    <>
      <DialogTitle>Rename shopping list</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogBody>
          <TextInput
            label="Name"
            value={name}
            error={error}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogBody>
        <DialogActions>
          <Button isLoading={isPending} onClick={onClose}>
            Cancel
          </Button>
          <Button isLoading={isPending} variant="primary" type="submit">
            Rename
          </Button>
        </DialogActions>
      </form>
    </>
  );
};
