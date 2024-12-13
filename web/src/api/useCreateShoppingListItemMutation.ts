import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ShoppingListItem } from "./types";
import { useFetchFn } from "./useFetchFn";
import { env } from "../env";

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
) => {
  const fetchFn = useFetchFn();

  return useMutation({
    ...options,
    mutationFn: ({ shoppingListId, name }) => {
      if (env.VITE_API_MOCK_ENABLED)
        return new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                id: (Math.random() * 100).toString(),
                name,
                archived: false,
                completed: false,
              }),
            1000,
          );
        });

      return fetchFn("POST", `/shopping-lists/${shoppingListId}/item`, {
        body: {
          name,
        },
      }).then((res) => res.json());
    },
  });
};
