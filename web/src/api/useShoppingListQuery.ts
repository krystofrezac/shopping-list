import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ShoppingList } from "./types";
import { useFetchFn } from "./useFetchFn";
import { env } from "../env";

export type UseShoppingListParams = {
  id: string;
};

const DATA_MOCK: ShoppingList = {
  id: "xxx",
  name: "List for thursday",
  owner: {
    id: "1",
    email: "pepa@zlesa.com",
  },
  archived: false,
};

export const getShoppingListQueryKey = (id: string) => ["shoppingList", id];

export const useShoppingListQuery = ({
  id,
}: UseShoppingListParams): UseQueryResult<ShoppingList> => {
  const fetchFn = useFetchFn();

  return useQuery({
    queryKey: getShoppingListQueryKey(id),
    queryFn: () => {
      if (env.VITE_API_MOCK_ENABLED)
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(DATA_MOCK);
          }, 300);
        });

      return fetchFn("GET", `/shopping-lists/${id}`).then((res) => res.json());
    },
  });
};
