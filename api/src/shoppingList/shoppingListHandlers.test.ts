import { beforeEach, describe, expect, test } from "vitest";
import {
  createShoppingListHandler,
  getShoppingListHandler,
  listShoppingListsHandler,
  updateShoppingListHandler,
} from "./shoppingListHandlers";
import { createRequest, createResponse } from "node-mocks-http";
import { StatusCodes } from "http-status-codes";

import mongoose from "mongoose";
import { env } from "../env";
import { inviteUserToShoppingListHandler } from "./inviteeHandlers";
import { getShoppingList, getShoppingListItems } from "../user/shoppingListDb";
import { deleteShoppingListItemHandler } from "./itemHandlers";
import { createTestUser } from "../user/userTestHelpers";
import {
  createTestShoppingList,
  createTestShoppingListItem,
} from "./shoppingListTestHelpers";
import { createUser } from "../user/userDb";

beforeEach(async () => {
  await mongoose.connect(env.MONGO_URI);
  await mongoose.connection.db?.dropDatabase();
});

describe("createShoppingListHandler", () => {
  test("Should return unathorized, when user not logged in", async () => {
    const req = createRequest({
      body: {
        name: "My list",
      },
    });
    const res = createResponse();

    await createShoppingListHandler(req, res, () => null);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test("Should return bad request, when name is empty", async () => {
    const userId = await createTestUser("a@a");
    const req = createRequest({
      userId,
      body: {
        name: "",
      },
    });
    const res = createResponse();

    await createShoppingListHandler(req, res, () => null);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  test("Should be created, when everything is ok", async () => {
    const userId = await createTestUser("a@a");
    const req = createRequest({
      userId,
      body: {
        name: "My list",
      },
    });
    const res = createResponse();
    await createShoppingListHandler(req, res, () => null);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    const id = res._getJSONData().id;
    expect(id).toBeTypeOf("string");

    const listAfterCreateResult = await getShoppingList(id);
    expect(listAfterCreateResult.isOk()).toBe(true);
  });
});

describe("updateShoppingListHandler", () => {
  test("Should return unathorized, when user not logged in", async () => {
    const req = createRequest({
      params: { id: "" },
      body: {},
    });
    const res = createResponse();

    await updateShoppingListHandler(req, res, () => null);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test("Should return forbidden, when user isn't owner", async () => {
    const owner = await createTestUser("a@a");
    const someoneElse = await createTestUser("b@b");

    const listId = await createTestShoppingList(owner);

    const req = createRequest({
      userId: someoneElse,
      params: { id: listId },
      body: {},
    });
    const res = createResponse();
    await updateShoppingListHandler(req, res, () => null);
    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
  });

  test("Should return bad request, when name is empty", async () => {
    const owner = await createTestUser("a@a");
    const listId = await createTestShoppingList(owner);

    const req = createRequest({
      userId: owner,
      params: { id: listId },
      body: {
        name: "",
      },
    });
    const res = createResponse();
    await updateShoppingListHandler(req, res, () => null);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  test("Should be created, when everything is ok", async () => {
    const owner = await createTestUser("a@a");
    const listId = await createTestShoppingList(owner);

    const req = createRequest({
      userId: owner,
      params: { id: listId },
      body: {
        name: "aaa",
        archived: true,
      },
    });
    const res = createResponse();
    await updateShoppingListHandler(req, res, () => null);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toEqual({
      id: listId,
      name: "aaa",
      archived: true,
      owner: {
        id: owner,
      },
    });

    const listAfterUpdate = (await getShoppingList(listId)).unwrap();
    expect(listAfterUpdate.name).toBe("aaa");
    expect(listAfterUpdate.archived).toBe(true);
  });
});

describe("listShoppingListsHandler", () => {
  test("Should return unathorized, when user is not logged in", async () => {
    const listReq = createRequest({
      query: { includeArchived: "true" },
    });
    const listRes = createResponse();
    await listShoppingListsHandler(listReq, listRes, () => null);

    expect(listRes.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test("User should see owned lists and lists that they are invited to", async () => {
    const userA = await createTestUser("a@a");
    const userB = await createTestUser("b@b");

    const listA = await createTestShoppingList(userA);
    const listB = await createTestShoppingList(userB);
    const listC = await createTestShoppingList(userB);

    const inviteReq = createRequest({
      userId: userB,
      params: {
        shoppingListId: listC,
      },
      body: {
        email: "a@a",
      },
    });
    const inviteRes = createResponse({});
    await inviteUserToShoppingListHandler(inviteReq, inviteRes, () => null);
    expect(inviteRes.statusCode).toBe(StatusCodes.CREATED);

    const listReq = createRequest({
      userId: userA,
      query: { includeArchived: "true" },
    });
    const listRes = createResponse();
    await listShoppingListsHandler(listReq, listRes, () => null);

    expect(listRes.statusCode).toBe(StatusCodes.OK);
    expect(listRes._getJSONData()).toEqual({
      hasNextPage: false,
      shoppingLists: [
        {
          archived: false,
          id: listA,
          name: "My list",
          owner: {
            id: userA,
          },
        },
        {
          archived: false,
          id: listC,
          name: "My list",
          owner: {
            id: userB,
          },
        },
      ],
    });
  });
});

describe("getShoppingListHandler", () => {
  test("Should return unathorized, when user is not logged in", async () => {
    const req = createRequest({
      params: { id: "" },
    });
    const res = createResponse();
    await getShoppingListHandler(req, res, () => null);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test("Should return forbidden, when user is not owner nor invitee", async () => {
    const owner = await createTestUser("a@a");
    const someoneElse = await createTestUser("b@b");

    const list = await createTestShoppingList(owner);

    const req = createRequest({
      userId: someoneElse,
      params: { id: list },
    });
    const res = createResponse();
    await getShoppingListHandler(req, res, () => null);
    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
  });

  test("Should return the list, when everything is ok", async () => {
    const owner = await createTestUser("a@a");
    const list = await createTestShoppingList(owner);

    const req = createRequest({
      userId: owner,
      params: { id: list },
    });
    const res = createResponse();
    await getShoppingListHandler(req, res, () => null);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toEqual({
      archived: false,
      id: list,
      name: "My list",
      owner: {
        email: "a@a",
        id: owner,
      },
    });
  });
});

describe("deleteShoppingListItemHandler", () => {
  test("Should return unathorized, when user not logged in", async () => {
    const req = createRequest({
      params: {
        shoppingListId: "",
        itemId: "",
      },
    });
    const res = createResponse();
    deleteShoppingListItemHandler(req, res, () => null);

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test("Should return forbidden, when user owner nor invitee", async () => {
    const owner = await createTestUser("a@a");
    const someoneElse = await createTestUser("b@b");

    const list = await createTestShoppingList(owner);

    const req = createRequest({
      userId: someoneElse,
      params: {
        shoppingListId: list,
        itemId: "",
      },
    });
    const res = createResponse();
    await deleteShoppingListItemHandler(req, res, () => null);

    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
  });

  test("Should delete the item, when everything is ok", async () => {
    const user = await createTestUser("a@a");

    const list = await createTestShoppingList(user);
    const item = await createTestShoppingListItem(user, list);

    const itemsBefore = (await getShoppingListItems(list, false)).unwrap();
    expect(itemsBefore.length).toBe(1);

    const req = createRequest({
      userId: user,
      params: {
        shoppingListId: list,
        itemId: item,
      },
    });
    const res = createResponse();
    await deleteShoppingListItemHandler(req, res, () => null);
    expect(res.statusCode).toBe(StatusCodes.OK);

    const itemsAfter = (await getShoppingListItems(list, false)).unwrap();
    expect(itemsAfter.length).toBe(0);
  });
});
