import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ShoppingListOverview } from "./types";
import { useUserContext } from "../contexts/UserContext";
import { useFetchFn } from "./useFetchFn";
import { env } from "../env";

export type CreateShoppingListVariables = {
  name: string;
};
export type UseCreateShoppingListMutationParams = Omit<
  UseMutationOptions<
    ShoppingListOverview,
    unknown,
    CreateShoppingListVariables
  >,
  "mutationFn"
>;

export const useCreateShoppingListMutation = (
  options?: UseCreateShoppingListMutationParams,
) => {
  const { user } = useUserContext();
  const fetchFn = useFetchFn();

  return useMutation({
    ...options,
    mutationFn: ({ name }) => {
      if (env.VITE_API_MOCK_ENABLED)
        return new Promise((resolve) => {
          const newMock: ShoppingListOverview = {
            id: crypto.randomUUID(),
            name,
            archived: false,
            owner: {
              id: user?.id ?? "",
              email: "willBeCorrectWhenBackendReady@owner.cz",
            },
          };
          setTimeout(() => resolve(newMock), 1000);
        });

      return fetchFn("POST", "/shopping-list", {
        body: {
          name,
        },
      }).then((res) => res.json());
    },
  });
};
