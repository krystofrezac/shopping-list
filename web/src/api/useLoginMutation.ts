import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { env } from "../env";
import { useFetchFn } from "./useFetchFn";
export type LoginVariables = {
  email: string;
  password: string;
};
export type UseLoginMutationParams = Omit<
  UseMutationOptions<
    { accessToken: string; userId: string },
    unknown,
    LoginVariables
  >,
  "mutationFn"
>;

export const useLoginMutation = (options?: UseLoginMutationParams) => {
  const fetchFn = useFetchFn();

  return useMutation({
    ...options,
    mutationFn: ({ email, password }) => {
      if (env.VITE_API_MOCK_ENABLED) {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ accessToken: "", userId: "1" }), 1000);
        });
      }

      return fetchFn("POST", "/user/login", {
        body: {
          email,
          password,
        },
      }).then((res) => res.json());
    },
  });
};
