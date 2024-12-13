import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useFetchFn } from "./useFetchFn";
import { env } from "../env";
import { User } from "./types";

export type UseShoppingListInviteesParams = {
  id: string;
};

const DATA_MOCK: User[] = [
  {
    email: "a@a.cz",
    id: "a",
  },
];

export const getShoppingListInviteesQueryKey = (id: string) => [
  "shoppingListInvitees",
  id,
];

export const useShoppingListInviteesQuery = ({
  id,
}: UseShoppingListInviteesParams): UseQueryResult<User[]> => {
  const fetchFn = useFetchFn();

  return useQuery({
    queryKey: getShoppingListInviteesQueryKey(id),
    queryFn: () => {
      if (env.VITE_API_MOCK_ENABLED)
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(DATA_MOCK);
          }, 300);
        });

      return fetchFn("GET", `/shopping-lists/${id}/invitees`).then((res) =>
        res.json(),
      );
    },
  });
};
