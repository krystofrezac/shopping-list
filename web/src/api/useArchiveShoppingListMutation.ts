import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export type ArchiveShoppingListVariables = {
  shoppingListId: string;
};
export type UseArchiveShoppingListMutationParams = Omit<
  UseMutationOptions<undefined, unknown, ArchiveShoppingListVariables>,
  "mutationFn"
>;

export const useArchiveShoppingListMutation = (
  options?: UseArchiveShoppingListMutationParams,
) =>
  useMutation({
    ...options,
    mutationFn: ({ shoppingListId }) => {
      console.log(`Calling api to archive shopping list item`, {
        shoppingListId,
      });

      return new Promise((resolve) => {
        setTimeout(() => resolve(undefined), 1000);
      });
    },
  });
