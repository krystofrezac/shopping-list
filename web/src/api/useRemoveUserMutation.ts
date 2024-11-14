import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export type RemoveUserVariables = {
  shoppingListId: string;
  userId: string;
};
export type UseRemoveUserMutationParams = Omit<
  UseMutationOptions<undefined, unknown, RemoveUserVariables>,
  "mutationFn"
>;

export const useRemoveUserMutation = (options?: UseRemoveUserMutationParams) =>
  useMutation({
    ...options,
    mutationFn: ({ shoppingListId, userId }) => {
      console.log(`Calling api to update shopping list item`, {
        shoppingListId,
        userId,
      });

      return new Promise((resolve) => {
        setTimeout(() => resolve(undefined), 1000);
      });
    },
  });
