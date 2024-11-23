import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

export const loggedInGuard: RequestHandler = (req, res, next) => {
  if (req.userId === undefined) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  next();
};
