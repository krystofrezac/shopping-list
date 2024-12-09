import { z } from "zod";
import { sendInputValidationError } from "../helpers/sendInputValidationError";
import { StatusCodes } from "http-status-codes";
import { createUser, findUserByEmail } from "./userDb";
import { compare, hash } from "bcrypt";
import { handler } from "../helpers/handler";
import jwt from "jsonwebtoken";
import { env } from "../env";

const registerUserBodySchema = z.object({
  email: z.string().regex(/.+@.+/),
  password: z.string().min(1),
});
export const registerUserHandler = handler(async (req, res) => {
  const bodyValidation = registerUserBodySchema.safeParse(req.body);
  if (!bodyValidation.success)
    return sendInputValidationError(res, "body", bodyValidation.error);
  const body = bodyValidation.data;

  const hashedPassword = await hash(body.password, 10);

  const createResult = await createUser({ email: body.email, hashedPassword });
  createResult.mapErr((err) => {
    switch (err) {
      case "emailAlreadyExists":
        return res.status(StatusCodes.BAD_REQUEST).json("Email aready exists");
      case "unknown":
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  createResult.map(() => res.sendStatus(StatusCodes.CREATED));
});

const loginUserBodySchema = z.object({
  email: z.string().regex(/.+@.+/),
  password: z.string().min(1),
});
export const loginUserHandler = handler(async (req, res) => {
  const bodyValidation = loginUserBodySchema.safeParse(req.body);
  if (!bodyValidation.success)
    return sendInputValidationError(res, "body", bodyValidation.error);
  const body = bodyValidation.data;

  (await findUserByEmail(body.email, true))
    .mapErr((err) => {
      switch (err) {
        case "notFound":
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json("Email or password is invalid");
        case "unknown":
          return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })
    .map(async (foundUser) => {
      const isCorrectPassword = await compare(
        body.password,
        foundUser.hashedPassword!,
      );
      if (!isCorrectPassword)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json("Email or password is invalid");

      const token = jwt.sign(
        {
          userId: foundUser.id,
        },
        env.TOKEN_PRIVATE_KEY,
        {
          expiresIn: "4h",
        },
      );

      return res.json({
        accessToken: token,
      });
    });
});
