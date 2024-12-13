import { useParams } from "react-router-dom";
import { ShoppingListHeader } from "../../components/ShoppingListHeader";
import { useShoppingListQuery } from "../../api/useShoppingListQuery";
import { DynamicContent, RenderContent } from "../../components/DynamicContent";
import { Card, CardBody } from "../../components/Card";
import { IconButton } from "../../components/IconButton";
import { Button } from "../../components/Button";
import { InviteUserDialog } from "./InviteUserDialog";
import { useState } from "react";
import { RemoveUserDialog } from "./RemoveUserDialog";
import { useShoppingListInviteesQuery } from "../../api/useShoppingListInviteesQuery";
import {
  JoinedQueriesRenderContentData,
  joinQueries,
} from "../../api/joinQueries";

export const InviteesPage = () => {
  const params = useParams<{ id: string }>();

  const shoppingListQuery = useShoppingListQuery({ id: params.id! });
  const inviteesQuery = useShoppingListInviteesQuery({ id: params.id! });
  const joinedQueries = joinQueries({
    shoppingList: shoppingListQuery,
    invitees: inviteesQuery,
  });

  const [isInvitingUser, setIsInvitingUser] = useState(false);
  const [userIdToRemove, setUserIdToRemove] = useState<string | undefined>(
    undefined,
  );

  const renderContent: RenderContent<
    JoinedQueriesRenderContentData<typeof joinedQueries>
  > = ({ shoppingList, invitees }) => {
    const mappedInvitess = invitees.map((invitee) => (
      <Card key={invitee.id}>
        <CardBody>
          <div className="flex flex-row items-center gap-4">
            <p className="text-lg">{invitee.email}</p>
            <div className="flex flex row gap-1">
              <IconButton
                iconName="TrashIcon"
                size="sm"
                color="error"
                onClick={() => setUserIdToRemove(invitee.id)}
              />
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
        <RemoveUserDialog
          userId={userIdToRemove}
          shoppingListId={shoppingList.id}
          onClose={() => setUserIdToRemove(undefined)}
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

  return <DynamicContent {...joinedQueries} renderContent={renderContent} />;
};
