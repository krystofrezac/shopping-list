import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ShoppingList } from "./types";

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
  invitees: [
    {
      id: "2",
      email: "jozin@zbazin.cz",
    },
    {
      id: "3",
      email: "mahulena@gmail.com",
    },
  ],
  items: [
    {
      name: "2x Apple",
      completed: false,
      archived: false,
    },
    {
      name: "2x Banana",
      completed: false,
      archived: false,
    },
    {
      name: "2x Orange",
      completed: true,
      archived: false,
    },
  ],
};

export const getShoppingListQueryKey = (id: string) => ["shoppingList", id];

export const useShoppingListQuery = ({
  id,
}: UseShoppingListParams): UseQueryResult<ShoppingList> =>
  useQuery({
    queryKey: getShoppingListQueryKey(id),
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(DATA_MOCK);
        }, 300);
      }),
  });
