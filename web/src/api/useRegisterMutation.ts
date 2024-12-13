import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { env } from "../env";
import { useFetchFn } from "./useFetchFn";
export type RegisterVariables = {
  email: string;
  password: string;
};
export type UseRegisterMutationParams = Omit<
  UseMutationOptions<undefined, unknown, RegisterVariables>,
  "mutationFn"
>;

export const useRegisterMutation = (options?: UseRegisterMutationParams) => {
  const fetchFn = useFetchFn();

  return useMutation({
    ...options,
    mutationFn: ({ email, password }) => {
      if (env.VITE_API_MOCK_ENABLED) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(undefined), 1000);
        });
      }

      return fetchFn("POST", "/user/register", {
        body: {
          email,
          password,
        },
      }).then(() => undefined);
    },
  });
};
