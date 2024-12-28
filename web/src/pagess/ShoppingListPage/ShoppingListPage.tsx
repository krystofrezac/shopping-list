import { useShoppingListQuery } from "../../api/useShoppingListQuery";
import { DynamicContent, RenderContent } from "../../components/DynamicContent";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
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
import { Link, useParams } from "react-router-dom";
import { ShoppingListHeader } from "../../components/ShoppingListHeader";
import { ItemCreateDialog } from "./ItemCreateDialog";
import { useShoppingListItemsQuery } from "../../api/useShoppingListItemsQuery";
import {
  JoinedQueriesRenderContentData,
  joinQueries,
} from "../../api/joinQueries";

export const ShoppingListPage = () => {
  const params = useParams<{ id: string }>();
  const userContext = useUserContext();

  const [showCompleted, setShowCompleted] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | undefined>(
    undefined,
  );
  const [deletingItemId, setDeletingItemId] = useState<string | undefined>(
    undefined,
  );
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isCreateItemDialogOpen, setIsCreateItemDialogOpen] = useState(false);

  const shoppingListQuery = useShoppingListQuery({ id: params.id! });
  const itemsQuery = useShoppingListItemsQuery({
    id: params.id!,
    includeCompleted: showCompleted,
  });
  const joinedQueries = joinQueries({
    shoppingList: shoppingListQuery,
    items: itemsQuery,
  });

  const renderContent: RenderContent<
    JoinedQueriesRenderContentData<typeof joinedQueries>
  > = ({ shoppingList, items }) => {
    const isUserOwner = userContext.user?.id === shoppingList.owner.id;

    const mappedItems = items
      .map((item) => {
        if (item.archived) return null;
        if (!showCompleted && item.completed) return null;

        return (
          <ShoppingListItem
            key={item.id}
            item={item}
            shoppingListId={shoppingList.id}
            onEdit={() => setEditingItemId(item.id)}
            onDelete={() => setDeletingItemId(item.id)}
          />
        );
      })
      .filter(Boolean);

    return (
      <>
        <ItemEditDialog
          shoppingListId={shoppingList.id}
          item={items.find((item) => item.id === editingItemId)}
          onClose={() => setEditingItemId(undefined)}
        />
        <ItemDeleteDialog
          shoppingList={shoppingList}
          item={items.find((item) => item.id === deletingItemId)}
          onClose={() => setDeletingItemId(undefined)}
        />
        <ListRenameDialog
          shoppingList={isRenameDialogOpen ? shoppingList : undefined}
          onClose={() => setIsRenameDialogOpen(false)}
        />
        <ItemCreateDialog
          isOpen={isCreateItemDialogOpen}
          shoppingListId={shoppingList.id}
          onClose={() => setIsCreateItemDialogOpen(false)}
        />

        <ShoppingListHeader
          shoppingList={shoppingList}
          backText="Back to shopping lists"
          backPath="/"
          rightElement={
            <div className="flex flex-wrap gap-2 items-center justify-end">
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
                      id: "invitees",
                      isHidden: !isUserOwner,
                      element: (
                        <Link
                          to={`/shopping-lists/${params.id}/invitees`}
                          className="grow text-left"
                          onClick={() => setIsRenameDialogOpen(true)}
                        >
                          Invitees managment
                        </Link>
                      ),
                    },
                    {
                      id: "rename",
                      isHidden: isUserOwner,
                      element: (
                        <button className="grow text-left">Leave</button>
                      ),
                    },
                  ]}
                />
              </Dropdown>
              <Button
                variant="primary"
                onClick={() => setIsCreateItemDialogOpen(true)}
              >
                Create new item
              </Button>
            </div>
          }
        />
        <div>
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
      <DynamicContent {...joinedQueries} renderContent={renderContent} />
    </>
  );
};
