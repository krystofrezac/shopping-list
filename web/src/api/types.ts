export type User = {
  id: string;
  email: string;
};
export type ShoppingListItem = {
  name: string;
  completed: boolean;
  archived: boolean;
};

export type ShoppingList = {
  id: string;
  name: string;
  owner: User;
  invitees: User[];
  items: ShoppingListItem[];
};
