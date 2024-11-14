import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { User } from "./types";

export type InviteUserVariables = {
  shoppingListId: string;
  userEmail: string;
};
export type UseInviteUserMutationParams = Omit<
  UseMutationOptions<User, unknown, InviteUserVariables>,
  "mutationFn"
>;

export const useInviteUserMutation = (options?: UseInviteUserMutationParams) =>
  useMutation({
    ...options,
    mutationFn: ({ shoppingListId, userEmail }) => {
      console.log(`Calling api to update shopping list item`, {
        shoppingListId,
        userEmail,
      });

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
    },
  });
