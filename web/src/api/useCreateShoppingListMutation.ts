import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ShoppingListOverview } from "./types";
import { useUserContext } from "../contexts/UserContext";

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
  const { currentUserId } = useUserContext();

  return useMutation({
    ...options,
    mutationFn: ({ name }) => {
      console.log(`Calling api to create shopping list`, {
        name,
      });

      return new Promise((resolve) => {
        const newMock: ShoppingListOverview = {
          id: crypto.randomUUID(),
          name,
          archived: false,
          owner: {
            id: currentUserId,
            email: "willBeCorrectWhenBackendReady@owner.cz",
          },
        };
        setTimeout(() => resolve(newMock), 1000);
      });
    },
  });
};
