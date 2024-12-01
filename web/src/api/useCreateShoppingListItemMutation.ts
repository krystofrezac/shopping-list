import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ShoppingListItem } from "./types";

export type CreateShoppingListItemVariables = {
  shoppingListId: string;
  name: string;
};
export type UseCreateShoppingListItemMutationParams = Omit<
  UseMutationOptions<
    ShoppingListItem,
    unknown,
    CreateShoppingListItemVariables
  >,
  "mutationFn"
>;

export const useCreateShoppingListItemMutation = (
  options?: UseCreateShoppingListItemMutationParams,
) =>
  useMutation({
    ...options,
    mutationFn: ({ shoppingListId, name }) => {
      console.log(`Calling api to update shopping list item`, {
        shoppingListId,
        name,
      });

      return new Promise((resolve) => {
        setTimeout(
          () => resolve({ name, archived: false, completed: false }),
          1000,
        );
      });
    },
  });
