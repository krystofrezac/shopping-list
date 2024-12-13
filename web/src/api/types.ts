export type User = {
  id: string;
  email: string;
};
export type ShoppingListItem = {
  id: string;
  name: string;
  completed: boolean;
  archived: boolean;
};

export type ShoppingList = {
  id: string;
  name: string;
  owner: User;
  archived: boolean;
};

export type ShoppingListOverview = Pick<
  ShoppingList,
  "id" | "name" | "owner" | "archived"
>;
