import { RequestHandler } from "express";

export const parseAuthorization: RequestHandler = (req, _res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || typeof authorization !== "string") return next();

  const authorizationWithoutBearer = authorization.replace(/^Bearer\s/, "");
  // TODO: replace with correct implementation when DB ready
  if (authorizationWithoutBearer === "a") req.userId = "1";

  next();
};
