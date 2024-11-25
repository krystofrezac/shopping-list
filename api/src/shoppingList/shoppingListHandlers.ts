import { Handler } from "express";
import { z } from "zod";
import { sendInputValidationError } from "../helpers/sendInputValidationError";
import { StatusCodes } from "http-status-codes";

const createShoppingListBodySchema = z.object({
  name: z.string().min(1),
});
export const createShoppingListHandler: Handler = (req, res) => {
  const bodyValidation = createShoppingListBodySchema.safeParse(req.body);
  if (!bodyValidation.success)
    return sendInputValidationError(res, "body", bodyValidation.error);
  const body = bodyValidation.data;

  res.status(StatusCodes.CREATED).json({
    id: "",
    name: body.name,
    ownerId: "",
    ownerEmail: "",
  });
};

export const listShoppingListsHandler: Handler = (_req, res) => {
  res.json([]);
};

const getShoppingListParamsSchema = z.object({
  id: z.string(),
});
export const getShoppingListHandler: Handler = (req, res) => {
  const paramsValidation = getShoppingListParamsSchema.safeParse(req.params);
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);

  res.json({});
};

const deleteShoppingListParamsSchema = z.object({
  id: z.string(),
});
export const deleteShoppingListHandler: Handler = (req, res) => {
  const paramsValidation = deleteShoppingListParamsSchema.safeParse(req.params);
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);

  res.sendStatus(StatusCodes.OK);
};
