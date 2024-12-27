import { Handler } from "express";
import { z } from "zod";
import { sendInputValidationError } from "../helpers/sendInputValidationError";
import { StatusCodes } from "http-status-codes";
import { canAccessList } from "../helpers/canAccessList";
import {
  createShoppingList,
  updateShoppingList,
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

export const listShoppingListsQuerySchema = z.object({
  limit: z.coerce.number().int().default(10),
  page: z.coerce.number().int().default(0),
  includeArchived: z
    .string()
    .toLowerCase()
    .transform((x) => x === "true")
    .pipe(z.boolean()),
});
export const listShoppingListsHandler: Handler = async (req, res) => {
  const queryValidation = listShoppingListsQuerySchema.safeParse(req.query);
  if (!queryValidation.success)
    return sendInputValidationError(res, "query", queryValidation.error);
  const query = queryValidation.data;

  if (!req.userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  (
    await listShoppingListsForUser(
      req.userId,
      query.limit + 1,
      query.page,
      query.includeArchived,
    )
  )
    .mapErr((err) => {
      switch (err) {
        case "unknown":
          return res.sendStatus(500);
      }
    })
    .map((shoppingListsPlusOne) => {
      const hasNextPage = shoppingListsPlusOne.length > query.limit;
      const shoppingLists = shoppingListsPlusOne.slice(0, query.limit);

      return res.json({
        hasNextPage,
        shoppingLists,
      });
    });
};

const getShoppingListParamsSchema = z.object({
  id: z.string(),
});
export const getShoppingListHandler: Handler = async (req, res) => {
  const paramsValidation = getShoppingListParamsSchema.safeParse(req.params);
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);
  const params = paramsValidation.data;

  if (!req.userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }
  if (!(await canAccessList(req.userId, params.id))) {
    res.sendStatus(StatusCodes.FORBIDDEN);
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

const updateShoppingListParamsSchema = z.object({
  id: z.string(),
});
const updateShoppingListBodySchema = z.object({
  name: z.string().min(1).optional(),
  archived: z.boolean().optional(),
});
export const updateShoppingListHandler: Handler = async (req, res) => {
  const paramsValidation = updateShoppingListParamsSchema.safeParse(req.params);
  if (!paramsValidation.success)
    return sendInputValidationError(res, "params", paramsValidation.error);
  const params = paramsValidation.data;

  const bodyValidation = updateShoppingListBodySchema.safeParse(req.body);
  if (!bodyValidation.success)
    return sendInputValidationError(res, "body", bodyValidation.error);
  const body = bodyValidation.data;

  if (!req.userId) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }
  if (!(await isOwnerOfList(req.userId, params.id))) {
    res.sendStatus(StatusCodes.FORBIDDEN);
    return;
  }

  (await updateShoppingList({ id: params.id, ...body }))
    .mapErr((err) => {
      switch (err) {
        case "notFound":
          return res.sendStatus(404);
        case "unknown":
          return res.sendStatus(500);
      }
    })
    .map((updated) => res.json(updated));
};
