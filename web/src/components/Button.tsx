import classNames from "classnames";
import { Spinner } from "./Spinner";

export type ButtonVariant = "basic" | "primary";

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: ButtonVariant;
  isLoading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  basic: "",
};

export const Button = ({
  children,
  variant = "basic",
  type = "button",
  isLoading,
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      className={classNames("btn", variantClasses[variant])}
      type={type}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
};
