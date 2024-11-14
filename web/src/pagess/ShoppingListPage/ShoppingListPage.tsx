import { useShoppingListQuery } from "../../api/useShoppingListQuery";
import { DynamicContent, RenderContent } from "../../components/DynamicContent";
import { ShoppingList } from "../../api/types";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
import { H1 } from "../../components/Typography";
import { useState } from "react";
import { ShoppingListItem } from "./ShoppingListItem";
import { CheckBox } from "../../components/CheckBox";
import { ItemEditDialog } from "./ItemEditDialog";
import { CheckBoxFormControl } from "../../components/CheckBoxFormControl";
import { ItemDeleteDialog } from "./ItemDeleteDialog";
import { Dropdown } from "../../components/Dropdown";
import { Menu } from "../../components/Menu";
import { ListRenameDialog } from "./ListRenameDialog";
import { useUserContext } from "../../contexts/UserContext";

export const ShoppingListPage = () => {
  const params = { id: "xxx" }; // TODO: useParams();
  const userContext = useUserContext();

  const query = useShoppingListQuery({ id: params.id! });

  const [showCompleted, setShowCompleted] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | undefined>(
    undefined,
  );
  const [deletingItemIndex, setDeletingItemIndex] = useState<
    number | undefined
  >(undefined);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  const renderContent: RenderContent<ShoppingList> = (shoppingList) => {
    const isUserOwner = userContext.currentUserId === shoppingList.owner.id;
    const items = shoppingList.items.filter(
      (item) => showCompleted || !item.completed,
    );

    const mappedItems = items
      .map((item, index) => {
        if (item.archived) return null;
        if (!showCompleted && item.completed) return null;

        return (
          <ShoppingListItem
            key={index}
            index={index}
            item={item}
            shoppingListId={shoppingList.id}
            onEdit={() => setEditingItemIndex(index)}
            onDelete={() => setDeletingItemIndex(index)}
          />
        );
      })
      .filter(Boolean);

    return (
      <>
        <ItemEditDialog
          index={editingItemIndex ?? -1}
          shoppingListId={shoppingList.id}
          item={shoppingList.items[editingItemIndex ?? -1]}
          onClose={() => setEditingItemIndex(undefined)}
        />
        <ItemDeleteDialog
          index={deletingItemIndex}
          shoppingList={shoppingList}
          item={shoppingList.items[deletingItemIndex ?? -1]}
          onClose={() => setDeletingItemIndex(undefined)}
        />
        <ListRenameDialog
          shoppingList={isRenameDialogOpen ? shoppingList : undefined}
          onClose={() => setIsRenameDialogOpen(false)}
        />

        <div className="flex gap-4 items-center">
          <div className="grow">
            <H1>{shoppingList.name}</H1>
            <p>{`Owner: ${shoppingList.owner.email}`}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Dropdown
              activator={<IconButton iconName="EllipsisVerticalIcon" />}
            >
              <Menu
                items={[
                  {
                    id: "rename",
                    isHidden: !isUserOwner,
                    element: (
                      <button
                        className="grow text-left"
                        onClick={() => setIsRenameDialogOpen(true)}
                      >
                        Rename
                      </button>
                    ),
                  },
                  {
                    id: "rename",
                    isHidden: isUserOwner,
                    element: <button className="grow text-left">Leave</button>,
                  },
                ]}
              />
            </Dropdown>
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
          <div className="mt-2 flex flex-col gap-2">
            {mappedItems}
            {mappedItems.length === 0 && (
              <p className="flex justify-center text-xl">No items</p>
            )}
          </div>
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
