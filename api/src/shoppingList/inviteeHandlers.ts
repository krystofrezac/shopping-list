import { Handler } from "express";
import { z } from "zod";
import { sendInputValidationError } from "../helpers/sendInputValidationError";
import { StatusCodes } from "http-status-codes";

const listShoppingListInviteesParamsSchema = z.object({
  shoppingListId: z.string(),
});
export const listShoppingListInviteesHandler: Handler = (req, res) => {
  const paramsValidation = listShoppingListInviteesParamsSchema.safeParse(
    req.params,
  );
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);

  res.json([]);
};

const inviteUserToShoppingListParamsSchema = z.object({
  shoppingListId: z.string(),
});
const inviteUserToShoppingListBodySchema = z.object({
  userId: z.string(),
});
export const inviteUserToShoppingListHandler: Handler = (req, res) => {
  const paramsValidation = inviteUserToShoppingListParamsSchema.safeParse(
    req.params,
  );
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);

  const bodyValidation = inviteUserToShoppingListBodySchema.safeParse(req.body);
  if (!bodyValidation.success)
    return sendInputValidationError(res, "body", bodyValidation.error);

  res.sendStatus(StatusCodes.CREATED);
};

const removeInviteeFromShoppingListParamsSchema = z.object({
  shoppingListId: z.string(),
  userId: z.string(),
});
export const removeInviteeFromShoppingListHandler: Handler = (req, res) => {
  const paramsValidation = removeInviteeFromShoppingListParamsSchema.safeParse(
    req.params,
  );
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);

  res.sendStatus(StatusCodes.OK);
};
