import { useParams } from "react-router-dom";
import { ShoppingListHeader } from "../../components/ShoppingListHeader";
import { useShoppingListQuery } from "../../api/useShoppingListQuery";
import { DynamicContent, RenderContent } from "../../components/DynamicContent";
import { ShoppingList } from "../../api/types";
import { Card, CardBody } from "../../components/Card";
import { IconButton } from "../../components/IconButton";
import { Button } from "../../components/Button";
import { InviteUserDialog } from "./InviteUserDialog";
import { useState } from "react";

export const InviteesPage = () => {
  const params = useParams<{ id: string }>();
  const query = useShoppingListQuery({ id: params.id! });

  const [isInvitingUser, setIsInvitingUser] = useState(false);

  const renderContent: RenderContent<ShoppingList> = (shoppingList) => {
    const mappedInvitess = shoppingList.invitees.map((invitee) => (
      <Card key={invitee.id}>
        <CardBody>
          <div className="flex flex-row items-center gap-4">
            <p className="text-lg">{invitee.email}</p>
            <div className="flex flex row gap-1">
              <IconButton iconName="TrashIcon" size="sm" color="error" />
            </div>
          </div>
        </CardBody>
      </Card>
    ));

    return (
      <>
        <InviteUserDialog
          isOpen={isInvitingUser}
          shoppingListId={shoppingList.id}
          onClose={() => setIsInvitingUser(false)}
        />

        <ShoppingListHeader
          shoppingList={shoppingList}
          backText="Back to shopping list"
          backPath={`/shopping-lists/${params.id}`}
          namePrefix="Invitees to "
          rightElement={
            <Button variant="primary" onClick={() => setIsInvitingUser(true)}>
              Invite user
            </Button>
          }
        />
        <div className="flex flex-col gap-2">{mappedInvitess}</div>
      </>
    );
  };

  return <DynamicContent {...query} renderContent={renderContent} />;
};
