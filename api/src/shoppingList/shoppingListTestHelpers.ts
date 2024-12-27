import { createRequest, createResponse } from "node-mocks-http";
import { createShoppingListHandler } from "./shoppingListHandlers";
import { StatusCodes } from "http-status-codes";
import { createShoppingListItemHandler } from "./itemHandlers";
import { expect } from "vitest";

export const createTestShoppingList = async (
  userId: string,
): Promise<string> => {
  const req = createRequest({
    userId,
    body: {
      name: "My list",
    },
  });
  const res = createResponse();

  await createShoppingListHandler(req, res, () => null);
  expect(res.statusCode).toBe(StatusCodes.CREATED);
  return res._getJSONData().id;
};

export const createTestShoppingListItem = async (
  userId: string,
  shoppingListId: string,
): Promise<string> => {
  const req = createRequest({
    userId,
    params: { shoppingListId },
    body: {
      name: "My item",
    },
  });
  const res = createResponse();

  await createShoppingListItemHandler(req, res, () => null);
  expect(res.statusCode).toBe(StatusCodes.CREATED);
  return res._getJSONData().id;
};
