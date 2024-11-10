import { ReactElement } from "react"

export type RenderContent<TData> = (data: TData) => ReactElement

export type DynamicContentProps<TData> = {
  data: TData | undefined,
  isPending: boolean,
  error: unknown | undefined,
  renderContent: RenderContent<TData>
}

export const DynamicContent = <TData,>({
  data,
  isPending,
  error,
  renderContent
}: DynamicContentProps<TData>) => {
  if (isPending)
    // TODO: spinner
    return "..."

  if (error || data === undefined)
    // TODO: make it nicer
    return "Nastala neočekávaná chyba"

  return renderContent(data)
}
