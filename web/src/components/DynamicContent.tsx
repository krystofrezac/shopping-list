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
  if (isPending)
    return (
      <div className="flex justify-center">
        {" "}
        <Spinner />
      </div>
    );

  if (error || data === undefined)
    return (
      <div className="flex justify-center text-xl">
        Unexpected error occured
      </div>
    );

  return renderContent(data);
};
