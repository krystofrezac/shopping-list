import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useFetchFn } from "./useFetchFn";
import { env } from "../env";

export type RemoveUserVariables = {
  shoppingListId: string;
  userId: string;
};
export type UseRemoveUserMutationParams = Omit<
  UseMutationOptions<undefined, unknown, RemoveUserVariables>,
  "mutationFn"
>;

export const useRemoveUserMutation = (
  options?: UseRemoveUserMutationParams,
) => {
  const fetchFn = useFetchFn();

  return useMutation({
    ...options,
    mutationFn: ({ shoppingListId, userId }) => {
      if (env.VITE_API_MOCK_ENABLED)
        return new Promise((resolve) => {
          setTimeout(() => resolve(undefined), 1000);
        });

      return fetchFn(
        "DELETE",
        `/shopping-lists/${shoppingListId}/invitees/${userId}`,
      ).then(() => undefined);
    },
  });
};
