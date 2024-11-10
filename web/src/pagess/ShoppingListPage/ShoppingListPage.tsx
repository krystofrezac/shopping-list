import { useShoppingListQuery } from '../../api/useShoppingListQuery'
import { useParams } from 'react-router-dom'
import { DynamicContent, RenderContent } from '../../components/DynamicContent'
import { ShoppingList } from '../../api/types'
import { Button } from '../../components/Button'
import { IconButton } from '../../components/IconButton'
import { H1 } from '../../components/Typography'
import { Card, CardBody } from '../../components/Card'

export const ShoppingListPage = () => {
  const params = useParams()

  const query = useShoppingListQuery({ id: params.id! })

  const renderContent: RenderContent<ShoppingList> = (data) => {
    const mappedItems = data.items.map((item, index) => (
      <Card key={index}>
        <CardBody>
          <div className="flex flex-row items-center gap-4">
            <input type="checkbox" checked={item.completed} className={`checkbox ${item.completed ? "checkbox-primary" : ""}`} />
            <p className="text-lg">
              {item.name}
            </p>
          </div>
        </CardBody>
      </Card>
    ))

    return (
      <>
        <div className="flex gap-4 items-center">
          <div className="grow">
            <H1>
              {data.name}
            </H1>
            <p>
              {`Owner: ${data.owner.email}`}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <IconButton iconName='EllipsisVerticalIcon' />
            <Button variant='primary'>
              Create new item
            </Button>
          </div>
        </div>
        <div className="divider" />
        <div className='mt-8 flex flex-col gap-2'>
          {mappedItems}
        </div>
      </>
    )
  }

  return (
    <DynamicContent
      {...query}
      renderContent={renderContent}
    />
  )
}
