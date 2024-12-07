import { RequestHandler } from "express";
import jwt, { Jwt } from "jsonwebtoken";
import { env } from "../env";

export const parseAuthorization: RequestHandler = (req, _res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || typeof authorization !== "string") return next();

  const authorizationWithoutBearer = authorization.replace(/^Bearer\s/, "");

  try {
    const decoded = jwt.verify(
      authorizationWithoutBearer,
      env.TOKEN_PRIVATE_KEY,
    ) as Jwt & Record<any, any>;
    if (typeof decoded.userId === "string") req.userId = decoded.userId;
  } catch {}

  next();
};
