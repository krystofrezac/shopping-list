import { Err, Ok, Result } from "@thames/monads";
import mongoose, { Schema } from "mongoose";

export type User = {
  id: string;
  email: string;
  hashedPassword: string;
};

const UserModel = mongoose.model(
  "user",
  new Schema({
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
  }),
);

export type CreateUserError = "emailAlreadyExists" | "unknown";
export const createUser = (
  user: Omit<User, "id">,
): Promise<Result<User, CreateUserError>> =>
  new UserModel(user)
    .save()
    .then((res) =>
      Ok({
        id: res.id,
        email: res.email,
        hashedPassword: res.hashedPassword,
      }),
    )
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) return Err("emailAlreadyExists");
      return Err("unknown");
    });

export type FindUserByEmailError = "notFound" | "unknown";
export const findUserByEmail = async (
  email: String,
): Promise<Result<User, FindUserByEmailError>> => {
  try {
    const res = await UserModel.findOne({ email: email });
    if (!res) return Err("notFound");

    return Ok({
      id: res.id,
      email: res.email,
      hashedPassword: res.hashedPassword,
    });
  } catch (err) {
    console.log(err);
    return Err("unknown");
  }
};
