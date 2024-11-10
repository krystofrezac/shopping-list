import classNames from "classnames";

export type CheckBoxProps = {
  checked: boolean;
  onChange: () => void;
};

export const CheckBox = ({ checked, onChange }: CheckBoxProps) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    className={classNames("checkbox", { "checkbox-primary": checked })}
  />
);
