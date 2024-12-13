import { FormEventHandler, useEffect, useState } from "react";
import { Button } from "../../components/Button";
import {
  DialogActions,
  DialogBody,
  DialogTitle,
  DialogWithData,
} from "../../components/Dialog";
import { TextInput } from "../../components/TextInput";
import { useUpdateShoppingListItemMutation } from "../../api/useUpdateShoppingListItemMutation";
import { ShoppingListItem } from "../../api/types";
import { useGetUpdateItemQueryCache } from "./useGetUpdateItemQueryCache";

type ItemEditDialogContentProps = {
  shoppingListId: string;
  item: ShoppingListItem;
  onClose: () => void;
};

export type ItemEditDialogProps = Omit<ItemEditDialogContentProps, "item"> & {
  item?: ShoppingListItem;
};

type Errors = {
  name?: string;
};

export const ItemEditDialog = ({ item, ...rest }: ItemEditDialogProps) => {
  const render = (item: ShoppingListItem) => (
    <ItemEditDialogContent item={item} {...rest} />
  );

  return <DialogWithData data={item} render={render} />;
};

const ItemEditDialogContent = ({
  shoppingListId,
  item,
  onClose,
}: ItemEditDialogContentProps) => {
  const [name, setName] = useState(item.name);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    setName(item.name);
  }, [item]);

  const { mutate, isPending } = useUpdateShoppingListItemMutation();
  const updateItemQueryCache = useGetUpdateItemQueryCache();

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    const newErrors: Errors = {};
    if (name.trim().length === 0) newErrors.name = "Name cannot be empty";

    setErrors(newErrors);
    if (Object.entries(newErrors).length !== 0) return;

    mutate(
      {
        shoppingListId,
        item: {
          ...item,
          name,
        },
      },
      {
        onSuccess: (newItem) => {
          updateItemQueryCache({
            shoppingListId,
            newData: newItem,
          });
          onClose();
        },
      },
    );
  };

  return (
    <>
      <DialogTitle>Edit item</DialogTitle>
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
            Save
          </Button>
        </DialogActions>
      </form>
    </>
  );
};
