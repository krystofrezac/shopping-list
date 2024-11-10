import * as icons from "@heroicons/react/24/solid";
import classNames from "classnames";

export type IconButtonSize = "md" | "sm";
export type IconButtonColor = "normal" | "error";

export type IconButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  iconName: keyof typeof icons;
  size?: IconButtonSize;
  color?: IconButtonColor;
};

const iconSizeClasses: Record<IconButtonSize, string> = {
  md: "size-6",
  sm: "size-4",
};
const buttonSizeClasses: Record<IconButtonSize, string> = {
  md: "",
  sm: "btn-sm",
};
const colorClasses: Record<IconButtonColor, string> = {
  normal: "",
  error: "btn-error text-error",
};

export const IconButton = ({
  iconName,
  size = "md",
  color = "normal",
  ...rest
}: IconButtonProps) => {
  const Icon = icons[iconName];

  return (
    <button
      {...rest}
      className={classNames(
        "btn btn-ghost btn-circle",
        buttonSizeClasses[size],
        colorClasses[color],
      )}
    >
      <Icon className={iconSizeClasses[size]} />
    </button>
  );
};
