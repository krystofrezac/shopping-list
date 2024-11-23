import { Handler } from "express";
import { z } from "zod";
import { sendInputValidationError } from "../helpers/sendInputValidationError";
import { StatusCodes } from "http-status-codes";

export const listShoppingListItemsHandler: Handler = (_req, res) => {
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

  const bodyValidation = createShoppingListItemBodySchema.safeParse(req.body);
  if (!bodyValidation.success)
    return sendInputValidationError(res, "body", bodyValidation.error);

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

  const bodyValidation = updateShoppingListItemBodySchema.safeParse(req.body);
  if (!bodyValidation.success)
    return sendInputValidationError(res, "body", bodyValidation.error);

  res.json({});
};
