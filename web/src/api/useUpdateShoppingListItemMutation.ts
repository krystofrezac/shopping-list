import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ShoppingListItem } from "./types";

export type UpdateShoppingListItemVariables = {
  shoppingListId: string;
  shoppingListItemIndex: number;
  data: ShoppingListItem;
};
export type UseUpdateShoppingListItemMutationParams = Omit<
  UseMutationOptions<
    ShoppingListItem,
    unknown,
    UpdateShoppingListItemVariables
  >,
  "mutationFn"
>;

export const useUpdateShoppingListItemMutation = (
  options?: UseUpdateShoppingListItemMutationParams,
) =>
  useMutation({
    ...options,
    mutationFn: ({ shoppingListId, shoppingListItemIndex, data }) => {
      console.log(`Calling api to update shopping list item`, {
        shoppingListId,
        shoppingListItemIndex,
        data,
      });

      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 1000);
      });
    },
  });
