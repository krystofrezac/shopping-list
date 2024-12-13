import { Err, Ok, Result } from "@thames/monads";
import mongoose, { Error, ObjectId, Schema } from "mongoose";
import { User, UserDb, userToDomain } from "./userDb";

export type ShoppingList = {
  id: string;
  name: string;
  owner: User;
  archived: boolean;
};

export type ShoppingListItem = {
  id: string;
  name: string;
  completed: boolean;
};

type ShoppingListItemDb = {
  id: ObjectId;
  name: string;
  completed: boolean;
};

type ShoppingListDb = {
  _id: ObjectId;
  name: string;
  owner: UserDb;
  invitees: UserDb[];
  items: ShoppingListItemDb[];
  archived: boolean;
};

const shoppingListSchema = new Schema<ShoppingListDb>(
  {
    name: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
      index: true,
    },
    invitees: [
      { type: Schema.Types.ObjectId, unique: true, ref: "user", index: true },
    ],
    archived: { type: Boolean },
    items: [
      {
        type: {
          id: { type: Schema.Types.ObjectId, required: true, auto: true },
          name: { type: String, required: true },
          completed: { type: Boolean, required: true },
        },
        required: true,
      },
    ],
  },
  { selectPopulatedPaths: true },
);
shoppingListSchema.index({ owner: "asc", invitees: "asc" });

const ShoppingListModel = mongoose.model("shopping-list", shoppingListSchema);

const shoppingListToDomain = (shoppingList: ShoppingListDb): ShoppingList => ({
  id: shoppingList._id.toString(),
  name: shoppingList.name,
  owner: userToDomain(shoppingList.owner),
  archived: shoppingList.archived,
});

const shoppingListItemToDoman = (
  item: ShoppingListItemDb,
): ShoppingListItem => ({
  id: item.id.toString(),
  completed: item.completed,
  name: item.name,
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
  limit: number,
  page: number,
  inludeArchived: boolean
): Promise<Result<ShoppingList[], ListShoppingListsByOwnerError>> =>
  ShoppingListModel.find(
    {
      $and: [
        { $or: [{ owner: userId }, { invitees: userId }] },
        ...(!inludeArchived ? [{ archived: false }] : [])
      ]
    },
    { _id: true, name: true, owner: true, archived: true },
    { skip: page * limit, limit },
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
      { id: true, name: true, owner: true, archived: true },
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

export type GetShoppingListItemsError = "notFound" | "unknown";
export const getShoppingListItems = async (
  id: string,
  includeCompleted: boolean,
): Promise<Result<ShoppingListItem[], GetShoppingListItemsError>> => {
  try {
    const items = await ShoppingListModel.aggregate<ShoppingListItemDb>([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $unwind: "$items" },
      ...(includeCompleted ? [] : [{ $match: { "items.completed": false } }]),
      { $replaceRoot: { newRoot: "$items" } },
    ]);
    return Ok(items.map(shoppingListItemToDoman));
  } catch (err) {
    console.error(err);
    if (err instanceof Error.CastError && err.path === "_id") {
      return Err("notFound");
    }
    return Err("unknown");
  }
};

export type UpdateShoppingListEror = "notFound" | "unknown";
export const updateShoppingList = async (
  shoppingList: Pick<ShoppingList, "id"> & Partial<Pick<ShoppingList, "archived" | "name">>
): Promise<Result<ShoppingList, UpdateShoppingListEror>> => {
  try {
    const updated = await ShoppingListModel.findOneAndUpdate({ _id: shoppingList.id, }, { name: shoppingList.name, archived: shoppingList.archived },
      { projection: { id: true, name: true, owner: true, archived: true } },
    );
    if (!updated) return Err("notFound");

    if (shoppingList.archived) updated.archived = shoppingList.archived
    if (shoppingList.name) updated.name = shoppingList.name
    return Ok(shoppingListToDomain(updated));
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
    if (err instanceof Error.CastError && err.path === "_id") {
      return Err("notFound");
    }
    return Err("unknown");
  }
};

export type RemoveInviteeFromShoppingListError = "notFound" | "unknown";
export const removeInviteeFromShoppingList = async (
  shoppingListId: string,
  userId: string,
): Promise<Result<null, RemoveInviteeFromShoppingListError>> => {
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
    if (err instanceof Error.CastError && err.path === "_id") {
      return Err("notFound");
    }
    return Err("unknown");
  }
};

export type AddItemToShoppingListError = "notFound" | "unknown";
export const addItemToShoppingList = async (
  shoppingListId: string,
  item: Omit<ShoppingListItem, "id">,
): Promise<Result<ShoppingListItem, AddItemToShoppingListError>> => {
  try {
    const res = await ShoppingListModel.updateOne(
      { _id: shoppingListId },
      {
        $push: {
          items: item,
        },
      },
    );
    if (res.matchedCount === 0) return Err("notFound");

    const updated = await ShoppingListModel.findById(shoppingListId);
    if (!updated) return Err("unknown");

    const lastItem = updated.items.at(-1);
    if (!lastItem) return Err("unknown");

    return Ok(shoppingListItemToDoman(lastItem));
  } catch (err) {
    console.error(err);
    if (err instanceof Error.CastError && err.path === "_id") {
      return Err("notFound");
    }
    return Err("unknown");
  }
};

export type UpdateItemInShoppingListError = "notFound" | "unknown";
export const updateItemInShoppingList = async (
  shoppingListId: string,
  item: ShoppingListItem,
): Promise<Result<ShoppingListItem, UpdateItemInShoppingListError>> => {
  try {
    const res = await ShoppingListModel.updateOne(
      { _id: shoppingListId, "items.id": item.id },
      {
        $set: {
          "items.$": item,
        },
      },
    );
    if (res.matchedCount === 0) return Err("notFound");

    const updated = await ShoppingListModel.findById(shoppingListId);
    if (!updated) return Err("unknown");

    return Ok(item);
  } catch (err) {
    console.error(err);
    if (err instanceof Error.CastError && err.path === "_id") {
      return Err("notFound");
    }
    return Err("unknown");
  }
};

export type DeleteItemInShoppingListError = "notFound" | "unknown";
export const deleteItemInShoppingList = async (
  shoppingListId: string,
  itemId: string,
): Promise<Result<null, DeleteItemInShoppingListError>> => {
  try {
    const res = await ShoppingListModel.updateOne(
      { _id: shoppingListId },
      {
        $pull: {
          items: { id: itemId },
        },
      },
    );
    if (res.matchedCount === 0) return Err("notFound");

    const updated = await ShoppingListModel.findById(shoppingListId);
    if (!updated) return Err("unknown");

    return Ok(null);
  } catch (err) {
    console.error(err);
    if (err instanceof Error.CastError && err.path === "_id") {
      return Err("notFound");
    }
    return Err("unknown");
  }
};
