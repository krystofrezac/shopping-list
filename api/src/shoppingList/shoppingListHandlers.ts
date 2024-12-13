import { Handler } from "express";
import { z } from "zod";
import { sendInputValidationError } from "../helpers/sendInputValidationError";
import { StatusCodes } from "http-status-codes";
import { canAccessList } from "../helpers/canAccessList";
import {
  createShoppingList,
  deleteShoppingList,
  getShoppingList,
  listShoppingListsForUser,
} from "../user/shoppingListDb";
import { isOwnerOfList } from "../helpers/isOwnerOfList";

const createShoppingListBodySchema = z.object({
  name: z.string().min(1),
});
export const createShoppingListHandler: Handler = async (req, res) => {
  const bodyValidation = createShoppingListBodySchema.safeParse(req.body);
  if (!bodyValidation.success)
    return sendInputValidationError(res, "body", bodyValidation.error);
  const body = bodyValidation.data;

  if (!req.userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  (await createShoppingList({ ...body, owner: req.userId, archived: false }))
    .mapErr((err) => {
      switch (err) {
        case "unknown":
          return res.sendStatus(500);
      }
    })
    .map((createdShoppingList) =>
      res.status(StatusCodes.CREATED).json(createdShoppingList),
    );
};

// TODO: paging
export const listShoppingListsHandler: Handler = async (req, res) => {
  if (!req.userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  (await listShoppingListsForUser(req.userId))
    .mapErr((err) => {
      switch (err) {
        case "unknown":
          return res.sendStatus(500);
      }
    })
    .map((shoppingLists) => res.json(shoppingLists));
};

const getShoppingListParamsSchema = z.object({
  id: z.string(),
});
export const getShoppingListHandler: Handler = async (req, res) => {
  const paramsValidation = getShoppingListParamsSchema.safeParse(req.params);
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);
  const params = paramsValidation.data;

  if (!req.userId || !(await canAccessList(req.userId, params.id))) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  (await getShoppingList(params.id))
    .mapErr((err) => {
      switch (err) {
        case "notFound":
          return res.sendStatus(404);
        case "unknown":
          return res.sendStatus(500);
      }
    })
    .map((shoppingList) => res.json(shoppingList));
};

const deleteShoppingListParamsSchema = z.object({
  id: z.string(),
});
export const deleteShoppingListHandler: Handler = async (req, res) => {
  const paramsValidation = deleteShoppingListParamsSchema.safeParse(req.params);
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);
  const params = paramsValidation.data;

  if (!req.userId || !(await isOwnerOfList(req.userId, params.id))) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  (await deleteShoppingList(params.id))
    .mapErr((err) => {
      switch (err) {
        case "notFound":
          return res.sendStatus(404);
        case "unknown":
          return res.sendStatus(500);
      }
    })
    .map(() => res.sendStatus(StatusCodes.OK));
};
