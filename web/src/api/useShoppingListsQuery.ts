import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ShoppingListOverview } from "./types";
import { useFetchFn } from "./useFetchFn";
import { env } from "../env";

export type UseShoppingListsParams = {
  includeArchived: boolean;
};
export type ShoppingListsResponse = {
  hasNextPage: boolean;
  shoppingLists: ShoppingListOverview[];
};

const DATA_MOCK: ShoppingListsResponse = {
  hasNextPage: false,
  shoppingLists: [
    {
      id: "xxx",
      name: "List for thursday",
      archived: false,
      owner: {
        id: "1",
        email: "pepa@zlesa.com",
      },
    },
  ],
};

export const SHOPPING_LISTS_QUERY_KEY = ["shoppingLists"];
export const getShoppingListsQueryKeyWithVariables = (
  params: UseShoppingListsParams,
) => ["shoppingLists", params];

export const useShoppingListsQuery = (
  params: UseShoppingListsParams,
): UseQueryResult<ShoppingListsResponse> => {
  const fetchFn = useFetchFn();

  return useQuery({
    queryKey: getShoppingListsQueryKeyWithVariables(params),
    queryFn: () => {
      if (env.VITE_API_MOCK_ENABLED)
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(DATA_MOCK);
          }, 300);
        });

      return fetchFn("GET", "/shopping-lists", {
        query: { includeArchived: params.includeArchived },
      }).then((res) => res.json());
    },
  });
};
