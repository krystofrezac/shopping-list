import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { User } from "./types";
import { useFetchFn } from "./useFetchFn";
import { env } from "../env";

export type InviteUserVariables = {
  shoppingListId: string;
  userEmail: string;
};
export type UseInviteUserMutationParams = Omit<
  UseMutationOptions<User, unknown, InviteUserVariables>,
  "mutationFn"
>;

export const useInviteUserMutation = (
  options?: UseInviteUserMutationParams,
) => {
  const fetchFn = useFetchFn();

  return useMutation({
    ...options,
    mutationFn: ({ shoppingListId, userEmail }) => {
      if (env.VITE_API_MOCK_ENABLED)
        return new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                email: userEmail,
                id: userEmail,
              }),
            1000,
          );
        });

      return fetchFn("POST", `/shopping-lists/${shoppingListId}/invitee`, {
        body: { email: userEmail },
      }).then((res) => res.json());
    },
  });
};
