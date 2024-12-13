import { useShoppingListsQuery } from "../../api/useShoppingListsQuery";
import { DynamicContent, RenderContent } from "../../components/DynamicContent";
import { ShoppingListOverview } from "../../api/types";
import { Button } from "../../components/Button";
import { ShoppingList } from "./ShoppingList";
import { ListCreateDialog } from "./ListCreateDialog";
import { useState } from "react";
import { ListDeleteDialog } from "./ListDeleteDialog";
import { CheckBoxFormControl } from "../../components/CheckBoxFormControl";
import { CheckBox } from "../../components/CheckBox";

export const ShoppingListsPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | undefined>(
    undefined,
  );
  const [showArchived, setShowArchived] = useState(false);

  const shoppingListsQuery = useShoppingListsQuery({
    includeArchived: showArchived,
  });

  const renderContent: RenderContent<ShoppingListOverview[]> = (
    shoppingLists,
  ) => {
    const mappedLists = shoppingLists
      .filter((shoppingList) => !shoppingList.archived || showArchived) // Because of local cache, this is the easiest solution
      .map((shoppingList) => (
        <ShoppingList
          key={shoppingList.id}
          shoppingList={shoppingList}
          onDelete={() => setDeletingItemId(shoppingList.id)}
        />
      ));

    return (
      <>
        <ListCreateDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
        />
        <ListDeleteDialog
          shoppingListId={deletingItemId}
          onClose={() => setDeletingItemId(undefined)}
        />
        <div>
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Create new shopping list
            </Button>
          </div>
          <CheckBoxFormControl label="Show archived">
            <CheckBox
              checked={showArchived}
              onChange={() => setShowArchived((prev) => !prev)}
            />
          </CheckBoxFormControl>
          <div className="mt-2 flex flex-col gap-2">
            {shoppingLists.length === 0 && (
              <div className="text-center text-lg">
                No available shopping lists
              </div>
            )}
            {mappedLists}
          </div>
        </div>
      </>
    );
  };
  return (
    <DynamicContent
      {...shoppingListsQuery}
      data={shoppingListsQuery.data?.shoppingLists}
      renderContent={renderContent}
    />
  );
};
