import { Handler } from "express";
import { z } from "zod";
import { sendInputValidationError } from "../helpers/sendInputValidationError";
import { StatusCodes } from "http-status-codes";
import { isOwnerOfList } from "../helpers/isOwnerOfList";
import {
  addInviteeToShoppingList,
  getShoppingList,
  getShoppingListDetailedInvitees,
  removeInviteeFromShoppingList,
} from "../user/shoppingListDb";
import { findUserByEmail } from "../user/userDb";

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
    !(await isOwnerOfList(req.userId, params.shoppingListId))
  ) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  (await getShoppingListDetailedInvitees(params.shoppingListId))
    .mapErr((err) => {
      switch (err) {
        case "notFound":
          return res.sendStatus(StatusCodes.NOT_FOUND);
        case "unknown":
          return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })
    .map((invitees) => {
      return res.json(invitees);
    });
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

  await (
    await getShoppingList(params.shoppingListId)
  )
    .mapErr((err) => {
      switch (err) {
        case "notFound":
          return res.status(StatusCodes.NOT_FOUND).json("shoppingListNotFound");
        case "unknown":
          return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })
    .map(async (shoppingList) => {
      return (await findUserByEmail(body.email))
        .mapErr((err) => {
          switch (err) {
            case "notFound":
              return res.status(StatusCodes.NOT_FOUND).json("userNotFound");
            case "unknown":
              return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
          }
        })
        .map(async (user) => {
          if (shoppingList.owner.id === user.id)
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json("cannotInviteOwner");

          (await addInviteeToShoppingList(params.shoppingListId, user.id))
            .mapErr((err) => {
              switch (err) {
                case "notFound":
                  return res
                    .status(StatusCodes.NOT_FOUND)
                    .json("shoppingListNotFound");
                case "unknown":
                  return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
              }
            })
            .map(() => {
              return res.status(StatusCodes.CREATED).json(user);
            });
        })
        .unwrapOr(Promise.resolve(undefined));
    })
    .unwrapOr(Promise.resolve(undefined));
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

  (await removeInviteeFromShoppingList(params.shoppingListId, params.userId))
    .mapErr((err) => {
      switch (err) {
        case "notFound":
          return res.status(StatusCodes.NOT_FOUND).json("shoppingListNotFound");
        case "unknown":
          return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })
    .map(() => {
      return res.sendStatus(StatusCodes.OK);
    });
};
