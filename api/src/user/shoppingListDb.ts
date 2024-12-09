import { Err, Ok, Result } from "@thames/monads";
import mongoose, { Error, ObjectId, Schema } from "mongoose";
import { User, UserDb, userToDomain } from "./userDb";

export type ShoppingList = {
  id: string;
  name: string;
  owner: User;
};

export type ShoppingListDetail = ShoppingList & {
  items: {
    name: string;
    completed: boolean;
    archived: boolean;
  }[];
};

type ShoppingListDb = {
  _id: ObjectId;
  name: string;
  owner: UserDb;
  invitees: UserDb[];
  items: {
    name: string;
    completed: boolean;
    archived: boolean;
  }[];
};

const shoppingListSchema = new Schema<ShoppingListDb>(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    invitees: [{ type: Schema.Types.ObjectId, unique: true, ref: "user" }],
    items: [
      {
        type: {
          name: { type: String, required: true },
          completed: { type: Boolean, required: true },
          archived: { type: Boolean, required: true },
        },
        required: true,
      },
    ],
  },
  { selectPopulatedPaths: true },
);

const ShoppingListModel = mongoose.model("shopping-list", shoppingListSchema);

const shoppingListToDomain = (shoppingList: ShoppingListDb): ShoppingList => ({
  id: shoppingList._id.toString(),
  name: shoppingList.name,
  owner: userToDomain(shoppingList.owner),
});

const shoppingListDetailToDomain = (
  shoppingList: ShoppingListDb,
): ShoppingListDetail => ({
  id: shoppingList._id.toString(),
  name: shoppingList.name,
  owner: userToDomain(shoppingList.owner),
  items: shoppingList.items,
});

export type CreateShoppingListError = "unknown";
export const createShoppingList = (
  shoppingList: Omit<ShoppingList, "id" | "owner"> & { owner: string },
): Promise<Result<ShoppingList, CreateShoppingListError>> =>
  new ShoppingListModel(shoppingList)
    .save()
    .then((shoppingList) => Ok(shoppingListToDomain(shoppingList)))
    .catch((err) => {
      console.error(err);
      return Err("unknown");
    });

export type ListShoppingListsByOwnerError = "unknown";
export const listShoppingListsForUser = (
  userId: string,
): Promise<Result<ShoppingList[], ListShoppingListsByOwnerError>> =>
  ShoppingListModel.find(
    { $or: [{ owner: userId }, { invitees: userId }] },
    { _id: true, name: true, owner: true },
  )
    .then((shoppingLists) => Ok(shoppingLists.map(shoppingListToDomain)))
    .catch((err) => {
      console.error(err);
      return Err(err);
    });

export type GetShoppingListError = "notFound" | "unknown";
export const getShoppingList = async (
  id: string,
): Promise<Result<ShoppingList, GetShoppingListError>> => {
  try {
    const shoppingList = await ShoppingListModel.findOne(
      { _id: id },
      { id: true, name: true, owner: true },
      { populate: "owner" },
    );
    if (!shoppingList) return Err("notFound");
    return Ok(shoppingListToDomain(shoppingList));
  } catch (err) {
    console.error(err);
    if (err instanceof Error.CastError && err.path === "_id") {
      return Err("notFound");
    }
    return Err("unknown");
  }
};

export type GetShoppingListDetailError = "notFound" | "unknown";
export const getShoppingListDetail = async (
  id: string,
): Promise<Result<ShoppingListDetail, GetShoppingListDetailError>> => {
  try {
    const shoppingList = await ShoppingListModel.findOne(
      { _id: id },
      { id: true, items: true, name: true, owner: true },
      { populate: "owner" },
    );
    if (!shoppingList) return Err("notFound");
    return Ok(shoppingListDetailToDomain(shoppingList));
  } catch (err) {
    console.error(err);
    if (err instanceof Error.CastError && err.path === "_id") {
      return Err("notFound");
    }
    return Err("unknown");
  }
};

export type DeleteShoppingListEror = "notFound" | "unknown";
export const deleteShoppingList = async (
  id: string,
): Promise<Result<null, DeleteShoppingListEror>> => {
  try {
    const res = await ShoppingListModel.deleteOne({ _id: id });
    if (res.deletedCount === 0) return Err("notFound");
    return Ok(null);
  } catch (err) {
    console.error(err);
    if (err instanceof Error.CastError && err.path === "_id") {
      return Err("notFound");
    }
    return Err("unknown");
  }
};

export type GetShoppingListInviteesError = "notFound" | "unknown";
export const getShoppingListInvitees = async (
  id: string,
): Promise<Result<string[], GetShoppingListInviteesError>> => {
  try {
    const shoppingList = await ShoppingListModel.findOne(
      { _id: id },
      { invitees: true },
      { populate: "invitees" },
    );
    if (!shoppingList) return Err("notFound");
    return Ok(shoppingList.invitees.map((id) => id.toString()));
  } catch (err) {
    console.error(err);
    if (err instanceof Error.CastError && err.path === "_id") {
      return Err("notFound");
    }
    return Err("unknown");
  }
};

export type GetShoppingListDetailedInviteesError = "notFound" | "unknown";
export const getShoppingListDetailedInvitees = async (
  id: string,
): Promise<Result<User[], GetShoppingListDetailedInviteesError>> => {
  try {
    const shoppingList = await ShoppingListModel.findOne(
      { _id: id },
      { owner: true, invitees: true },
    ).populate("invitees");
    if (!shoppingList) return Err("notFound");
    return Ok(shoppingList.invitees.map(userToDomain));
  } catch (err) {
    console.error(err);
    if (err instanceof Error.CastError && err.path === "_id") {
      return Err("notFound");
    }
    return Err("unknown");
  }
};

export type AddInviteeToShoppingListError = "notFound" | "unknown";
export const addInviteeToShoppingList = async (
  shoppingListId: string,
  userId: string,
): Promise<Result<null, AddInviteeToShoppingListError>> => {
  try {
    const res = await ShoppingListModel.updateOne(
      { _id: shoppingListId },
      {
        $addToSet: {
          invitees: userId,
        },
      },
    );
    if (res.matchedCount === 0) return Err("notFound");

    return Ok(null);
  } catch (err) {
    console.error(err);
    return Err("unknown");
  }
};

export type RemoveInviteeToShoppingListError = "notFound" | "unknown";
export const removeInviteeToShoppingList = async (
  shoppingListId: string,
  userId: string,
): Promise<Result<null, RemoveInviteeToShoppingListError>> => {
  try {
    const res = await ShoppingListModel.updateOne(
      { _id: shoppingListId },
      {
        $pull: {
          invitees: userId,
        },
      },
    );
    if (res.matchedCount === 0) return Err("notFound");

    return Ok(null);
  } catch (err) {
    console.error(err);
    return Err("unknown");
  }
};
