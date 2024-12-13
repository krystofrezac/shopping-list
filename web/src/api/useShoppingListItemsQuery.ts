import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useFetchFn } from "./useFetchFn";
import { env } from "../env";
import { ShoppingListItem } from "./types";

export type UseShoppingListItemsParams = {
  id: string;
  includeCompleted: boolean;
};

const DATA_MOCK: ShoppingListItem[] = [
  {
    id: "a",
    name: "2x Apple",
    completed: false,
    archived: false,
  },
  {
    id: "b",
    name: "2x Banana",
    completed: false,
    archived: false,
  },
  {
    id: "c",
    name: "2x Orange",
    completed: true,
    archived: false,
  },
];

export const getShoppingListItemsQueryKey = (id: string) => [
  "shoppingListItems",
  id,
];
export const getShoppingListItemsQueryKeyWithVariables = (
  id: string,
  completed: boolean,
) => [...getShoppingListItemsQueryKey(id), completed];

export const useShoppingListItemsQuery = ({
  id,
  includeCompleted,
}: UseShoppingListItemsParams): UseQueryResult<ShoppingListItem[]> => {
  const fetchFn = useFetchFn();

  return useQuery({
    queryKey: getShoppingListItemsQueryKeyWithVariables(id, includeCompleted),
    queryFn: () => {
      if (env.VITE_API_MOCK_ENABLED)
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              DATA_MOCK.filter((item) => {
                if (includeCompleted) return true;
                return !item.completed;
              }),
            );
          }, 300);
        });

      return fetchFn("GET", `/shopping-lists/${id}/items`, {
        query: { includeCompleted },
      }).then((res) => res.json());
    },
  });
};
