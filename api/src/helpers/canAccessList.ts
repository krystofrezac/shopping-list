import { Err, Ok } from "@thames/monads";
import { getShoppingListInvitees } from "../user/shoppingListDb";
import { isOwnerOfList } from "./isOwnerOfList";

export const canAccessList = async (userId: string, listId: string) =>
  (await isOwnerOfList(userId, listId)) ||
  (await getShoppingListInvitees(listId))
    .map((invitees) => invitees.includes(userId))
    // If doesn't exist return true, so that the handler can return 404
    .orElse((err) => (err === "notFound" ? Ok(true) : Err(err)))
    .unwrapOr(false);
