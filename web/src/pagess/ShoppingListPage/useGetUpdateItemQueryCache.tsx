import { useQueryClient } from "@tanstack/react-query";
import { ShoppingListItem } from "../../api/types";
import { getShoppingListItemsQueryKey } from "../../api/useShoppingListItemsQuery";

export type GetUpadteItemQueryCache = {
  shoppingListId: string;
  newData: ShoppingListItem;
};

export const useGetUpdateItemQueryCache = () => {
  const queryClient = useQueryClient();

  const updateItemQueryCache = ({
    shoppingListId,
    newData,
  }: GetUpadteItemQueryCache) => {
    queryClient.setQueriesData<ShoppingListItem[]>(
      {
        exact: false,
        queryKey: getShoppingListItemsQueryKey(shoppingListId),
      },
      (items) => {
        if (!items) return items;

        return items.map((item) => {
          if (item.id === newData.id) return newData;
          return item;
        });
      },
    );
  };

  return updateItemQueryCache;
};
