import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ShoppingList } from "./types";

export type UseShoppingListParams = {
  id: string;
};

const DATA_MOCK: ShoppingList = {
  id: "xxx",
  name: "Shopping for thursday",
  owner: {
    id: "1",
    email: "pepa@zleasa.com",
  },
  invitees: [
    {
      id: "2",
      email: "jozin@zbazin.cz",
    },
  ],
  items: [
    {
      name: "2x Apple",
      completed: false,
      archived: false,
    },
    {
      name: "2x Apple",
      completed: false,
      archived: false,
    },
    {
      name: "2x Apple",
      completed: true,
      archived: false,
    },
  ],
};

export const useShoppingListQuery = ({
  id,
}: UseShoppingListParams): UseQueryResult<ShoppingList> =>
  useQuery({
    queryKey: ["shoppingList", id],
    queryFn: () => DATA_MOCK,
  });
