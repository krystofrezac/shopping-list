import { Handler } from "express";
import { z } from "zod";
import { sendInputValidationError } from "../helpers/sendInputValidationError";
import { StatusCodes } from "http-status-codes";
import { isOwnerOfList } from "../helpers/isOwnerOfList";
import { canAccessList } from "../helpers/canAccessList";

const listShoppingListInviteesParamsSchema = z.object({
  shoppingListId: z.string(),
});
export const listShoppingListInviteesHandler: Handler = async (req, res) => {
  const paramsValidation = listShoppingListInviteesParamsSchema.safeParse(
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

  res.json([]);
};

const inviteUserToShoppingListParamsSchema = z.object({
  shoppingListId: z.string(),
});
const inviteUserToShoppingListBodySchema = z.object({
  email: z.string(),
});
export const inviteUserToShoppingListHandler: Handler = async (req, res) => {
  const paramsValidation = inviteUserToShoppingListParamsSchema.safeParse(
    req.params,
  );
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);
  const params = paramsValidation.data;

  const bodyValidation = inviteUserToShoppingListBodySchema.safeParse(req.body);
  if (!bodyValidation.success)
    return sendInputValidationError(res, "body", bodyValidation.error);
  const body = bodyValidation.data;

  if (
    !req.userId ||
    !(await isOwnerOfList(req.userId, params.shoppingListId))
  ) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  res.status(StatusCodes.CREATED).json({
    id: "",
    email: body.email,
  });
};

const removeInviteeFromShoppingListParamsSchema = z.object({
  shoppingListId: z.string(),
  userId: z.string(),
});
export const removeInviteeFromShoppingListHandler: Handler = async (
  req,
  res,
) => {
  const paramsValidation = removeInviteeFromShoppingListParamsSchema.safeParse(
    req.params,
  );
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);
  const params = paramsValidation.data;

  if (
    !req.userId ||
    !(await isOwnerOfList(req.userId, params.shoppingListId))
  ) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  res.sendStatus(StatusCodes.OK);
};
