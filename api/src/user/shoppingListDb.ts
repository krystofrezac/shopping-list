import { Err, Ok, Result } from "@thames/monads";
import mongoose, { Error, ObjectId, Schema } from "mongoose";

export type ShoppingList = {
  id: string;
  name: string;
  ownerId: string;
};

export type ShoppingListDetail = ShoppingList & {
  inviteeIds: string[];
  items: {
    name: string;
    completed: boolean;
    archived: boolean;
  }[];
};

type ShoppingListDb = {
  id: ObjectId;
  name: string;
  ownerId: ObjectId;
  inviteeIds: string[];
  items: {
    name: string;
    completed: boolean;
    archived: boolean;
  }[];
};

const shoppingListSchema = new Schema<ShoppingListDb>({
  name: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
  inviteeIds: [{ type: Schema.Types.ObjectId, ref: "user" }],
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
});

const ShoppingListModel = mongoose.model("shopping-list", shoppingListSchema);

const shoppingListToDomain = (shoppingList: ShoppingListDb): ShoppingList => ({
  id: shoppingList.id.toString(),
  name: shoppingList.name,
  ownerId: shoppingList.ownerId.toString(),
});

const shoppingListDetailToDomain = (
  shoppingList: ShoppingListDb,
): ShoppingListDetail => ({
  id: shoppingList.id.toString(),
  name: shoppingList.name,
  ownerId: shoppingList.ownerId.toString(),
  inviteeIds: shoppingList.inviteeIds.map((id) => id.toString()),
  items: shoppingList.items,
});

export type CreateShoppingListError = "unknown";
export const createShoppingList = (
  shoppingList: Omit<ShoppingList, "id">,
): Promise<Result<ShoppingList, CreateShoppingListError>> =>
  new ShoppingListModel(shoppingList)
    .save()
    .then((shoppingList) => Ok(shoppingListToDomain(shoppingList)))
    .catch((err) => {
      console.error(err);
      return Err("unknown");
    });

export type ListShoppingListsByOwnerError = "unknown";
export const listShoppingListsByOwner = (
  ownerId: string,
): Promise<Result<ShoppingList[], ListShoppingListsByOwnerError>> =>
  ShoppingListModel.find({ ownerId }, { id: true, name: true, ownerId: true })
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
      { id: true, name: true, ownerId: true },
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
    const shoppingList = await ShoppingListModel.findOne({ _id: id });
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

export type GetShoppingListInviteesError = "notFound" | "unknown";
export const getShoppingListInvitees = async (
  id: string,
): Promise<Result<string[], GetShoppingListInviteesError>> => {
  try {
    const shoppingList = await ShoppingListModel.findOne(
      { _id: id },
      { inviteeIds: true },
    );
    if (!shoppingList) return Err("notFound");
    return Ok(shoppingList.inviteeIds.map((id) => id.toString()));
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
