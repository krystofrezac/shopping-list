import { Handler } from "express";
import { z } from "zod";
import { sendInputValidationError } from "../helpers/sendInputValidationError";
import { StatusCodes } from "http-status-codes";

const registerUserBodySchema = z.object({
  email: z.string().regex(/.+@.+/),
  password: z.string().min(1),
});
export const registerUserHandler: Handler = (req, res) => {
  const bodyValidation = registerUserBodySchema.safeParse(req.body);
  if (!bodyValidation.success)
    return sendInputValidationError(res, "body", bodyValidation.error);

  res.sendStatus(StatusCodes.CREATED);
};

const loginUserBodySchema = z.object({
  email: z.string().regex(/.+@.+/),
  password: z.string().min(1),
});
export const loginUserHandler: Handler = (req, res) => {
  const bodyValidation = loginUserBodySchema.safeParse(req.body);
  if (!bodyValidation.success)
    return sendInputValidationError(res, "body", bodyValidation.error);

  res.json({
    accessToken: "a",
  });
};
