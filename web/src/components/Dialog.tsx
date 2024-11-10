import classNames from "classnames";
import { ReactNode, useRef } from "react";

export type DialogProps = {
  children: ReactNode;
  isOpen: boolean;
};
export type DialogTitleProps = {
  children: string;
};
export type DialogBodyProps = {
  children: ReactNode;
};
export type DialogActionsProps = {
  children: ReactNode;
};
export type DialogWithData<T> = {
  data: T | undefined;
  render: (data: T) => ReactNode;
};
export const Dialog = ({ children, isOpen }: DialogProps) => {
  return (
    <dialog
      className={classNames("modal modal-bottom sm:modal-middle", {
        "modal-open": isOpen,
      })}
    >
      <div className="modal-box">{children}</div>
    </dialog>
  );
};

export const DialogTitle = ({ children }: DialogTitleProps) => (
  <h3 className="font-bold text-lg">{children}</h3>
);

export const DialogBody = ({ children }: DialogBodyProps) => (
  <div className="py-4">{children}</div>
);

export const DialogActions = ({ children }: DialogActionsProps) => (
  <div className="modal-action">{children}</div>
);

export const DialogWithData = <T,>({ data, render }: DialogWithData<T>) => {
  const children = useRef<ReactNode>(null);

  if (!!data) {
    children.current = render(data);
  } else {
    // Enough time for transition
    setTimeout(() => (children.current = null), 500);
  }

  return <Dialog isOpen={!!data}>{children.current}</Dialog>;
};
