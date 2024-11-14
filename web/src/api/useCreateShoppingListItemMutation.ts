import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ShoppingListItem } from "./types";

export type CreatehoppingListItemVariables = {
  shoppingListId: string;
  name: string;
};
export type UseCreatehoppingListItemMutationParams = Omit<
  UseMutationOptions<ShoppingListItem, unknown, CreatehoppingListItemVariables>,
  "mutationFn"
>;

export const useCreatehoppingListItemMutation = (
  options?: UseCreatehoppingListItemMutationParams,
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
