import express from "express";
import { loginUserHandler, registerUserHandler } from "./user/userHandler";
import {
  createShoppingListHandler,
  deleteShoppingListHandler,
  getShoppingListHandler,
  listShoppingListsHandler,
} from "./shoppingList/shoppingListHandlers";
import {
  createShoppingListItemHandler,
  deleteShoppingListItemHandler,
  listShoppingListItemsHandler,
  updateShoppingListItemHandler,
} from "./shoppingList/itemHandlers";
import {
  inviteUserToShoppingListHandler,
  listShoppingListInviteesHandler,
  removeInviteeFromShoppingListHandler,
} from "./shoppingList/inviteeHandlers";
import { parseAuthorization } from "./middlewares/parseAuthorization";
import mongoose from "mongoose";
import { env } from "./env";

const main = async () => {
  await mongoose.connect(env.MONGO_URI);

  const app = express();
  app.use(express.json());
  app.use(parseAuthorization);

  app.post("/user/register", registerUserHandler);
  app.post("/user/login", loginUserHandler);

  app.post("/shopping-list", createShoppingListHandler);
  app.get("/shopping-lists", listShoppingListsHandler);
  app.get("/shopping-lists/:id", getShoppingListHandler);
  app.delete("/shopping-lists/:id", deleteShoppingListHandler);

  app.get(
    "/shopping-lists/:shoppingListId/items",
    listShoppingListItemsHandler,
  );
  app.post(
    "/shopping-lists/:shoppingListId/item",
    createShoppingListItemHandler,
  );
  app.put(
    "/shopping-lists/:shoppingListId/items/:itemId",
    updateShoppingListItemHandler,
  );
  app.delete(
    "/shopping-lists/:shoppingListId/items/:itemId",
    deleteShoppingListItemHandler,
  );

  app.get(
    "/shopping-lists/:shoppingListId/invitees",
    listShoppingListInviteesHandler,
  );
  app.post(
    "/shopping-lists/:shoppingListId/invitee",
    inviteUserToShoppingListHandler,
  );
  app.delete(
    "/shopping-lists/:shoppingListId/invitees/:userId",
    removeInviteeFromShoppingListHandler,
  );

  app.listen(4000, () => {
    console.log("listening on https://localhost:4000");
  });
};

main();
