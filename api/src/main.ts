import express from "express";
import { loginUserHandler, registerUserHandler } from "./user/userHandler";
import {
  createShoppingListHandler,
  deleteShoppingListHandler,
  getShoppingListHandler,
} from "./shoppingList/shoppingListHandlers";
import {
  createShoppingListItemHandler,
  listShoppingListItemsHandler,
  updateShoppingListItemHandler,
} from "./shoppingList/itemHandlers";
import {
  inviteUserToShoppingListHandler,
  listShoppingListInviteesHandler,
  removeInviteeFromShoppingListHandler,
} from "./shoppingList/inviteeHandlers";
import { loggedInGuard } from "./middlewares/loggedInGuard";
import { parseAuthorization } from "./middlewares/parseAuthorization";

const app = express();
app.use(express.json());
app.use(parseAuthorization);

app.post("/user/register", registerUserHandler);
app.post("/user/login", loginUserHandler);

app.post("/shopping-list", loggedInGuard, createShoppingListHandler);
app.get("/shopping-lists", loggedInGuard, listShoppingListItemsHandler);
app.get("/shopping-lists/:id", loggedInGuard, getShoppingListHandler);
app.delete("/shopping-lists/:id", loggedInGuard, deleteShoppingListHandler);

app.get(
  "/shopping-lists/:shoppingListId/items",
  loggedInGuard,
  listShoppingListItemsHandler,
);
app.post(
  "/shopping-lists/:shoppingListId/item",
  loggedInGuard,
  createShoppingListItemHandler,
);
app.put(
  "/shopping-lists/:shoppingListId/item/:itemIndex",
  loggedInGuard,
  updateShoppingListItemHandler,
);

app.get(
  "/shopping-lists/:shoppingListId/invitees",
  loggedInGuard,
  listShoppingListInviteesHandler,
);
app.post(
  "/shopping-lists/:shoppingListId/invite",
  loggedInGuard,
  inviteUserToShoppingListHandler,
);
app.delete(
  "/shopping-lists/:shoppingListId/invite/:userId",
  loggedInGuard,
  removeInviteeFromShoppingListHandler,
);

app.listen(4000, () => {
  console.log("listening on https://localhost:4000");
});
