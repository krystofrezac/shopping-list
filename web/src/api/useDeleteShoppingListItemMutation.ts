import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useFetchFn } from "./useFetchFn";
import { env } from "../env";

export type DeleteShoppingListItemVariables = {
  shoppingListId: string;
  itemId: string;
};
export type UseDeleteShoppingListItemMutationParams = Omit<
  UseMutationOptions<undefined, unknown, DeleteShoppingListItemVariables>,
  "mutationFn"
>;

export const useDeleteShoppingListItemMutation = (
  options?: UseDeleteShoppingListItemMutationParams,
) => {
  const fetchFn = useFetchFn();

  return useMutation({
    ...options,
    mutationFn: ({ shoppingListId, itemId }) => {
      if (env.VITE_API_MOCK_ENABLED)
        return new Promise((resolve) => {
          setTimeout(() => resolve(undefined), 1000);
        });

      return fetchFn(
        "DELETE",
        `/shopping-lists/${shoppingListId}/items/${itemId}`,
      ).then(() => undefined);
    },
  });
};
