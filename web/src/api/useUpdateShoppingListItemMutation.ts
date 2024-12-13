import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ShoppingListItem } from "./types";
import { useFetchFn } from "./useFetchFn";
import { env } from "../env";

export type UpdateShoppingListItemVariables = {
  shoppingListId: string;
  item: ShoppingListItem;
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
) => {
  const fetchFn = useFetchFn();

  return useMutation({
    ...options,
    mutationFn: ({ shoppingListId, item }) => {
      if (env.VITE_API_MOCK_ENABLED)
        return new Promise((resolve) => {
          setTimeout(() => resolve(item), 1000);
        });

      return fetchFn(
        "PUT",
        `/shopping-lists/${shoppingListId}/items/${item.id}`,
        {
          body: item,
        },
      ).then((res) => res.json());
    },
  });
};
