import { ReactElement } from "react";
import { Spinner } from "./Spinner";

export type RenderContent<TData> = (data: TData) => ReactElement;

export type DynamicContentProps<TData> = {
  data: TData | undefined;
  isPending: boolean;
  error: unknown | undefined;
  renderContent: RenderContent<TData>;
};

export const DynamicContent = <TData,>({
  data,
  isPending,
  error,
  renderContent,
}: DynamicContentProps<TData>) => {
  if (isPending) return <Spinner />;

  if (error || data === undefined)
    // TODO: make it nicer
    return "Unexpected error occured";

  return renderContent(data);
};
