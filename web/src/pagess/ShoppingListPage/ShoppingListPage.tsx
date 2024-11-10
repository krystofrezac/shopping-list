import { useShoppingListQuery } from "../../api/useShoppingListQuery";
import { DynamicContent, RenderContent } from "../../components/DynamicContent";
import { ShoppingList } from "../../api/types";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
import { H1 } from "../../components/Typography";
import { UserGuard } from "../../components/UserGuard";
import { useState } from "react";
import { ShoppingListItem } from "./ShoppingListItem";
import { CheckBox } from "../../components/CheckBox";
import { ItemEditDialog } from "./ItemEditDialog";
import { CheckBoxFormControl } from "../../components/CheckBoxFormControl";

export const ShoppingListPage = () => {
  const params = { id: "xxx" }; // TODO: useParams();

  const query = useShoppingListQuery({ id: params.id! });

  const [showCompleted, setShowCompleted] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const renderContent: RenderContent<ShoppingList> = (shoppingList) => {
    const items = shoppingList.items.filter(
      (item) => showCompleted || !item.completed,
    );

    const mappedItems = items.map((item, index) => (
      <ShoppingListItem
        key={index}
        index={index}
        item={item}
        shoppingListId={shoppingList.id}
        onEdit={() => setEditingItemIndex(index)}
      />
    ));

    return (
      <>
        <ItemEditDialog
          index={editingItemIndex ?? -1}
          shoppingListId={shoppingList.id}
          item={shoppingList.items[editingItemIndex ?? -1]}
          onClose={() => setEditingItemIndex(null)}
        />
        <div className="flex gap-4 items-center">
          <div className="grow">
            <H1>{shoppingList.name}</H1>
            <p>{`Owner: ${shoppingList.owner.email}`}</p>
          </div>
          <div className="flex gap-2 items-center">
            <UserGuard userId={shoppingList.owner.id}>
              <IconButton iconName="EllipsisVerticalIcon" />
            </UserGuard>
            <Button variant="primary">Create new item</Button>
          </div>
        </div>
        <div className="divider" />
        <div className="mt-6">
          <CheckBoxFormControl label="Show completed">
            <CheckBox
              checked={showCompleted}
              onChange={() => setShowCompleted((prev) => !prev)}
            />
          </CheckBoxFormControl>
          <div className="mt-2 flex flex-col gap-2">{mappedItems}</div>
        </div>
      </>
    );
  };

  return (
    <>
      <DynamicContent {...query} renderContent={renderContent} />
    </>
  );
};
