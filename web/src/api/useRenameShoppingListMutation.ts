import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useFetchFn } from "./useFetchFn";
import { env } from "../env";
import { ShoppingList } from "./types";

export type UpdateShoppingListVariables = {
  shoppingListId: string;
  name?: string;
  archived?: boolean;
};
export type UseUpdateShoppingListMutationParams = Omit<
  UseMutationOptions<ShoppingList, unknown, UpdateShoppingListVariables>,
  "mutationFn"
>;

export const useUpdateShoppingListMutation = (
  options?: UseUpdateShoppingListMutationParams,
) => {
  const fetchFn = useFetchFn();

  return useMutation({
    ...options,
    mutationFn: ({ shoppingListId, name, archived }) => {
      if (env.VITE_API_MOCK_ENABLED)
        return new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                id: shoppingListId,
                name: name ?? "?",
                archived: archived ?? false,
                owner: {
                  email: "a@a.cz",
                  id: "a",
                },
              }),
            1000,
          );
        });

      return fetchFn("PATCH", `/shopping-lists/${shoppingListId}`, {
        body: {
          name,
          archived,
        },
      }).then((res) => res.json());
    },
  });
};
