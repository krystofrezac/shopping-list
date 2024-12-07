import { Handler } from "express";

export const handler =
  (underlyingHandler: Handler): Handler =>
  async (req, res, next) => {
    try {
      await underlyingHandler(req, res, next);
    } catch (e) {
      next(e);
    }
  };
