import { createRequest, createResponse } from "node-mocks-http";
import { loginUserHandler, registerUserHandler } from "./userHandler";
import { expect } from "vitest";
import { StatusCodes } from "http-status-codes";

export const createTestUser = async (email: string): Promise<string> => {
  const registerReq = createRequest({
    body: {
      email,
      password: "abc",
    },
  });
  const registerRes = createResponse();
  await registerUserHandler(registerReq, registerRes, () => null);
  expect(registerRes.statusCode).toBe(StatusCodes.CREATED);

  const loginReq = createRequest({
    body: {
      email,
      password: "abc",
    },
  });
  const loginRes = createResponse();
  await loginUserHandler(loginReq, loginRes, () => null);
  expect(loginRes.statusCode).toBe(StatusCodes.OK);
  const { userId } = loginRes._getJSONData();
  expect(typeof userId).toBe("string");
  return userId;
};
