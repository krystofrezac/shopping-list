import { Err, Ok, Result } from "@thames/monads";
import mongoose, { ObjectId, Schema } from "mongoose";

export type User = {
  id: string;
  email: string;
  hashedPassword?: string;
};

export type UserDb = {
  _id: ObjectId;
  email: string;
  hashedPassword: string;
};

const UserModel = mongoose.model<UserDb>(
  "user",
  new Schema({
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true, select: false },
  }),
);

export const userToDomain = (user: UserDb): User => ({
  id: user._id.toString(),
  email: user.email,
  hashedPassword: user.hashedPassword,
});

export type CreateUserError = "emailAlreadyExists" | "unknown";
export const createUser = (
  user: Omit<User, "id">,
): Promise<Result<User, CreateUserError>> =>
  new UserModel(user)
    .save()
    .then((res) => Ok(userToDomain(res)))
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) return Err("emailAlreadyExists");
      return Err("unknown");
    });

export type FindUserByEmailError = "notFound" | "unknown";
export const findUserByEmail = async (
  email: String,
  incluedHashedPassword = false,
): Promise<Result<User, FindUserByEmailError>> => {
  try {
    const query = UserModel.findOne({ email: email });
    if (incluedHashedPassword) query.select("hashedPassword");
    const res = await query;
    if (!res) return Err("notFound");

    return Ok(userToDomain(res));
  } catch (err) {
    console.log(err);
    return Err("unknown");
  }
};
