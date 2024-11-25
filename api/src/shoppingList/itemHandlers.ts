import { Handler } from "express";
import { z } from "zod";
import { sendInputValidationError } from "../helpers/sendInputValidationError";
import { StatusCodes } from "http-status-codes";
import { isOwnerOfList } from "../helpers/isOwnerOfList";
import { canAccessList } from "../helpers/canAccessList";

const listShoppingListItemsParamsSchema = z.object({
  shoppingListId: z.string(),
});
export const listShoppingListItemsHandler: Handler = (req, res) => {
  const paramsValidation = listShoppingListItemsParamsSchema.safeParse(
    req.params,
  );
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);

  if (!req.userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  res.json([]);
};

const createShoppingListItemParamsSchema = z.object({
  shoppingListId: z.string(),
});
const createShoppingListItemBodySchema = z.object({
  name: z.string().min(1),
});
export const createShoppingListItemHandler: Handler = (req, res) => {
  const paramsValidation = createShoppingListItemParamsSchema.safeParse(
    req.params,
  );
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);
  const params = paramsValidation.data;

  const bodyValidation = createShoppingListItemBodySchema.safeParse(req.body);
  if (!bodyValidation.success)
    return sendInputValidationError(res, "body", bodyValidation.error);

  if (!req.userId || !isOwnerOfList(req.userId, params.shoppingListId)) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  res.sendStatus(StatusCodes.CREATED);
};

const updateShoppingListItemParamsSchema = z.object({
  shoppingListId: z.string(),
  itemIndex: z.coerce.number().min(0),
});
const updateShoppingListItemBodySchema = z.object({
  name: z.string().min(1),
  completed: z.boolean(),
  archived: z.boolean(),
});
export const updateShoppingListItemHandler: Handler = (req, res) => {
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

  if (!req.userId || !canAccessList(req.userId, params.shoppingListId)) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  res.json({
    name: body.name,
    completed: body.completed,
    archived: body.archived,
  });
};
