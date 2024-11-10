import { useShoppingListQuery } from "../../api/useShoppingListQuery";
import { DynamicContent, RenderContent } from "../../components/DynamicContent";
import { ShoppingList } from "../../api/types";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
import { H1 } from "../../components/Typography";
import { Card, CardBody } from "../../components/Card";
import { UserGuard } from "../../components/UserGuard";
import { useUpdateShoppingListItemMutation } from "../../api/useUpdateShoppingListItemMutation";
import { useState } from "react";
import { CheckBox } from "../../components/Checkbox";
import { CheckBoxFormControl } from "../../components/CheckBoxFormControl";
import { useGetUpdateItemQueryCache } from "./useGetUpdateItemQueryCache";
import { Spinner } from "../../components/Spinner";

export const ShoppingListPage = () => {
  const params = { id: "xxx" }; // TODO: useParams();

  const query = useShoppingListQuery({ id: params.id! });
  const {
    mutate: updateShoppingListItem,
    isPending: isUpdateShoppingListItemPending,
    variables: updateShoppingListItemVariables,
  } = useUpdateShoppingListItemMutation();

  const updateImteQueryCache = useGetUpdateItemQueryCache();
  const [showCompleted, setShowCompleted] = useState(false);

  const renderContent: RenderContent<ShoppingList> = (shoppingList) => {
    const items = shoppingList.items.filter(
      (item) => showCompleted || !item.completed,
    );

    const mappedItems = items.map((item, index) => {
      const handleCompletedChange = () => {
        updateShoppingListItem(
          {
            shoppingListId: shoppingList.id,
            shoppingListItemIndex: index,
            data: { ...item, completed: !item.completed },
          },
          {
            onSuccess: (newShoppingListItem) =>
              updateImteQueryCache({
                shoppingListId: shoppingList.id,
                itemIndex: index,
                newData: newShoppingListItem,
              }),
          },
        );
      };

      const checkbox =
        index === updateShoppingListItemVariables?.shoppingListItemIndex &&
        isUpdateShoppingListItemPending ? (
          <Spinner />
        ) : (
          <CheckBox checked={item.completed} onChange={handleCompletedChange} />
        );

      return (
        <Card key={index}>
          <CardBody>
            <div className="flex flex-row items-center gap-4">
              <div className="w-6 flex items-center">{checkbox}</div>
              <p className="text-lg">{item.name}</p>
            </div>
          </CardBody>
        </Card>
      );
    });

    return (
      <>
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

  return <DynamicContent {...query} renderContent={renderContent} />;
};
