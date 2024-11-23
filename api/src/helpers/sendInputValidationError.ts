import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

export const sendInputValidationError = (
  res: Response,
  inputName: string,
  error: ZodError,
) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    input: inputName,
    issues: error.issues,
  });
};
