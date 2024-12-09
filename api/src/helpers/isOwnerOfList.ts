import { Err, Ok } from "@thames/monads";
import { getShoppingList } from "../user/shoppingListDb";

export const isOwnerOfList = async (
  userId: string,
  listId: string,
): Promise<boolean> =>
  (await getShoppingList(listId))
    .map((shoppingList) => shoppingList.owner.id === userId)
    // If doesn't exist return true, so that the handler can return 404
    .orElse((err) => (err === "notFound" ? Ok(true) : Err(err)))
    .unwrapOr(false);
