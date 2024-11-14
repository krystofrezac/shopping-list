import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export type RenameShoppingListVariables = {
  shoppingListId: string;
  name: string;
};
export type UseRenameShoppingListMutationParams = Omit<
  UseMutationOptions<undefined, unknown, RenameShoppingListVariables>,
  "mutationFn"
>;

export const useRenameShoppingListMutation = (
  options?: UseRenameShoppingListMutationParams,
) =>
  useMutation({
    ...options,
    mutationFn: ({ shoppingListId, name }) => {
      console.log(`Calling api to update shopping list item`, {
        shoppingListId,
        name,
      });

      return new Promise((resolve) => {
        setTimeout(() => resolve(undefined), 1000);
      });
    },
  });
