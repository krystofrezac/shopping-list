import { ReactElement } from "react";

export type CardProps = {
  children: ReactElement;
};

export type CardBodyProps = {
  children: ReactElement;
};

export const Card = ({ children }: CardProps) => {
  return (
    <div className="card card-compact bg-base-100 shadow-md border border-base-200">
      {children}
    </div>
  );
};

export const CardBody = ({ children }: CardBodyProps) => (
  <div className="card-body">{children}</div>
);
