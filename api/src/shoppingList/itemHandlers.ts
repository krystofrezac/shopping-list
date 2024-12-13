import { Handler } from "express";
import { z } from "zod";
import { sendInputValidationError } from "../helpers/sendInputValidationError";
import { StatusCodes } from "http-status-codes";
import { canAccessList } from "../helpers/canAccessList";
import {
  addItemToShoppingList,
  deleteItemInShoppingList,
  getShoppingListItems,
  updateItemInShoppingList,
} from "../user/shoppingListDb";

const listShoppingListItemsParamsSchema = z.object({
  shoppingListId: z.string(),
});
const listShoppingListItemsQuerySchema = z.object({
  includeCompleted: z.coerce.boolean().default(false),
});
export const listShoppingListItemsHandler: Handler = async (req, res) => {
  const paramsValidation = listShoppingListItemsParamsSchema.safeParse(
    req.params,
  );
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);
  const params = paramsValidation.data;

  const queryValidation = listShoppingListItemsQuerySchema.safeParse(req.query);
  if (!queryValidation.success)
    return sendInputValidationError(res, "query", queryValidation.error);
  const query = queryValidation.data;

  if (
    !req.userId ||
    !(await canAccessList(req.userId, params.shoppingListId))
  ) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  (await getShoppingListItems(params.shoppingListId, query.includeCompleted))
    .mapErr((err) => {
      switch (err) {
        case "notFound":
          return res.sendStatus(StatusCodes.NOT_FOUND);
        case "unknown":
          return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })
    .map((items) => res.json(items));
};

const createShoppingListItemParamsSchema = z.object({
  shoppingListId: z.string(),
});
const createShoppingListItemBodySchema = z.object({
  name: z.string().min(1),
});
export const createShoppingListItemHandler: Handler = async (req, res) => {
  const paramsValidation = createShoppingListItemParamsSchema.safeParse(
    req.params,
  );
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);
  const params = paramsValidation.data;

  const bodyValidation = createShoppingListItemBodySchema.safeParse(req.body);
  if (!bodyValidation.success)
    return sendInputValidationError(res, "body", bodyValidation.error);
  const body = bodyValidation.data;

  if (
    !req.userId ||
    !(await canAccessList(req.userId, params.shoppingListId))
  ) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  (
    await addItemToShoppingList(params.shoppingListId, {
      name: body.name,
      completed: false,
    })
  )
    .mapErr((err) => {
      switch (err) {
        case "notFound":
          return res.sendStatus(404);
        case "unknown":
          return res.sendStatus(500);
      }
    })
    .map((item) => {
      return res.status(StatusCodes.CREATED).json(item);
    });
};

const updateShoppingListItemParamsSchema = z.object({
  shoppingListId: z.string(),
  itemId: z.coerce.string(),
});
const updateShoppingListItemBodySchema = z.object({
  name: z.string().min(1),
  completed: z.boolean(),
});
export const updateShoppingListItemHandler: Handler = async (req, res) => {
  const paramsValidation = updateShoppingListItemParamsSchema.safeParse(
    req.params,
  );
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);
  const params = paramsValidation.data;

  const bodyValidation = updateShoppingListItemBodySchema.safeParse(req.body);
  if (!bodyValidation.success)
    return sendInputValidationError(res, "body", bodyValidation.error);
  const body = bodyValidation.data;

  if (
    !req.userId ||
    !(await canAccessList(req.userId, params.shoppingListId))
  ) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  (
    await updateItemInShoppingList(params.shoppingListId, {
      id: params.itemId,
      ...body,
    })
  )
    .mapErr((err) => {
      switch (err) {
        case "notFound":
          return res.sendStatus(StatusCodes.NOT_FOUND);
        case "unknown":
          return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })
    .map((updatedItem) => {
      return res.json(updatedItem);
    });
};

const deleteShoppingListItemParamsSchema = z.object({
  shoppingListId: z.string(),
  itemId: z.coerce.string(),
});
export const deleteShoppingListItemHandler: Handler = async (req, res) => {
  const paramsValidation = deleteShoppingListItemParamsSchema.safeParse(
    req.params,
  );
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);
  const params = paramsValidation.data;

  if (
    !req.userId ||
    !(await canAccessList(req.userId, params.shoppingListId))
  ) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  (await deleteItemInShoppingList(params.shoppingListId, params.itemId))
    .mapErr((err) => {
      switch (err) {
        case "notFound":
          return res.sendStatus(StatusCodes.NOT_FOUND);
        case "unknown":
          return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })
    .map(() => {
      return res.sendStatus(StatusCodes.OK);
    });
};
