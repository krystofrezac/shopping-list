import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ShoppingListOverview } from "./types";

const DATA_MOCK: ShoppingListOverview[] = [
  {
    id: "xxx",
    name: "List for thursday",
    archived: false,
    owner: {
      id: "1",
      email: "pepa@zlesa.com",
    },
  },
];

export const SHOPPING_LISTS_QUERY_KEY = ["shoppingLists"];

export const useShoppingListsQuery = (): UseQueryResult<
  ShoppingListOverview[]
> =>
  useQuery({
    queryKey: SHOPPING_LISTS_QUERY_KEY,
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(DATA_MOCK);
        }, 300);
      }),
  });
