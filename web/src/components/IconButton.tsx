import * as icons from "@heroicons/react/24/solid";

export type IconButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  iconName: keyof typeof icons;
};

export const IconButton = ({ iconName }: IconButtonProps) => {
  const Icon = icons[iconName];

  return (
    <button className="btn btn-ghost btn-circle">
      <Icon className="size-6" />
    </button>
  );
};
