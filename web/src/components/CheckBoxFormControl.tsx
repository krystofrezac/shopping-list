import { ReactNode } from "react";

export type CheckBoxFormControl = {
  children: ReactNode;
  label: string;
};

export const CheckBoxFormControl = ({
  children,
  label,
}: CheckBoxFormControl) => (
  <div className="form-control flex items-start">
    <label className="label cursor-pointer flex gap-4">
      <span className="label-text">{label}</span>
      {children}
    </label>
  </div>
);
