import { useQueryClient } from "@tanstack/react-query";
import { ShoppingList, ShoppingListItem } from "../../api/types";
import { getShoppingListQueryKey } from "../../api/useShoppingListQuery";

export type GetUpadteItemQueryCache = {
  shoppingListId: string;
  itemIndex: number;
  newData: ShoppingListItem;
};

export const useGetUpdateItemQueryCache = () => {
  const queryClient = useQueryClient();

  const updateItemQueryCache = ({
    shoppingListId,
    itemIndex,
    newData,
  }: GetUpadteItemQueryCache) => {
    queryClient.setQueryData<ShoppingList>(
      getShoppingListQueryKey(shoppingListId),
      (data) => {
        if (!data) return data;

        const newItems = [...data.items];
        newItems[itemIndex] = newData;
        return { ...data, items: newItems };
      },
    );
  };

  return updateItemQueryCache;
};
